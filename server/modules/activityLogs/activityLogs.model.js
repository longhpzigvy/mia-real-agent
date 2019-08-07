import mongoose from 'mongoose';
const { Schema } = mongoose;

const activityLogsSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
    action: {
      type: String,
      required: true,
    },
    payload: {
      type: Object,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    collection: 'activity_logs',
  },
);

export default mongoose.model('ActivityLogs', activityLogsSchema);
