const Review = require('../models/Review');
const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomeError = require('../errors/index');
const { checkPermission } = require('../utils/index');

const createReview = async (req, res) => {
    const { product: productId } = req.body;
    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) throw new CustomeError.NotFoundError('Can not found this product ' + productId);
    const alreadySubmit = await Review.findOne(
        { product: productId, user: req.user.userId }
    );
    if (alreadySubmit) throw new CustomeError.BadRequestError('Already submitted review for this product');
    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(StatusCodes.CREATED).json({ review });
};

const getAllReview = async (req, res) => {
    const reviews = await Review
        .find({})
        .populate({ path: 'product', select: 'name company price' })
        .populate({ path: 'user', select: 'name' });
    res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) throw new CustomeError.NotFoundError('Can not find review with id' + id);
    res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, title, comment } = req.body;
    const review = await Review.findById(id);
    if (!review) throw new CustomeError.NotFoundError(`Can not found review with id ${id}`);
    checkPermission(req.user, review.user);
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    await review.save();
    res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) throw new CustomeError.NotFoundError('Can not find review with id' + id);
    checkPermission(req.user, review.user);
    await review.remove();
    res.status(StatusCodes.OK).json({ msg: 'Delete success' });
};

const getSingleProductReview = async (req, res) => {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    res.status(StatusCodes.OK).json({ reviews, total: reviews.length });
};

module.exports = {
    createReview,
    getAllReview,
    getSingleReview,
    updateReview, deleteReview,
    getSingleProductReview
}

