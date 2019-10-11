import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import BaseController from '../base/base.controller';
import UserService from './user.service';
import SystemService from '../system/system.service';
import BillingService from '../billing/billing.service';
import * as StripeService from '../stripe/stripe.service';
import APIError, { ERROR_MESSAGE } from '../../utils/APIError';
import check from '../../utils/validate';
import { VALIDATION_TYPE } from '../../../common/enums';
import { hashFunc, compareFunc } from '../../utils/bcrypt';
// import {
//   sendCreatePasswordMail,
//   sendChangePasswordMail,
//   sendUpdateProfileMail,
// } from '../../mail';
import { send, buildContent } from '../../mail-sparkpost/sparkpost';

class UserController extends BaseController {
  constructor() {
    super(UserService);
  }

  insert = async (req, res) => {
    try {
      const { email, password } = req.body;

      await check(email, VALIDATION_TYPE.EMAIL);
      await check(password, VALIDATION_TYPE.PASSWORD);

      const isEmailExist = await UserService.getByEmail(email);

      if (isEmailExist) {
        const { EMAIL_EXIST } = ERROR_MESSAGE;
        throw new APIError(EMAIL_EXIST, httpStatus.BAD_REQUEST);
      }

      const hash = await hashFunc(password);

      const user = {
        email,
        password: hash,
      };

      const userDoc = await UserService.insert(user);
      UserService.sendVericationEmail(email);

      return res.status(httpStatus.OK).json(userDoc);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async createUser(req, res) {
    try {
      const data = req.body;
      const newUser = await this.service.insert(data);

      return res.status(httpStatus.OK).send(newUser);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async assignRoles(req, res) {
    try {
      const {
        user,
        body: { newRole },
      } = req;

      await user.set('role', newRole);

      return res.status(httpStatus.OK).send(user);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async getUserProfile(req, res) {
    try {
      const { model } = req;
      const userProfile = await UserService.getUserProfile(model);

      return res.status(httpStatus.OK).send(userProfile);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async updateUserProfile(req, res) {
    try {
      const { model } = req;
      const { data } = req.body;
      const newUserProfile = await UserService.updateUserProfile(
        model,
        data,
      );
      // sendUpdateProfileMail(newUserProfile);
      return res.status(httpStatus.OK).send(newUserProfile);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async changePassword(req, res) {
    try {
      const { model: user } = req;
      const { oldPassword, newPassword } = req.body;
      await check(oldPassword, VALIDATION_TYPE.STRING);
      await check(newPassword, VALIDATION_TYPE.STRING);

      if (!user.password) {
        return this.createPassword(req, res);
      }
      const checkPassword = await compareFunc(oldPassword, user.password);
      if (!checkPassword) {
        const { PASSWORD_INCORRECT } = ERROR_MESSAGE;
        throw new APIError(PASSWORD_INCORRECT, httpStatus.FORBIDDEN);
      }

      user.password = await hashFunc(newPassword);
      // Update user's token
      const { _id } = user;
      const token = jwt.sign({ _id }, process.env.SECRET_KEY_JWT);
      user.set({ token });

      const result = await user.save();
      // sendChangePasswordMail(user);
      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async createPassword(req, res) {
    try {
      const { user } = req;
      const { newPassword } = req.body;
      await check(newPassword, VALIDATION_TYPE.PASSWORD);
      const newUserProfile = await UserService.createPassword(
        user,
        newPassword,
      );
      // sendCreatePasswordMail(user);
      return res.status(httpStatus.OK).send(newUserProfile);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async checkPassword(req, res) {
    try {
      const { userId, password } = req.body;
      const confirmed = await UserService.checkPassword(
        userId,
        password,
      );
      return res.status(httpStatus.OK).send({ confirmed });
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async addCreditCard(req, res) {
    try {
      const { model: user } = req;
      const { card } = req.body;
      let { stripeCustomerId } = user;
      const { creditCard } = user;
      if (!stripeCustomerId) {
        const customer = await StripeService.createCustomer(user);
        stripeCustomerId = customer.id;
        user.set({ stripeCustomerId });
        await user.save();
      }
      const { id: source } = card || {};
      const result = await StripeService.createCard(stripeCustomerId, {
        source,
      });
      const { id: cardId, brand, last4 } = result;
      creditCard.push({ type: brand, last4Digits: last4, apiKey: cardId });
      user.set({ creditCard });
      await user.save();

      return res.status(httpStatus.OK).send(user);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async removeCard(req, res) {
    try {
      const { model: user } = req;
      const { cardId } = req.body;
      let { stripeCustomerId } = user;
      const { creditCard } = user;
      if (!stripeCustomerId) {
        const customer = await StripeService.createCustomer(user);
        stripeCustomerId = customer.id;
        user.set({ stripeCustomerId });
        await user.save();
      }
      const result = creditCard.find(({ _id }) => _id.toString() === cardId);
      if (result) {
        await StripeService.removeCard(stripeCustomerId, result.apiKey);
      } else {
        const { CONTENT_NOT_FOUND } = ERROR_MESSAGE;
        throw new APIError(CONTENT_NOT_FOUND, httpStatus.NOT_FOUND);
      }
      user.set({ creditCard: creditCard.filter(({ _id }) => _id.toString() !== cardId) });
      await user.save();

      return res.status(httpStatus.OK).send(user);
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async topUp(req, res) {
    try {
      const { model: user } = req;
      const { cardId, amount } = req.body;
      const {
        stripeCustomerId, creditTime, creditCard, _id: userId,
      } = user;
      const result = creditCard.find(({ _id }) => _id.toString() === cardId);
      if (result && stripeCustomerId) {
        await StripeService.createCharge(stripeCustomerId, result.apiKey, amount * 100, 'Topup');
      } else {
        const { CONTENT_NOT_FOUND } = ERROR_MESSAGE;
        throw new APIError(CONTENT_NOT_FOUND, httpStatus.NOT_FOUND);
      }
      const { exchangeRate } = await SystemService.getCurrentVersion();
      user.set({ creditTime: +creditTime + (amount * exchangeRate) });
      await user.save();
      await BillingService.topUpBilling(
        userId,
        {
          creditTime,
          cardId,
          exchangeRate,
        }, {
          amount,
        }
      );
      return res.status(httpStatus.OK).send(user);
    } catch (error) {
      return super.handleError(res, error);
    }
  }


  async sendTestMail(req, res) {
    try {
      send(buildContent('test', 'testing'),
        [{ address: 'vucuongjim@gmail.com' }]);
      return res.status(httpStatus.OK).send();
    } catch (error) {
      return super.handleError(res, error);
    }
  }

  async upload(req, res) {
    const { filename, filetype } = req.body;
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      useAccelerateEndpoint: true,
    });
    const fileurls = [];

    const signedUrlExpireSeconds = 60 * 60;
    const myBucket = 'mia-consult';
    const myKey = filename;
    const params = {
      Bucket: myBucket,
      Key: myKey,
      Expires: signedUrlExpireSeconds,
      ContentType: filetype,
      ACL: 'public-read',
    };
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        res.json({ success: false, message: 'Pre- Signed URL error', urls: fileurls });
      } else {
        fileurls[0] = url;
        res.json({
          success: true,
          message: 'AWS SDK S3 Pre- signed urls generated successfully.',
          urls: fileurls,
          fileUrl: `https://${myBucket}.${process.env.AWS_S3_URL}/${myKey}`,
        });
      }
    });
  }
}

export default new UserController();
