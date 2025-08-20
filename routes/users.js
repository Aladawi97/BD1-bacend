// const express = require('express');
// const router = express.Router();
// const pool = require('../db');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // Register a new user
// router.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;

//   try {
//     // Check if user already exists
//     const existingUsersResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUsersResult.rows.length > 0) {
//       return res.status(400).json({ message: 'User with this email already existsللاس' });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Insert new user
//     const insertResult = await pool.query(
//       'INSERT INTO users (username, email, password, role, full_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
//       [name, email, hashedPassword, 'user', name]
//     );

//     const newUser = {
//       id: insertResult.rows[0].id,
//       name: name,
//       email: email,
//       role: 'user',
//       full_name: name
//     };

//     // Create JWT
//     const token = jwt.sign(
//       { userId: newUser.id, name: newUser.name },
//       process.env.JWT_SECRET || 'your_default_secret',
//       { expiresIn: '1h' }
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: newUser,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// });

// // Get all users
// router.get('/', async (req, res) => {
//   try {
//     const usersResult = await pool.query('SELECT id, username, email, created_at FROM users');
//     res.json(usersResult.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Get user by ID
// router.get('/:id', async (req, res) => {
//   try {
//     const userResult = await pool.query(
//       'SELECT id, username, email, created_at FROM users WHERE id = $1',
//       [req.params.id]
//     );
//     if (userResult.rows.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json(userResult.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Login user
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // تحقق من وجود المستخدم
//     const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (userResult.rows.length === 0) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }
//     const user = userResult.rows[0];

//     // تحقق من كلمة المرور
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     // إنشاء التوكن
//     const token = jwt.sign(
//       { userId: user.id, name: user.username },
//       process.env.JWT_SECRET || 'your_default_secret',
//       { expiresIn: '1h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user.id,
//         name: user.username,
//         email: user.email,
//         role: user.role,
//         full_name: user.full_name
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// module.exports = router; 

const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUsersResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsersResult.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const insertResult = await pool.query(
      'INSERT INTO users (username, email, password, role, full_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, hashedPassword, 'user', name]
    );

    const newUser = {
      id: insertResult.rows[0].id,
      name: name,
      email: email,
      role: 'user',
      full_name: name,
    };

    // Create JWT
    const token = jwt.sign(
      { userId: newUser.id, name: newUser.name },
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: `${newUser.name} registered successfully`,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'user',
        full_name: newUser.full_name,
        created_at: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const usersResult = await pool.query('SELECT id, username, email, created_at FROM users');
    res.json(usersResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(userResult.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // تحقق من وجود المستخدم
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const user = userResult.rows[0];

    // تحقق من كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // إنشاء التوكن
    const token = jwt.sign(
      { userId: user.id, name: user.username },
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
