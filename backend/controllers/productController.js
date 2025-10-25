const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

exports.uploadImage = upload.single('image');

exports.getProducts = async (req, res) => {
  const { category, search, sort, page = 1, limit = 10, minPrice, maxPrice } = req.query;
  const numericPage = parseInt(page, 10) || 1;
  const numericLimit = parseInt(limit, 10) || 10;

  // Build query
  const query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Map sort values from frontend to backend/Mongo
  let sortBy = {};
  switch (sort) {
    case 'price_asc':
    case 'price':
      sortBy = { price: 1 };
      break;
    case 'price_desc':
    case '-price':
      sortBy = { price: -1 };
      break;
    case 'name':
      sortBy = { name: 1 };
      break;
    case '-name':
      sortBy = { name: -1 };
      break;
    case 'createdAt':
      sortBy = { createdAt: 1 };
      break;
    case '-createdAt':
      sortBy = { createdAt: -1 };
      break;
    default:
      sortBy = {};
  }

  try {
    const [products, count] = await Promise.all([
      Product.find(query)
        .sort(sortBy)
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit),
      Product.countDocuments(query),
    ]);

    res.json({ products, totalPages: Math.ceil(count / numericLimit) });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';
  try {
    const product = new Product({ name, description, price, stock, category, image });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const updates = req.body;
  if (req.file) updates.image = `/uploads/${req.file.filename}`;
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    product.reviews.push({ user: req.user.id, rating, comment });
    product.averageRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    await product.populate('reviews.user', 'name');
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
