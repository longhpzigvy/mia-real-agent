import BaseRouter from '../base/base.route';
import ConversationController from './conversation.controller';

class ConversationRouter extends BaseRouter {
  constructor(controller) {
    super(controller);

    this.router.get('/:id/replies', this.controller.getReplyMessages);
    this.router.post('/:id/rating', this.controller.rating);
    this.router.get('/:id/activities', this.controller.getActivities);
  }
}

export default new ConversationRouter(ConversationController);
