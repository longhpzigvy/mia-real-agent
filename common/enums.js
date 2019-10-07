export const VALIDATION_ERROR_MESSAGE = {
  REQUIRED: 'Required',
  INVALID: 'Invalid',
  TOO_SHORT: 'Too Short',
  TOO_LONG: 'Too Long',
  PHONE_INVALID: 'Phone number is not valid',
  PASSWORD_INVALID:
    'Password (UpperCase, LowerCase and Number) with length 6 and 50 character',
  CONFIRM_PASSWORD: 'The confirm password is not the same the password',
};

export const VALIDATION_TYPE = {
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  STRING: 'STRING',
};

export const ROLES = {
  ADMIN: 'admin',
  INDIVIDUAL: 'individual',
  AGENT: 'agent',
  BUSINESS: 'business',
  FREELANCER: 'Freelancer',
  DEDICATED: 'Dedicated',
  EMPLOYEE: 'employee',
  MIA_AGENT: 'mia_agent',
};

export const TICKET_STATUS = {
  OPEN: 'Open',
  SOLVED: 'Solved',
  UNSOLVED: 'Unsolved',
  PENDING: 'Pending',
  IDLE: 'Idle',
  PROCESSING: 'Processing',
  OFFLINE: 'Offline',
};

export const CLOSED_TICKET_STATUSES = [
  TICKET_STATUS.SOLVED,
  TICKET_STATUS.UNSOLVED,
];

export const COLOR_BY_ACTION = {
  'Accept Request': '#449bea',
  Online: '#05ca05',
  'Request Agent': '#f7d00f',
  Offline: '#8e8e8e',
};

export const COLOR_BY_STATUS = {
  Open: '#449bea',
  Solved: '#d4101e',
  Unsolved: '#d4101e',
  Pending: '#449bea',
  Processing: '#05ca05',
  Idle: '#f7d00f',
  'Requested Change': '#ff5402',
  Offline: '#8e8e8e',
  Approved: '#05ca05',
  Rejected: '#b52d2d',
  Closed: '#898c8e',
};

export const POPUP_TYPE = {
  CONFIRM: 'confirm',
  ERROR: 'error',
  MESSAGE: 'message',
};

export const POSITION_OPTIONS = [
  {
    label: 'IT',
    value: 'IT',
  },
  {
    label: 'CEO',
    value: 'CEO',
  },
  {
    label: 'John Wick',
    value: 'John Wick',
  },
];

export const SIZE_OPTIONS = [
  {
    label: 'Self-employed',
    value: 'A',
  },
  {
    label: '1-10 employees',
    value: 'B',
  },
  {
    label: '11-50 employees',
    value: 'C',
  },
  {
    label: '51-200 employees',
    value: 'D',
  },
  {
    label: '201-500 employees',
    value: 'E',
  },
  {
    label: '501-1000 employees',
    value: 'F',
  },
  {
    label: '1001-5000 employees',
    value: 'G',
  },
  {
    label: '5001-10,000 employees',
    value: 'H',
  },
  {
    label: '10,001+ employees',
    value: 'I',
  },
];

export const FIELD_OPTIONS = [
  {
    label: 'IT',
    value: 'IT',
  },
  {
    label: 'Consultant',
    value: 'Consultant',
  },
  {
    label: 'Accounting',
    value: 'Accounting',
  },
];

