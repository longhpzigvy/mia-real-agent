import mongoose from 'mongoose';
import { REVIEW_STATUS } from '../../../common/enums';

const { Schema } = mongoose;
// Form data:
// {
//   fieldName: {
//     label,
//     type,
//     value,
//     comment,
//   },
// }
const reviewSchema = new Schema(
  {
    fields: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: [
        REVIEW_STATUS.CLOSED,
        REVIEW_STATUS.OPEN,
      ],
      default: REVIEW_STATUS.OPEN,
      required: true,
    },
    applicationId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'Application',
    },
    createdBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: 'review',
  }
);

export default mongoose.model('Review', reviewSchema);
