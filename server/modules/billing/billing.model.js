import mongoose from 'mongoose';
import { BILLING_TYPE } from '../../../common/enums';
const { Schema } = mongoose;

const billingSchema = new Schema(
  {
    status: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: [
        BILLING_TYPE.TOPUP,
        BILLING_TYPE.TICKET_CHARGE,
        BILLING_TYPE.TICKET_FULFILL,
      ],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: Object,
    },
    total: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    collection: 'billing',
  },
);

export default mongoose.model('Billing', billingSchema);
