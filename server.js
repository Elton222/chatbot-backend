const express = require('express');
const cors = require('cors');
const path = require('path');
const notificationRoutes = require('./routes/notificationRoutes');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const salesRoutes = require('./routes/salesRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const adminRoutes = require('./routes/adminRoutes'); // your admin user management route


const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');
app.use(express.json());

app.use('/admin', adminRoutes); 
app.use('/reports', express.static(path.join(__dirname, 'reports')));

app.use('/uploads', express.static('uploads'));

app.use('/api/sales', salesRoutes);



app.use(cors());

app.use('/api/chatbot', chatbotRoutes);

app.use('/api/auth', authRoutes);
app.use('/notifications', notificationRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
