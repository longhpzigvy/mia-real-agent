import axios from 'axios';
import Mustache from 'mustache';
import _mapValues from 'lodash/mapValues';
import emailTemplates from './email-templates';
import Logger from '../logger';

const { SPARK_POST_DOMAIN, SPARK_POST_API_URL, SPARK_POST_API_KEY } = process.env;

const createContentFromTemplate = (template, data) => _mapValues(template, prop => Mustache.render(prop, data));


export const send = async (content, recipients) => {
  if (!SPARK_POST_API_URL) {
    Logger.error('SPARK_POST_API_URL not found');
    return;
  }
  if (!SPARK_POST_API_KEY) {
    Logger.error('SPARK_POST_API_KEY not found');
    return;
  }
  try {
    const config = {
      headers: {
        Authorization: SPARK_POST_API_KEY,
      },
    };
    const data = {
      // Remove this in production
      options: {
      },
      content,
      recipients,
    };
    const response = await axios.post(SPARK_POST_API_URL, data, config);
  } catch (error) {
    console.log(error);
    Logger.error('Error while trying to send mail', error);
  }
};


export const sendEmailTrascript = (user, ticket, messages) => {
  const content = createContentFromTemplate(emailTemplates.transcriptConverstion, { user, ticket, messages });
  return send({
    from: SPARK_POST_DOMAIN,
    subject: content.subject,
    html: content.html,
  }, [{ address: user.email }]);
};

export const sendEmailApplicationApproved = (application, password) => {
  const content = createContentFromTemplate(
    emailTemplates.applicationAccepted, { application, password }
  );
  return send({
    from: SPARK_POST_DOMAIN,
    subject: content.subject,
    html: content.html,
  }, [{ address: application.email }]);
};

export const sendEmailResetPassword = (email, token, url) => {
  const content = createContentFromTemplate(
    emailTemplates.resetPassword,
    { token, url }
  );
  return send({
    from: SPARK_POST_DOMAIN,
    subject: content.subject,
    html: content.html,
  }, [{ address: email }]);
};

export const sendEmailChangeRequest = (email, token, url) => {
  const content = createContentFromTemplate(
    emailTemplates.changeRequest,
    { token, url }
  );
  return send({
    from: SPARK_POST_DOMAIN,
    subject: content.subject,
    html: content.html,
  }, [{ address: email }]);
};

export const buildContent = (subject, text) => {
  if (!SPARK_POST_DOMAIN) {
    Logger.error('SPARK_POST_DOMAIN not found');
    return {};
  }
  return {
    from: SPARK_POST_DOMAIN,
    subject,
    text,
  };
};
