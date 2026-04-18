const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['biriyani', 'starters', 'main-course', 'desserts', 'beverages']
  },
  image: {
    type: String,
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: String,
    default: '20-30 min'
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'spicy', 'very-spicy'],
    default: 'medium'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

menuSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MenuItem', menuSchema);
