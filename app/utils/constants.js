import ls from 'local-storage';
import * as Yup from 'yup';
import { toI18n } from './func-utils';
import {
  AGENT_SKILL, CATEGORY_OPTIONS, FIELD_OF_STUDY,
  MARKS, LANGUAGE_OPTIONS,
} from '../../common/enums';
export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const LNG_CODE = {
  EN: 'en',
  VN: 'vn',
};

export const DEFAULT_ERROR_MESSAGE = 'Something has wrong';

const i18nextLng = ls.get('i18nextLng');

export const NUMERAL_MONEY_FORMAT = '$0.00';

export const DATE_TIME_FORMAT = (i18nextLng === 'vn') ? {
  DATE: 'Do MMMM YYYY',
  TIME: 'H:mm',
  DATE_TIME: 'Do MMM YYYY, H:mm',
  DATE_RANGE: 'DD-MM-YYYY',
}
  : {
    DATE: 'MMMM Do YYYY',
    TIME: 'H:mm',
    DATE_TIME: 'MMM Do YYYY, H:mm',
    DATE_RANGE: 'YYYY-MM-DD',
  };


export const COLUMN_TYPE = {
  TEXT: 'text',
  LINK: 'link',
  IMAGE: 'image',
  DATE: 'date',
  ACTIVE: 'active',
  ROLE: 'role',
  TOTAL: 'total',
  STATUS: 'status',
  ROLE_BUTTON_GROUP: 'role-button-group',
  UPPERCASE: 'uppercase',
  ARRAY: 'array',
  ACTIONS: 'actions',
  TYPE: 'type',
};

export const SORT = {
  CANNED_RESPONSE_SORT: [{
    title: 'Created Time',
    value: 'createdAt',
  }],
  TICKET_SORT: [
    {
      title: 'Created Time',
      value: 'createdAt',
    },
    {
      title: 'Category',
      value: 'category',
    },
    {
      title: 'Title',
      value: 'title',
    },
  ],
  USER_SORT: [
    {
      title: 'Username',
      value: 'username',
    },
    {
      title: 'Email',
      value: 'email',
    },
    {
      title: 'Role',
      value: 'role',
    },
  ],
  APPLICATION_SORT: [
    {
      title: 'Email',
      value: 'email',
    },
  ],
};


export const ROUTE_DETAIL = {
  USER_DETAIL_ROUTER: '/admin/user/:id',
  APPLICATION_DETAIL_ROUTER: '/admin/applications/:id',
  TICKET_DETAIL_ROUTER: '/admin/tickets/:id',
  TICKET_WARNING_ROUTER: '/admin/tickets-warning/:id',
  INTENT_DETAIL_ROUTER: '/admin/intents/:id',
  FEEDBACK_DETAIL_ROUTER: '/admin/feedbacks/:id',
  BILLING_DETAIL_ROUTER: '/billing/:id',
};

const matchString = (string, match) => {
  if (string.includes(match) || match.includes(string)) {
    return true;
  }
  return false;
};

// eslint-disable-next-line func-names
Yup.addMethod(Yup.string, 'checkNickname', function (firstNameRef, lastNameRef) {
  const message = toI18n('APPLICATION_BASIC_INFO_FORM_NICKNAME_CANNOT_MATCH');
  // eslint-disable-next-line func-names
  return this.test('test-checkNickname', message, function (value) {
    const { path, createError } = this;
    const firstName = this.resolve(firstNameRef);
    const lastName = this.resolve(lastNameRef);
    if (firstName && lastName && value) {
      const upFN = firstName.toUpperCase();
      const upLN = lastName.toUpperCase();
      const upValue = value.toUpperCase();
      if (matchString(upValue, upFN) || matchString(upValue, upLN)) {
        return createError({ path, message });
      }
    }
    return true;
  });
});

