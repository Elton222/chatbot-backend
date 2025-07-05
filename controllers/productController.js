const db = require('../config/db');

exports.createProduct = async (req, res) => {
  const { user_id, name, description, price, category, region, phone } = req.body;
  const image_url = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

  if (!user_id || !name || !price || !category || !region || !phone) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO products (user_id, name, description, price, image_url, category, region, phone) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `;

  try {
    const result = await db.query(sql, [user_id, name, description, price, image_url, category, region, phone]);
    res.json({ success: true, message: 'Product created successfully', id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const sql = 'SELECT * FROM products ORDER BY id DESC';

  try {
    const results = await db.query(sql);
    res.json({ success: true, products: results.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMarketPriceComparison = async (req, res) => {
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

  try {
    const results = await db.query(sql);
    res.json({ success: true, comparison: results.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPricesByProductName = async (req, res) => {
  const { name } = req.params;
  const sql = `
    SELECT region, price
    FROM products
    WHERE name = $1
    ORDER BY region
  `;

  try {
    const results = await db.query(sql, [name]);
    res.json({ success: true, prices: results.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProductsByUser = async (req, res) => {
  const userId = req.params.userId;
  const sql = 'SELECT * FROM products WHERE user_id = $1 ORDER BY id DESC';

  try {
    const results = await db.query(sql, [userId]);
    res.json({ success: true, products: results.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = $1';

  try {
    await db.query(sql, [id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getProductDetails = async (req, res) => {
  const productId = req.params.id;

  const sql = `
    SELECT 
      p.*, 
      u.name AS uploader_name, 
      u.phone AS uploader_phone 
    FROM products p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = $1
  `;

  try {
    const results = await db.query(sql, [productId]);
    if (results.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const product = results.rows[0];
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
          phone: product.uploader_phone,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
