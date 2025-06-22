// controllers/productController.js
const db = require('../config/db');

exports.createProduct = (req, res) => {
  const { user_id, name, description, price, category, region, phone} = req.body;
  const image_url = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
 

  if (!user_id || !name || !price || !category || !region || !phone) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sql = `INSERT INTO products (user_id, name, description, price, image_url, category, region, phone) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [user_id, name, description, price, image_url, category, region, phone], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: 'Product created successfully' });
  });
};

exports.getAllProducts = (req, res) => {
  const sql = 'SELECT * FROM products ORDER BY id DESC';

  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, products: results });
  });
};

exports.getMarketPriceComparison = (req, res) => {
  const sql = `
    SELECT 
      name,
      category,
      MIN(price) AS min_price,
      MAX(price) AS max_price,
      AVG(price) AS avg_price,
      COUNT(*) AS listings_count
    FROM products
    GROUP BY name, category
    ORDER BY name ASC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, comparison: results });
  });
};

// In productController.js
exports.getPricesByProductName = (req, res) => {
  const { name } = req.params;
  const sql = `
    SELECT region, price
    FROM products
    WHERE name = ?
    ORDER BY region
  `;

  db.query(sql, [name], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, prices: results });
  });
};

exports.getProductsByUser = (req, res) => {
  const userId = req.params.userId;

  const sql = `SELECT * FROM products WHERE user_id = ? ORDER BY id DESC`;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, products: results });
  });
};

exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, message: 'Product deleted successfully' });
  });
};

// Get product details by ID with uploader info
exports.getProductDetails = (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT 
      p.*, 
      u.name AS uploader_name, 
      u.phone AS uploader_phone 
    FROM products p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;

  db.query(sql, [productId], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });

    const product = results[0];
    res.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image_url: product.image_url,
        category: product.category,
        region: product.region,
        created_at: product.created_at,
        uploader: {
          name: product.uploader_name,
          phone: product.uploader_phone
        }
      }
    });
  });
};

