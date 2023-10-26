const Product = require('../models/Product');
const { StatusCodes } = require('http-status-codes');
const CustomeError = require('../errors/index');
const path = require('path');

const createProduct = async (req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
};

const getAllProduct = async (req, res) => {
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products, total: products.length });
};

const getSigleProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('reviews');
    if (!product) throw new CustomeError.NotFoundError(`Can not found product ${id}`);
    res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true });
    if (!product) throw new CustomeError.NotFoundError(`Can not found product ${id}`);
    res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const deleteProduct = await Product.findOne({ _id: id });
    if (!deleteProduct) throw new CustomeError.NotFoundError(`Can not found product ${id}`);
    await deleteProduct.remove();
    res.status(StatusCodes.OK).json({ msg: 'Delete product success' });
};


const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new CustomeError.BadRequestError('No file upload');
    }
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomeError.BadRequestError('Please upload a image');
    }
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
        throw new CustomeError.BadRequestError('Image size must be lower than 1MB');
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
    getAllProduct,
    getSigleProduct,
    updateProduct,
    createProduct,
    deleteProduct,
    uploadImage
}