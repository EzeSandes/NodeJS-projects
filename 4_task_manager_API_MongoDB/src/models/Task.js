import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required.'],
      trim: true,
      maxLength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      trim: true,
      default: '',
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'user ID is required'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is either: low, medium, hight',
      },
    },
    dueDate: {
      type: Date,
      default: null,
    },
    tags: [{ type: String, trim: true }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true, // automatically adds createdAt and updatedAt
  },
);

// ============= Index

taskSchema.index({ userId: 1, isCompleted: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

// =============

const Task = mongoose.model('Task', taskSchema);

export default Task;
