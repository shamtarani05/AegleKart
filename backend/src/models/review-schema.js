const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index to prevent duplicate reviews from the same user
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('reviews', reviewSchema);
