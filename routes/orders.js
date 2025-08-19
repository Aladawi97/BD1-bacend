const express = require('express');
const router = express.Router();
const pool = require('../db');
const nodemailer = require('nodemailer');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [orders] = await pool.promise().query(`
      SELECT o.*, u.username 
      FROM orders o 
      JOIN users u ON o.user_id = u.id
    `);
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order by ID with items
router.get('/:id', async (req, res) => {
  try {
    const [order] = await pool.promise().query(`
      SELECT o.*, u.username 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      WHERE o.id = ?
    `, [req.params.id]);

    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const [orderItems] = await pool.promise().query(`
      SELECT oi.*, p.name as product_name, p.price 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `, [req.params.id]);

    res.json({
      ...order[0],
      items: orderItems
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// إرسال الطلب عبر الإيميل
router.post('/email', async (req, res) => {
  const { user, items } = req.body;
  if (!user || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'User info and items are required' });
  }

  const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  // إعداد نص الإيميل بصيغة HTML
  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">New Order Received</h2>
      <p>You have received a new order from your website. Here are the details:</p>
      
      <h3 style="color: #555; border-bottom: 2px solid #eee; padding-bottom: 5px;">Customer Details</h3>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
      
      <h3 style="color: #555; border-bottom: 2px solid #eee; padding-bottom: 5px;">Order Items</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Quantity</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => {
            const price = Number(item.price) || 0;
            const quantity = Number(item.quantity) || 1;
            const subtotal = price * quantity;
            return `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${quantity}</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${price.toFixed(2)} JD</td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${subtotal.toFixed(2)} JD</td>
              </tr>
            `;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="font-weight: bold;">
            <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right;">Total Amount</td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${totalAmount.toFixed(2)} JD</td>
          </tr>
        </tfoot>
      </table>
      
      <p style="margin-top: 20px; font-size: 0.9em; color: #777;">This is an automated email from your store.</p>
    </div>
  `;

  // إعداد nodemailer
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'yihea.aladawi1001@gmail.com',
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: `"${user.name}" <${user.email}>`,
      to: 'yihea.aladawi1001@gmail.com',
      subject: `New Order from ${user.name}`,
      html: htmlMessage
    });
    res.json({ message: 'Order sent to company email successfully!' });
  } catch (err) {
    console.error('Error sending order email:', err);
    res.status(500).json({ message: 'Failed to send order email', error: err.message });
  }
});

module.exports = router; 