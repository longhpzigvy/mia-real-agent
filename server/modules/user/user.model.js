import mongoose from 'mongoose';
import { ROLES_BY_VALUE } from '../../../common/enums';

const {
  USER: { value: USER_ROLE },
} = ROLES_BY_VALUE;
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: false },
    password: { type: String, required: false },
    provider: [{ id: String, name: String, _id: false }],
    displayName: String,
    createdAt: { type: Date, default: Date.now },
    role: { type: String, default: USER_ROLE },
    stripeCustomerId: { type: String, require: false },
    profile: {
      firstName: String,
      lastName: String,
      phone: String,
      dateOfBirth: { type: Date, required: false },
      gender: String,
    },
    address: {
      defaultIndex: { type: Number, default: 0 },
      list: [
        {
          firstName: String,
          lastName: String,
          phone: String,
          address: {
            line1: String,
            line2: { type: String, required: false },
            postcode: { type: String, required: false },
            country: String,
            province: String,
            city: String,
          },
        },
      ],
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    collection: 'user',
  },
);

export default mongoose.model('User', userSchema);
