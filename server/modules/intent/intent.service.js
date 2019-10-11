import axios from 'axios';
import intentCollection from './intent.model';
import BaseService from '../base/base.service';
import Logger from '../../logger';
import { getIntentId } from './intent.utils';

class IntentService extends BaseService {
  constructor() {
    super(intentCollection);
    this.fetchIntentsFromDialogFlow = this.fetchIntentsFromDialogFlow.bind(this);
    this.fetchEntitiesFromDialogFlow = this.fetchEntitiesFromDialogFlow.bind(this);
  }

  async fetchEntitiesFromDialogFlow() {
    const { WEBHOOK_ENDPOINT } = process.env;
    if (!WEBHOOK_ENDPOINT) {
      Logger.error('WEBHOOK_ENDPOINT not found');
      return [];
    }
    try {
      const { data } = await axios.get(`${WEBHOOK_ENDPOINT}/api/dialogflow/entity/list`);
      const { entityTypes = [] } = data.data;
      return entityTypes.map(({ displayName, entities }) => {
        const values = entities.map(({ value }) => value);
        return {
          displayName,
          values,
        };
      });
      //  response;
    } catch (error) {
      Logger.error('Dialogflow error', error);
      return [];
    }
  }

  async fetchIntentsFromDialogFlow() {
    const { WEBHOOK_ENDPOINT } = process.env;
    if (!WEBHOOK_ENDPOINT) {
      Logger.error('WEBHOOK_ENDPOINT not found');
      return;
    }
    const entityTypes = await this.fetchEntitiesFromDialogFlow();
    try {
      const { data } = await axios.get(`${WEBHOOK_ENDPOINT}/api/dialogflow/intent/list`);
      const { intents } = data.data;

      // Update intent if exist, else insert new
      intents.forEach(({ name, displayName, parameters = [] }) => {
        const intentId = getIntentId(name);
        // Map entity values with parameter
        const paramWithValues = parameters.map((param) => {
          const { entityTypeDisplayName, name: parameterId } = param;
          const entity = entityTypes.find(({
            displayName: entityName,
          }) => `@${entityName}` === entityTypeDisplayName);

          const { values = [] } = entity || {};
          return {
            ...param,
            parameterId,
            values,
          };
        });

        this.collection.update(
          {
            intentId,
          },
          {
            intentId,
            displayName,
            parameters: paramWithValues,
          },
          {
            upsert: true,
          },
        ).exec();
      });
    } catch (error) {
      Logger.error('Dialogflow error', error);
    }
  }

  async getAll(condition, options = {}) {
    await this.fetchIntentsFromDialogFlow();
    // Get Intent list from DB
    const { skip = 0, limit, sort = { updatedAt: -1 } } = options;
    const notDeletedCondition = {
      deletedAt: null,
    };
    const queryCondition = {
      $and: [condition, notDeletedCondition],
    };
    const totalRecordPromise = this.collection
      .find(queryCondition, null, options)
      .count();
    const resultPromise = this.collection
      .find(queryCondition, null, options)
      .sort(sort)
      .skip(+skip)
      .limit(+limit || 0)
      .exec();

    return {
      result: await resultPromise,
      totalRecord: await totalRecordPromise,
    };
  }
}

export default new IntentService();
