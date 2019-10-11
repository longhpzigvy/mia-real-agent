import fs from 'fs';
import path from 'path';

const getTemplate = templateName => fs.readFileSync(
  path.resolve(__dirname, 'templates', `${templateName}.html`),
  'utf8',
);

// templates
const defaultTemplate = getTemplate('default-template');
const contactMessagePosted = getTemplate('contact-message-posted');
const userPasswordChanged = getTemplate('user-password-changed');
const userPasswordCreated = getTemplate('user-password-created');
const userProfileUpdated = getTemplate('user-profile-updated');
const userRegisterSucceed = getTemplate('user-register-succeed');
const transcriptConversation = getTemplate('transcript-conversation');
const applicationAccepted = getTemplate('application-accepted');
const resetPassword = getTemplate('reset-password');
const changeRequest = getTemplate('change-request');


const applyDefaultTemplate = content => defaultTemplate.replace('[MAIN_CONTENT]', content);

export default {
  resetPassword: {
    subject: 'Mia Consults - Reset Password',
    html: applyDefaultTemplate(resetPassword),
  },
  changeRequest: {
    subject: 'Mia Consults - Change Request',
    html: applyDefaultTemplate(changeRequest),
  },
  transcriptConverstion: {
    subject: 'Mia Consults - Conversation history',
    html: applyDefaultTemplate(transcriptConversation),
  },
  applicationAccepted: {
    subject: 'Mia Consults - Application Accepted',
    html: applyDefaultTemplate(applicationAccepted),
  },
  contactMessagePostedMail: {
    subject: 'MIA-Consult - Question box',
    html: applyDefaultTemplate(contactMessagePosted),
  },
  userPasswordChangedMail: {
    subject: 'MIA-Consult - Your password has been changed',
    html: applyDefaultTemplate(userPasswordChanged),
  },
  userPasswordCreatedMail: {
    subject: 'MIA-Consult - Your password has been created',
    html: applyDefaultTemplate(userPasswordCreated),
  },
  userProfileUpdatedMail: {
    subject: 'MIA-Consult - Your profile has been updated',
    html: applyDefaultTemplate(userProfileUpdated),
  },
  userRegisterSucceedMail: {
    subject:
      'MIA-Consult Wellcome - You have registered MIA-Consult account successfully!',
    html: applyDefaultTemplate(userRegisterSucceed),
  },
};
