const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Please add some content']
    },
    tag: {
      type: String,
      enum: ['JavaScript', 'TypeScript', 'CSS', 'HTML', 'Python', 'General', 'DevOps', 'Database'],
      default: 'General'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Note', noteSchema);