export const APPLICATION_FORM = {
  BASIC_INFO_VALIDATION_SCHEMA: Yup.object().shape({
    nickname: Yup
      .string().trim().required(toI18n('FORM_REQUIRED'))
      .checkNickname(Yup.ref('firstName'), Yup.ref('lastName')),
    firstName: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    lastName: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    email: Yup.string().email(toI18n('FORM_INVALID_MAIL')).trim().required(toI18n('FORM_REQUIRED')),
    country: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    postcode: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    address: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    phoneNumber: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
  }),
  EXPERIENCE_WORK_ITEM_VALIDATION_SCHEMA: Yup.object().shape({
    title: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    company: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    location: Yup.string().trim(),
    isWorking: Yup.boolean(),
    from: Yup.date()
      .when('isWorking', {
        is: true,
        then: Yup.date().required(toI18n('FORM_REQUIRED')),
        otherwise: Yup.date().required(toI18n('FORM_REQUIRED')).max(Yup.ref('to'), toI18n('FORM_PASSWORD_FROM_CANNOT_EXCEED_TO')),
      }),
    to: Yup.date()
      .when('isWorking', {
        is: true,
        then: Yup.date(),
        otherwise: Yup.date().required(toI18n('FORM_REQUIRED')).min(Yup.ref('from'), toI18n('FORM_PASSWORD_TO_CANNOT_LOWER_FORM')),
      }),
    roleDescription: Yup.string().trim(),
  }),
  EXPERIENCE_VALIDATION_SCHEMA: Yup.object().shape({
    categories: Yup.array().of(Yup.string()).required(toI18n('FORM_REQUIRED')),
    workExperiences: Yup.array().of(Yup.object()),
  }),
  EDUCATION_ITEM_VALIDATION_SCHEMA: Yup.object().shape({
    school: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    degree: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    certificate: Yup.array().of(Yup.object()).required(toI18n('FORM_REQUIRED')),
    fieldOfStudy: Yup.array().of(Yup.string()).required(toI18n('FORM_REQUIRED')),
    gpa: Yup.number().min(0).max(5).required(toI18n('FORM_REQUIRED')),
  }),
  EDUCATION_VALIDATION_SCHEMA: Yup.object().shape({
    educations: Yup.array().of(
      Yup.object().shape({
        school: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
        degree: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
        certificate: Yup.array().of(Yup.object()).required(toI18n('FORM_REQUIRED')),
        fieldOfStudy: Yup.array().of(Yup.string()).required(toI18n('FORM_REQUIRED')),
        gpa: Yup.number().min(0).max(5).required(toI18n('FORM_REQUIRED')),
      })
    ),
  }),
  LANGUAGE_VALIDATION_SCHEMA: Yup.object().shape({
    name: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
    writing: Yup.number().min(1).max(5).required(toI18n('FORM_REQUIRED')),
    reading: Yup.number().min(1).max(5).required(toI18n('FORM_REQUIRED')),
    speaking: Yup.number().min(1).max(5).required(toI18n('FORM_REQUIRED')),
    overall: Yup.number().min(1).max(5).required(toI18n('FORM_REQUIRED')),
  }),
  ADDITIONAL_VALIDATION_SCHEMA: Yup.object().shape({
    cv: Yup.array().of(Yup.object()).required(toI18n('FORM_REQUIRED')),
    skills: Yup.array().of(Yup.string()).required(toI18n('FORM_REQUIRED')),
    languages: Yup.array().of(Yup.object().shape({
      name: Yup.string().trim().required(toI18n('FORM_REQUIRED')),
      writing: Yup.number().min(1).max(5).required(toI18n('FORM_REQUIRED')),
      reading: Yup.number().min(1).max(5).required(toI18n('FORM_REQUIRED')),
      speaking: Yup.number().min(1).max(5).required(toI18n('FORM_REQUIRED')),
      overall: Yup.number().min(1).max(5).required(toI18n('FORM_REQUIRED')),
    })),
    social: Yup.object().shape({
      linkedin: Yup.string().trim(),
      facebook: Yup.string().trim(),
      zalo: Yup.string().trim(),
      github: Yup.string().trim(),
      gitlab: Yup.string().trim(),
      stackOverflows: Yup.string().trim(),
      twitter: Yup.string().trim(),
      websites: Yup.array().of(Yup.string()),
    }),
  }),
};

