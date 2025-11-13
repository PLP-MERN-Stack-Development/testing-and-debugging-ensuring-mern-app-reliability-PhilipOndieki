/**
 * Bug Model
 * Mongoose schema for Bug documents
 */

const mongoose = require('mongoose');
const {
  BUG_STATUS,
  BUG_PRIORITY,
  BUG_SEVERITY,
  VALIDATION_RULES,
} = require('../config/constants');

const bugSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [
        VALIDATION_RULES.TITLE.MIN_LENGTH,
        `Title must be at least ${VALIDATION_RULES.TITLE.MIN_LENGTH} characters`,
      ],
      maxlength: [
        VALIDATION_RULES.TITLE.MAX_LENGTH,
        `Title must not exceed ${VALIDATION_RULES.TITLE.MAX_LENGTH} characters`,
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [
        VALIDATION_RULES.DESCRIPTION.MIN_LENGTH,
        `Description must be at least ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`,
      ],
      maxlength: [
        VALIDATION_RULES.DESCRIPTION.MAX_LENGTH,
        `Description must not exceed ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`,
      ],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(BUG_STATUS),
        message: '{VALUE} is not a valid status',
      },
      default: BUG_STATUS.OPEN,
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(BUG_PRIORITY),
        message: '{VALUE} is not a valid priority',
      },
      required: [true, 'Priority is required'],
    },
    severity: {
      type: String,
      enum: {
        values: Object.values(BUG_SEVERITY),
        message: '{VALUE} is not a valid severity',
      },
      required: [true, 'Severity is required'],
    },
    createdBy: {
      type: String,
      required: function() {
        // Make createdBy optional if creator is provided
        return !this.creator;
      },
      trim: true,
      minlength: [
        VALIDATION_RULES.CREATED_BY.MIN_LENGTH,
        `Created by must be at least ${VALIDATION_RULES.CREATED_BY.MIN_LENGTH} characters`,
      ],
      maxlength: [
        VALIDATION_RULES.CREATED_BY.MAX_LENGTH,
        `Created by must not exceed ${VALIDATION_RULES.CREATED_BY.MAX_LENGTH} characters`,
      ],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Not required for backward compatibility with existing bugs
      required: false
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes for better query performance
bugSchema.index({ status: 1 });
bugSchema.index({ priority: 1 });
bugSchema.index({ severity: 1 });
bugSchema.index({ createdBy: 1 });
bugSchema.index({ creator: 1 });
bugSchema.index({ createdAt: -1 });

// Compound index for common queries
bugSchema.index({ status: 1, priority: 1 });

// Virtual for bug age in days
bugSchema.virtual('ageInDays').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

const Bug = mongoose.model('Bug', bugSchema);

module.exports = Bug;
