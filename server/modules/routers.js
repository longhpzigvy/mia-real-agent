import express from 'express';
/* routers */
import UserRouter from './user/user.route';
import AuthRouter from './auth/auth.route';
import TicketRouter from './ticket/ticket.route';
import ApplicationRouter from './application/application.route';
import AgentRouter from './agent/agent.route';
import ConversationRouter from './conversation/conversation.route';
import AdminRouter from './admin/routers';
import ReplyRouter from './reply/reply.route';
import ActivityLogsRouter from './activityLogs/activityLogs.route';

const router = express.Router();

export default () => {
  router.use('/users', UserRouter.router);
  router.use('/auth', AuthRouter.router);
  router.use('/tickets', TicketRouter.router);
  router.use('/applications', ApplicationRouter.router);
  router.use('/agents', AgentRouter.router);
  router.use('/conversations', ConversationRouter.router);
  router.use('/admin', AdminRouter.router);
  router.use('/reply', ReplyRouter.router);
  router.use('/activity_logs', ActivityLogsRouter.router);
  return router;
};