export const APPLICATION_REVIEW_MAPPING = {
  nickname: {
    label: toI18n('APPLICATION_REVIEW_FORM_NICKNAME'),
    type: 'text',
    ref: ['firstName', 'lastName'],
    schema: 'BASIC_INFO_VALIDATION_SCHEMA',
  },
  firstName: {
    label: toI18n('APPLICATION_REVIEW_FORM_FIRSTNAME'),
    type: 'text',
    schema: 'BASIC_INFO_VALIDATION_SCHEMA',
  },
  lastName: {
    label: toI18n('APPLICATION_REVIEW_FORM_LASTNAME'),
    type: 'text',
    schema: 'BASIC_INFO_VALIDATION_SCHEMA',
  },
  email: {
    label: toI18n('APPLICATION_REVIEW_FORM_EMAIL'),
    type: 'text',
    schema: 'BASIC_INFO_VALIDATION_SCHEMA',
  },
  country: {
    label: toI18n('APPLICATION_REVIEW_FORM_COUNTRY'),
    type: 'text',
    schema: 'BASIC_INFO_VALIDATION_SCHEMA',
  },
  postcode: {
    label: toI18n('APPLICATION_REVIEW_FORM_POSTCODE'),
    type: 'text',
    schema: 'BASIC_INFO_VALIDATION_SCHEMA',
  },
  address: {
    label: toI18n('APPLICATION_REVIEW_FORM_ADDRESS'),
    type: 'text',
    schema: 'BASIC_INFO_VALIDATION_SCHEMA',
  },
  phoneNumber: {
    label: toI18n('APPLICATION_REVIEW_FORM_PHONE'),
    type: 'text',
    schema: 'BASIC_INFO_VALIDATION_SCHEMA',
  },
  cv: {
    label: toI18n('APPLICATION_REVIEW_FORM_CV'),
    type: 'upload',
    schema: 'ADDITIONAL_VALIDATION_SCHEMA',
  },
  categories: {
    label: toI18n('APPLICATION_REVIEW_FORM_CATEGORIES'),
    type: 'select',
    options: CATEGORY_OPTIONS,
    mode: 'multiple',
    schema: 'EXPERIENCE_VALIDATION_SCHEMA',
  },
  skills: {
    label: toI18n('APPLICATION_REVIEW_FORM_SKILLS'),
    type: 'select',
    options: AGENT_SKILL,
    mode: 'multiple',
    schema: 'ADDITIONAL_VALIDATION_SCHEMA',
  },
  workExperiences: {
    label: toI18n('APPLICATION_REVIEW_FORM_WORK_EXPERIENCES'),
    type: 'list',
    schema: 'EXPERIENCE_WORK_ITEM_VALIDATION_SCHEMA',
    fields: {
      title: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_TITLE'),
        type: 'text',
      },
      company: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_COMPANY'),
        type: 'text',
      },
      location: {
        label: toI18n('APPLICATION_EXPERIENCE_FORM_LOCATION'),
        type: 'text',
      },
      from: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_FROM'),
        type: 'date',
      },
      to: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_TO'),
        type: 'date',
        skip: 'isWorking',
      },
      isWorking: {
        label: toI18n('APPLICATION_EXPERIENCE_FORM_CURRENT_WORKING'),
        type: 'checkbox',
      },
      roleDescription: {
        label: toI18n('APPLICATION_EXPERIENCE_FORM_ROLE_DESCRIPTION'),
        type: 'textarea',
      },
    },
    displayFields: {
      title: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_TITLE'),
        type: 'text',
        tooltip: 'roleDescription',
      },
      company: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_COMPANY'),
        type: 'text',
      },
      from: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_FROM'),
        type: 'date',
      },
      to: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_TO'),
        type: 'date',
        skip: 'isWorking',
        replace: toI18n('APPLICATION_REVIEW_FORM_LIST_NOW'),
      },
    },
  },
  educations: {
    label: toI18n('APPLICATION_REVIEW_FORM_EDUCATIONS'),
    type: 'list',
    schema: 'EDUCATION_ITEM_VALIDATION_SCHEMA',
    fields: {
      fieldOfStudy: {
        label: toI18n('APPLICATION_EDUCATION_FORM_FOS'),
        type: 'select',
        mode: 'multiple',
        options: FIELD_OF_STUDY,
      },
      school: {
        label: toI18n('APPLICATION_EDUCATION_FORM_SCHOOL'),
        type: 'text',
      },
      degree: {
        label: toI18n('APPLICATION_EDUCATION_FORM_DEGREE'),
        type: 'text',
      },
      gpa: {
        label: toI18n('APPLICATION_EDUCATION_FORM_GPA'),
        type: 'number',
      },
      certificate: {
        label: toI18n('APPLICATION_EDUCATION_FORM_CERTIFICATE'),
        type: 'upload',
      },
    },
    displayFields: {
      fieldOfStudy: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_FOS'),
        type: 'text',
      },
      school: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_SCHOOL'),
        type: 'text',
      },
      degree: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_DEGREE'),
        type: 'text',
      },
      gpa: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_GPA'),
        type: 'text',
      },
      certificate: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_CERTIFICATE'),
        type: 'upload',
      },
    },
  },
  languages: {
    label: toI18n('APPLICATION_REVIEW_FORM_LANGUAGES'),
    type: 'list',
    schema: 'LANGUAGE_VALIDATION_SCHEMA',
    fields: {
      name: {
        label: toI18n('APPLICATION_ADDTIONAL_FORM_NAME'),
        type: 'select',
        options: LANGUAGE_OPTIONS,
      },
      writing: {
        label: toI18n('APPLICATION_ADDTIONAL_FORM_WRITING'),
        type: 'slider',
        marks: MARKS,
        min: 1,
        max: 5,
      },
      reading: {
        label: toI18n('APPLICATION_ADDTIONAL_FORM_READING'),
        type: 'slider',
        marks: MARKS,
        min: 1,
        max: 5,
      },
      speaking: {
        label: toI18n('APPLICATION_ADDTIONAL_FORM_SPEAKING'),
        type: 'slider',
        marks: MARKS,
        min: 1,
        max: 5,
      },
      overall: {
        label: toI18n('APPLICATION_ADDTIONAL_FORM_OVERALL'),
        type: 'slider',
        marks: MARKS,
        min: 1,
        max: 5,
      },
    },
    displayFields: {
      name: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_NAME'),
        type: 'text',
      },
      writing: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_WRITING'),
        type: 'text',
      },
      reading: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_READING'),
        type: 'text',
      },
      speaking: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_SPEAKING'),
        type: 'text',
      },
      overall: {
        label: toI18n('APPLICATION_REVIEW_FORM_LIST_OVERALL'),
        type: 'text',
      },
    },
  },
};

export const MIA_RATE = 5;
