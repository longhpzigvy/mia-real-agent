import _isEmpty from 'lodash/isEmpty';
import ticketCollection from './ticket.model';
import BaseService from '../base/base.service';
import { TICKET_STATUS, REPLY_TYPE, BILLING_TYPE } from '../../../common/enums';
// eslint-disable-next-line import/no-cycle
import ReplyService from '../reply/reply.service';
import ApplicationService from '../application/application.service';
import ConversationRoomQueue from '../queue/conversationRoomQueue';
import { getHistoryTicketUpdate } from '../../utils/utils';
import { sendEmailTrascript } from '../../mail-sparkpost/sparkpost';
import UserService from '../user/user.service';
import BillingService from '../billing/billing.service';
import { conversationTranscript } from '../../mail-sparkpost/dynamicTemplate';
import { ticketAdminAggregration, ticketWarningAdminAggregration, directChargeTicket, totalTicketWarningAggregration } from './ticket.utils';
import { MIA_RATE } from '../../../app/utils/constants';
import { calculateChargeTime } from '../../../app/utils/func-utils';

class TicketService extends BaseService {
  constructor(collection) {
    super(collection);
    this.countDocument = this.countDocument.bind(this);
    this.getByCondition = this.getByCondition.bind(this);
    this.sendTransciptConverstion = this.sendTransciptConverstion.bind(this);
    this.handleTicketUpdateStatus(collection);
  }

  getByCondition(condition) {
    return this.collection.findOne(condition)
      .populate({ path: 'owner', select: ['_id', 'profile', 'role', 'username'] }) // only get _id and username of owner
      .populate({
        path: 'assignee',
        select: ['_id', 'rating', 'application'],
        populate: ({ path: 'application', select: ['nickname', 'billingRate'] }),
      });
  }

  getAllByConditionWithPopulationInfo(condition, population) {
    return this.collection.find(condition).populate(population);
  }

  countDocument(filter) {
    return this.collection.countDocuments(filter);
  }

  async updateStatus(ticketId, status) {
    const ticket = await this.collection.findOne({ _id: ticketId });
    const { history, status: prevStatus } = ticket;
    if (status !== prevStatus) {
      const oldHistory = history.map(h => h.toJSON());
      const newHistory = getHistoryTicketUpdate(oldHistory, status);
      return this.update(ticketId, { status, history: newHistory });
    }
    return true;
  }

  async updateProcessingTime(ticketId) {
    return this.update(ticketId, { processingDate: new Date() });
  }

