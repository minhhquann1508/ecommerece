const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide rating']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Please provide review title'],
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true, 'Please provide review text'],
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, { timestamps: true });

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.calculateAverangeRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match: {
                product: productId
            }
        }, {
            $group: {
                _id: null,
                averangeRating: {
                    $avg: '$rating'
                },
                numberOfReviews: {
                    '$sum': 1
                }
            }
        }
    ]);
    try {
        await this.model('Product')
            .findOneAndUpdate(
                { _id: productId },
                {
                    averangeRating: Math.ceil(result[0]?.averangeRating || 0),
                    numberOfReviews: result[0]?.numberOfReviews || 0,
                }
            )
    } catch (error) {
        console.log(error);
    }
}

ReviewSchema.post('save', async function () {
    await this.constructor.calculateAverangeRating(this.product);
});

ReviewSchema.post('remove', async function () {
    await this.constructor.calculateAverangeRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);