export const CATEGORY_OPTIONS = [
  {
    label: 'Tax',
    value: 'Tax',
  },
  {
    label: 'Payroll',
    value: 'Payroll',
  },
  {
    label: 'HR',
    value: 'HR',
  },
  {
    label: 'Legal',
    value: 'Legal',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

export const APPLICATION_STATUS = {
  PENDING: 'Pending',
  REJECTED: 'Rejected',
  REVIEWING: 'Reviewing',
  REQUESTED_CHANGE: 'Requested Change',
  APPROVED: 'Approved',
};

export const APPLICATION_TYPE = {
  FREELANCER: 'Freelancer',
  DEDICATED: 'Dedicated',
};

export const APPLICATION_OPTION = [{
  label: 'Freelancer',
  value: 'Freelancer',
},
{
  label: 'Dedicated',
  value: 'Dedicated',
}];

export const APPLICATION_LANGUAGE = {
  VIETNAMESE: 'Vietnamese',
  CHINESE: 'Chinese',
  JANPANESE: 'Japanese',
  ENGLISH: 'English',
};

export const REPLY_TYPE = {
  USER_NORMAL: 'USER_NORMAL',
  BOT_RESPONSE: 'BOT_RESPONSE',
  USER_MISC: 'USER_MISC', // MEDIA, VIDEO, IMAGE, FILES, ETC
  SYSTEM_NOTIFICATION: 'SYSTEM_NOTIFICATION',
  TICKET_STATUS: 'TICKET_STATUS',
  USER_ACTION: 'USER_ACTION',
  RATING_ACTION: 'RATING_ACTION',
  WARNING_ACTION: 'WARNING_ACTION',
};

export const BOT_AVATAR = '/assets/images/mia-avatar.jpg';
export const DEFAULT_USER_AVATAR = '/assets/images/user.svg';

export const REPLY_TYPE_SORT = {
  USER_NORMAL: 0,
  BOT_RESPONSE: 1,
  USER_MISC: 'USER_MISC', // MEDIA, VIDEO, IMAGE, FILES, ETC
  SYSTEM_NOTIFICATION: 2,
  TICKET_STATUS: 3,
  USER_ACTION: 4,
  RATING_ACTION: 5,
  WARNING_ACTION: 6,
};

export const REPLY_USER_ACTION = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  REQUEST_AGENT: 'Request Agent',
  ACCEPT_REQUEST: 'Accept Request',
};

export const REPLY_STATUS = {
  PENDING: 'PENDING',
  SENT: 'SENT', // MEDIA, VIDEO, IMAGE, FILES, ETC
  READ: 'READ',
};

export const PAGE_SIZE = 10;

export const SOCKET_EMIT = {
  /* events */
  NEW_MESSAGE: 'NEW_MESSAGE',
  REPLY_MESSAGE: 'REPLY_MESSAGE',
  REQUEST_AVAILABLE: 'REQUEST_AVAILABLE',
  REQUEST_CONFIRM: 'REQUEST_CONFIRM',
  REMOVE_REQUEST: 'REMOVE_REQUEST',

  USER_ONLINE: 'USER_ONLINE',
  USER_OFFLINE: 'USER_OFFLINE',

  TICKET_WARNING: 'TICKET_WARNING',
  // conversation room
  OTHER_JOIN_ROOM: 'OTHER_JOIN_ROOM',
  OTHER_LEFT_ROOM: 'OTHER_LEFT_ROOM',
  RECEIVE_USER_TYPING: 'RECEIVE_USER_TYPING',
  TICKET_UPDATE: 'TICKET_UPDATE',
  CONVERSATION_UPDATE: 'CONVERSATION_UPDATE',
  FOUND_SOLUTION: 'FOUND_SOLUTION',

  JOIN_CONVERSATION: 'JOIN_CONVERSATION',
  LEFT_CONVERSATION: 'LEFT_CONVERSATION',
  USER_TYPING: 'USER_TYPING',
};

export const FIELD_OF_STUDY = [{
  label: 'Accounting',
  value: 'Accounting',
}, {
  label: 'Actuarial Science',
  value: 'Actuarial Science',
}, {
  label: 'Advertising',
  value: 'Advertising',
}, {
  label: 'Aerospace Engineering',
  value: 'Aerospace Engineering',
}, {
  label: 'African-American Studies',
  value: 'African-American Studies',
}, {
  label: 'African Languages, Literatures, and Linguistics',
  value: 'African Languages, Literatures, and Linguistics',
}, {
  label: 'African Studies',
  value: 'African Studies',
}, {
  label: 'Agricultural/Biological Engineering and Bioengineering',
  value: 'Agricultural/Biological Engineering and Bioengineering',
}, {
  label: 'Agricultural Business and Management',
  value: 'Agricultural Business and Management',
}, {
  label: 'Agricultural Economics',
  value: 'Agricultural Economics',
}, {
  label: 'Agricultural Education',
  value: 'Agricultural Education',
}, {
  label: 'Agricultural Journalism',
  value: 'Agricultural Journalism',
}, {
  label: 'Agricultural Mechanization',
  value: 'Agricultural Mechanization',
}, {
  label: 'Agricultural Technology Management',
  value: 'Agricultural Technology Management',
}, {
  label: 'Agriculture',
  value: 'Agriculture',
}, {
  label: 'Agronomy and Crop Science',
  value: 'Agronomy and Crop Science',
}, {
  label: 'Air Traffic Control',
  value: 'Air Traffic Control',
}, {
  label: 'American History',
  value: 'American History',
}, {
  label: 'American Literature',
  value: 'American Literature',
}, {
  label: 'American Sign Language',
  value: 'American Sign Language',
}, {
  label: 'American Studies',
  value: 'American Studies',
}, {
  label: 'Anatomy',
  value: 'Anatomy',
}, {
  label: 'Ancient Studies',
  value: 'Ancient Studies',
}, {
  label: 'Animal Behavior and Ethology',
  value: 'Animal Behavior and Ethology',
}, {
  label: 'Animal Science',
  value: 'Animal Science',
}, {
  label: 'Animation and Special Effects',
  value: 'Animation and Special Effects',
}, {
  label: 'Anthropology',
  value: 'Anthropology',
}, {
  label: 'Applied Mathematics',
  value: 'Applied Mathematics',
}, {
  label: 'Applied Physics',
  value: 'Applied Physics',
}, {
  label: 'Aquaculture',
  value: 'Aquaculture',
}, {
  label: 'Aquatic Biology',
  value: 'Aquatic Biology',
}, {
  label: 'Arabic',
  value: 'Arabic',
}, {
  label: 'Archeology',
  value: 'Archeology',
}, {
  label: 'Architectural Engineering',
  value: 'Architectural Engineering',
}, {
  label: 'Architectural History',
  value: 'Architectural History',
}, {
  label: 'Architecture',
  value: 'Architecture',
}, {
  label: 'Art',
  value: 'Art',
}, {
  label: 'Art Education',
  value: 'Art Education',
}, {
  label: 'Art History',
  value: 'Art History',
}, {
  label: 'Artificial Intelligence and Robotics',
  value: 'Artificial Intelligence and Robotics',
}, {
  label: 'Art Therapy',
  value: 'Art Therapy',
}, {
  label: 'Asian-American Studies',
  value: 'Asian-American Studies',
}, {
  label: 'Astronomy',
  value: 'Astronomy',
}, {
  label: 'Astrophysics',
  value: 'Astrophysics',
}, {
  label: 'Athletic Training',
  value: 'Athletic Training',
}, {
  label: 'Atmospheric Science',
  value: 'Atmospheric Science',
}, {
  label: 'Automotive Engineering',
  value: 'Automotive Engineering',
}, {
  label: 'Aviation',
  value: 'Aviation',
}, {
  label: 'Bakery Science',
  value: 'Bakery Science',
}, {
  label: 'Biblical Studies',
  value: 'Biblical Studies',
},
{
  label: 'Biochemistry',
  value: 'Biochemistry',
}, {
  label: 'Bioethics',
  value: 'Bioethics',
}, {
  label: 'Biology',
  value: 'Biology',
}, {
  label: 'Biomedical Engineering',
  value: 'Biomedical Engineering',
}, {
  label: 'Biomedical Science',
  value: 'Biomedical Science',
}, {
  label: 'Biopsychology',
  value: 'Biopsychology',
}, {
  label: 'Biotechnology',
  value: 'Biotechnology',
}, {
  label: 'Botany/Plant Biology',
  value: 'Botany/Plant Biology',
}, {
  label: 'Business Administration',
  value: 'Business Administration',
}, {
  label: 'Business Administration/Management',
  value: 'Business Administration/Management',
}, {
  label: 'Business Communications',
  value: 'Business Communications',
}, {
  label: 'Business Education',
  value: 'Business Education',
}, {
  label: 'Canadian Studies',
  value: 'Canadian Studies',
}, {
  label: 'Caribbean Studies',
  value: 'Caribbean Studies',
}, {
  label: 'Cell Biology',
  value: 'Cell Biology',
}, {
  label: 'Ceramic Engineering',
  value: 'Ceramic Engineering',
}, {
  label: 'Ceramics',
  value: 'Ceramics',
}, {
  label: 'Chemical Engineering',
  value: 'Chemical Engineering',
}, {
  label: 'Chemical Physics',
  value: 'Chemical Physics',
}, {
  label: 'Chemistry',
  value: 'Chemistry',
}, {
  label: 'Child Care',
  value: 'Child Care',
}, {
  label: 'Child Development',
  value: 'Child Development',
}, {
  label: 'Chinese',
  value: 'Chinese',
}, {
  label: 'Chiropractic',
  value: 'Chiropractic',
}, {
  label: 'Church Music',
  value: 'Church Music',
}, {
  label: 'Cinematography and Film/Video Production',
  value: 'Cinematography and Film/Video Production',
}, {
  label: 'Circulation Technology',
  value: 'Circulation Technology',
}, {
  label: 'Civil Engineering',
  value: 'Civil Engineering',
}, {
  label: 'Classics',
  value: 'Classics',
}, {
  label: 'Clinical Psychology',
  value: 'Clinical Psychology',
}, {
  label: 'Cognitive Psychology',
  value: 'Cognitive Psychology',
}, {
  label: 'Communication Disorders',
  value: 'Communication Disorders',
}, {
  label: 'Communications Studies/Speech Communication and Rhetoric',
  value: 'Communications Studies/Speech Communication and Rhetoric',
}, {
  label: 'Comparative Literature',
  value: 'Comparative Literature',
}, {
  label: 'Computer and Information Science',
  value: 'Computer and Information Science',
}, {
  label: 'Computer Engineering',
  value: 'Computer Engineering',
}, {
  label: 'Computer Graphics',
  value: 'Computer Graphics',
}, {
  label: 'Computer Systems Analysis',
  value: 'Computer Systems Analysis',
}, {
  label: 'Construction Management',
  value: 'Construction Management',
}, {
  label: 'Counseling',
  value: 'Counseling',
}, {
  label: 'Crafts',
  value: 'Crafts',
}, {
  label: 'Creative Writing',
  value: 'Creative Writing',
}, {
  label: 'Criminal Science',
  value: 'Criminal Science',
}, {
  label: 'Criminology',
  value: 'Criminology',
}, {
  label: 'Culinary Arts',
  value: 'Culinary Arts',
}, {
  label: 'Dance',
  value: 'Dance',
}, {
  label: 'Data Processing',
  value: 'Data Processing',
}, {
  label: 'Dental Hygiene',
  value: 'Dental Hygiene',
}, {
  label: 'Developmental Psychology',
  value: 'Developmental Psychology',
}, {
  label: 'Diagnostic Medical Sonography',
  value: 'Diagnostic Medical Sonography',
}];

export const AGENT_SKILL = [{
  label: 'Auditing',
  value: 'Auditing',
}, {
  label: 'Internal Controls',
  value: 'Internal Controls',
}, {
  label: 'Financial Reporting',
  value: 'Financial Reporting',
}, {
  label: 'Budgets',
  value: 'Budgets',
}, {
  label: 'Analysis',
  value: 'Analysis',
}, {
  label: 'Analytical Skills',
  value: 'Analytical Skills',
}, {
  label: 'Controlling',
  value: 'Controlling',
}, {
  label: 'Accounting',
  value: 'Accounting',
}, {
  label: 'Business Planning',
  value: 'Business Planning',
}, {
  label: 'Corporate Finance',
  value: 'Corporate Finance',
}, {
  label: 'Department Budget',
  value: 'Department Budget',
}, {
  label: 'Financial Controlling and etc.',
  value: 'Financial Controlling and etc.',
}, {
  label: 'Excellent Relationship Management Skills',
  value: 'Excellent Relationship Management Skills',
}, {
  label: 'Proactive and Prompt Action',
  value: 'Proactive and Prompt Action',
}, {
  label: 'Team Player and etc.',
  value: 'Team Player and etc.',
},
{
  label: 'Customer Handling',
  value: 'Customer Handling',
}, {
  label: 'Negotiation Skills',
  value: 'Negotiation Skills',
}, {
  label: 'People Management',
  value: 'People Management',
}, {
  label: 'Problem Solving',
  value: 'Problem Solving',
}, {
  label: 'Project Coordination',
  value: 'Project Coordination',
}, {
  label: 'Planning And Organizing',
  value: 'Planning And Organizing',
}, {
  label: 'Recruitment And Selection',
  value: 'Recruitment And Selection',
}, {
  label: 'English Communication',
  value: 'English Communication',
}, {
  label: 'Employee Relations',
  value: 'Employee Relations',
}, {
  label: 'Change Management',
  value: 'Change Management',
}];

export const NEW_BUTTONS_TYPE = {
  LINK: 'LINK',
  BUTTON: 'BUTTON',
};
export const MAX_UPLOAD_SIZE = 10000000;

export const BLOCK_MESSAGES = {
  FACEBOOK: ['fb', 'facebook'],
  PHONE_NUMBER: ['phoneNumber', 'phone'],
  TWITTER: ['twitter'],
  ZALO: ['zalo'],
  LINKED_IN: ['linked-in'],
  SKYPE: ['skype'],
  HANGOUT: ['hangout'],
};

export const FEEDBACK_STATUS = {
  OPEN: 'Open',
  SOLVED: 'Solved',
};

export const BILLING_TYPE = {
  TOPUP: 'Top-up',
  TICKET_CHARGE: 'Ticket Charge',
  TICKET_FULFILL: 'Ticket Fulfill',
};

export const LANGUAGE_OPTIONS = [
  {
    label: APPLICATION_LANGUAGE.CHINESE,
    value: APPLICATION_LANGUAGE.CHINESE,
  },
  {
    label: APPLICATION_LANGUAGE.ENGLISH,
    value: APPLICATION_LANGUAGE.ENGLISH,
  },
  {
    label: APPLICATION_LANGUAGE.JANPANESE,
    value: APPLICATION_LANGUAGE.JANPANESE,
  },
  {
    label: APPLICATION_LANGUAGE.VIETNAMESE,
    value: APPLICATION_LANGUAGE.VIETNAMESE,
  },
];

export const MARKS = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
};

export const REVIEW_STATUS = {
  CLOSED: 'closed',
  OPEN: 'open',
};