  async getAllForAdmin(condition, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const notDeletedCondition = {
      deletedAt: null,
    };
    const notArchivedCondition = {
      archivedAt: null,
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition, notArchivedCondition],
    };
    const resultPromise = this.collection
      .aggregate(ticketAdminAggregration(queryCondition, Number(limit), Number(skip), sort))
      .exec();
    return {
      result: await resultPromise,
      totalRecord: await this.countDocument(queryCondition),
    };
  }

  async getAllWarningForAdmin(condition, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const notDeletedCondition = {
      deletedAt: null,
    };
    const notArchivedCondition = {
      archivedAt: null,
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition, notArchivedCondition],
    };
    const resultPromise = this.collection
      .aggregate(ticketWarningAdminAggregration(queryCondition, Number(limit), Number(skip), sort))
      .exec();
    const { totalRecord } = (await this.collection.aggregate(totalTicketWarningAggregration(queryCondition)).exec())[0];
    return {
      result: await resultPromise,
      totalRecord,
    };
  }

  async getAllWithUserData(condition, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const notDeletedCondition = {
      deletedAt: null,
    };
    const notArchivedCondition = {
      archivedAt: null,
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition, notArchivedCondition],
    };
    const resultPromise = this.collection
      .find(queryCondition, null, options)
      .populate({ path: 'owner', select: ['_id', 'profile', 'role', 'username'] }) // only get _id and username of owner
      .populate({
        path: 'assignee',
        select: ['_id', 'rating', 'application'],
        populate: ({ path: 'application', select: ['nickname', 'billingRate'] }),
      })
      .sort(sort)
      .skip(+skip)
      .limit(+limit || 10)
      .exec();

    return {
      result: await resultPromise,
      totalRecord: await this.countDocument(queryCondition),
    };
  }

  async getAll(condition, options) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    const notDeletedCondition = {
      deletedAt: null,
    };
    const notArchivedCondition = {
      archivedAt: null,
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition, notArchivedCondition],
    };

    const resultPromise = this.collection
      .find(queryCondition, null, options)
      .sort(sort)
      .skip(+skip)
      .limit(+limit || 10)
      .exec();

    return {
      result: await resultPromise,
      totalRecord: await this.countDocument(queryCondition),
    };
  }

  async getAllByOwner(owner) {
    const result = await this.collection.find({ owner }).exec();
    return result;
  }

  async getTicketCount(query) {
    const result = await this.collection.find(query).count();
    return result;
  }

  async handleTicketOffline(user) {
    const { _id } = user;
    const query = {
      status: { $in: [TICKET_STATUS.IDLE, TICKET_STATUS.PROCESSING] },
      $or: [
        { owner: _id },
        { assignee: _id },
      ],
    };
    const tickets = await this.collection.find(query).exec();
    await this.handleUpdateTicketStatusHistory(query, TICKET_STATUS.OFFLINE);
    await this.collection.updateMany(query, { status: TICKET_STATUS.OFFLINE }).exec();
    return tickets;
  }

  async handleTicketOnline(user) {
    const { _id } = user;
    const query = {
      status: TICKET_STATUS.OFFLINE,
      $or: [
        { owner: _id },
        { assignee: _id },
      ],
    };
    const tickets = await this.collection.find(query).exec();
    await this.handleUpdateTicketStatusHistory(query, TICKET_STATUS.IDLE);
    await this.collection.updateMany(query, { status: TICKET_STATUS.IDLE }).exec();
    return tickets;
  }

  async handleChargeTicket(ticket) {
    const {
      processingDate, owner, _id, assignee,
    } = ticket;
    if (!processingDate) {
      return true;
    }
    const { _id: userId } = owner;
    const user = await UserService.getById(userId);
    const { creditCard, stripeCustomerId } = user;
    const {
      timeBeforeChat,
      openingTime,
      processingTime,
      remainingOpeningTime,
      remainingProcessingTime,
      userCreditTime,
      remainingCreditTime,
    } = calculateChargeTime(ticket, user);
    let needDirectCharge = false;
    // Direct charge if has remaining ticket time
    let miaFee = 0;
    let agentFee = 0;
    let agentRate = 0;
    let chargeAmount = 0;
    if ((remainingOpeningTime > 0 || remainingProcessingTime > 0)
      && (!_isEmpty(creditCard) && stripeCustomerId)) {
      needDirectCharge = true;
      // Convert usedTime to $
      if (remainingOpeningTime > 0) {
        miaFee = Number(MIA_RATE * remainingOpeningTime / 60).toFixed(2);
      }
      if (remainingProcessingTime > 0 && assignee) {
        const { _id: assigneeId } = assignee;
        const { application } = await UserService.getById(assigneeId);
        agentRate = (await ApplicationService.get(application)).billingRate;
        agentFee = Number(agentRate * remainingProcessingTime / 60).toFixed(2);
      }
      chargeAmount = (+miaFee + +agentFee) >= 0.5 ? +miaFee + +agentFee : 0.5;
      needDirectCharge = !await directChargeTicket(
        _id, creditCard, stripeCustomerId, miaFee, agentFee,
      );
    }

    // Change success
    if ((remainingOpeningTime <= 0 && remainingProcessingTime <= 0)
      || !needDirectCharge) {
      // Update user credit time
      if (userCreditTime !== remainingCreditTime) {
        await UserService.update(userId, { creditTime: remainingCreditTime });
      }
      // Save charge history
      await BillingService.ticketChargeBilling(
        userId,
        {
          userCreditTime,
          ticketId: _id,
          timeBeforeChat,
          openingTime,
          processingTime,
          miaRate: MIA_RATE,
          agentRate,
        },
        {
          usedCreditTime: userCreditTime - remainingCreditTime,
          chargeAmount,
          miaFee,
          agentFee,
        }
      );
      if (processingTime > 0) {
        const { _id: assigneeId } = assignee;
        // Add billing for agent
        await BillingService.insert(
          {
            userId: assigneeId,
            type: BILLING_TYPE.TICKET_FULFILL,
            content: {
              ticketId: _id,
              processingTime,
              agentRate,
            },
            total: {
              agentFee,
            },
          }
        );
        await UserService.update(
          assigneeId,
          { $inc: { credit: Number(agentFee) } }
        );
      }
      return true;
    }
    return false;
  }

  async handleCloseTicket(query) {
    await this.handleUpdateTicketStatusHistory(query, TICKET_STATUS.SOLVED);
    const tickets = await this.collection.updateMany(query, { status: TICKET_STATUS.SOLVED }).exec();
    return tickets;
  }

  async handleTicketIdle(ticketId) {
    const query = {
      status: TICKET_STATUS.PROCESSING,
      _id: ticketId,
    };
    await this.handleUpdateTicketStatusHistory(query, TICKET_STATUS.IDLE);
    const tickets = await this.collection.update(query, { status: TICKET_STATUS.IDLE }).exec();
    return tickets;
  }

  async handleTicketOpen(ticketId) {
    const query = {
      status: TICKET_STATUS.PENDING,
      _id: ticketId,
    };
    await this.handleUpdateTicketStatusHistory(query, TICKET_STATUS.OPEN);
    const tickets = await this.collection.update(query, { status: TICKET_STATUS.OPEN }).exec();
    return tickets;
  }

  async sendTransciptConverstion(ticket, conversationId) {
    const repliesMessages = await ReplyService.getByConversationForTranscript(conversationId);

    const messagesText = conversationTranscript(repliesMessages);

    const user = await UserService.getById(ticket.owner);
    return sendEmailTrascript(user, ticket, messagesText);
  }

  async handleUpdateTicketStatusHistory(query, status) {
    const tickets = await this.collection.find(query).exec();
    if (Array.isArray(tickets) && tickets.length > 0) {
      await Promise.all(tickets.map((ticket) => {
        const currTicket = ticket;
        const { history } = ticket;
        const oldHistory = history.map(h => h.toJSON());
        const newHistory = getHistoryTicketUpdate(oldHistory, status);
        currTicket.history = newHistory;
        return currTicket.save();
      }));
    }
  }

  handleTicketUpdateStatus(collection) {
    collection.watch().on('change', async (change) => {
      const { updateDescription, documentKey } = change;
      if (updateDescription) {
        const { updatedFields } = updateDescription;
        const { status, updatedAt } = updatedFields;
        if (status) {
          const { _id } = documentKey;
          const { conversationId } = await this.collection.findOne(_id);
          ReplyService.insert({
            conversationId,
            messages: 'Ticket Update',
            type: REPLY_TYPE.TICKET_STATUS,
            params: { status },
            sentAt: updatedAt,
          });
          // Emit Update ticket for user in conversation room
          ConversationRoomQueue.ticketUpdateNotification(conversationId, _id);
        }
      }
    });
  }
}

export const closeTicketOfflineQuery = ({ _id: userId }) => ({
  status: TICKET_STATUS.OFFLINE,
  $or: [
    { owner: userId },
    { assignee: userId },
  ],
});

export const closeTicketInProgressQuery = ({ _id: userId }) => ({
  status: TICKET_STATUS.PROCESSING,
  assignee: userId,
});

export default new TicketService(ticketCollection);
