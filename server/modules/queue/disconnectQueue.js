/* eslint-disable no-underscore-dangle */
class DisconnectQueue {
  _queue = {}

  get queue() {
    return this._queue;
  }

  set queue(queue) {
    this._queue = queue;
  }

  getTimer = userId => this.queue[userId];

  addTimer = (timer, userId) => {
    this.queue = {
      ...this.queue,
      [userId]: timer,
    };
  };

  destroyTimer = (userId) => {
    const timer = this.queue[userId];
    if (timer) {
      clearTimeout(timer);
      const { [userId]: _, ...rest } = this.queue;
      this.queue = rest;
    }
  };
}


// eslint-disable-next-line import/no-mutable-exports
let disconnetQueue = null;

if (!disconnetQueue) {
  disconnetQueue = new DisconnectQueue();
}

export default disconnetQueue;
