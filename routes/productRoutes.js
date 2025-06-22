// D:\tony files\agri-market-backend\routes\productRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { createProduct } = require('../controllers/productController');
const {  getAllProducts } = require('../controllers/productController');
const { getMarketPriceComparison } = require('../controllers/productController');
const { getPricesByProductName } = require('../controllers/productController');
const { getProductsByUser } = require('../controllers/productController');
const { deleteProduct } = require('../controllers/productController');
const  {getProductDetails} = require('../controllers/productController');

router.post('/create', upload.single('image'), createProduct);

router.get('/all', getAllProducts);

router.get('/compare', getMarketPriceComparison);

router.get('/prices/:name', getPricesByProductName);

router.delete('/:id', deleteProduct);


router.get('/user/:userId', getProductsByUser);

router.get('/details/:id', getProductDetails);



module.exports = router;
