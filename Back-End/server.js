const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 5000; // Changed to match frontend

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage }); // Use storage configuration

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Amrutheshhere',
  database: 'sem_project'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL database');
});

// Sample route
app.get('/', (req, res) => {
  res.send('Hello from the backend 👋');
});

// POST route to add a lost item
app.post('/api/lost-items', upload.single('Photo_Path'), async (req, res) => {
  const {
    Reported_By, Category_ID: categoryName, Location_ID: locationName, Item_Name, Description,
    Lost_Date, Lost_Time, Color, Features, Status
  } = req.body;
  const Photo_Path = req.file ? req.file.path : 'http://localhost:5000/uploads/image_not_available.avif';

  try {
    // Get Category_ID
    const [categoryRows] = await db.promise().query(
      'SELECT Category_ID FROM Category WHERE Category_Name = ?', [categoryName]
    );
    if (categoryRows.length === 0) {
      return res.status(400).json({ error: 'Invalid category name' });
    }
    const categoryId = categoryRows[0].Category_ID;

    // Get Location_ID
    const [locationRows] = await db.promise().query(
      'SELECT Location_ID FROM Location WHERE Building_Name = ?', [locationName]
    );
    if (locationRows.length === 0) {
      return res.status(400).json({ error: 'Invalid location name' });
    }
    const locationId = locationRows[0].Location_ID;

    // Insert lost item
    const query = `
      INSERT INTO Lost_Item 
      (Reported_By, Category_ID, Location_ID, Item_Name, Description, Lost_Date, Lost_Time, Color, Features, Photo_Path, Status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      Reported_By, categoryId, locationId, Item_Name, Description,
      Lost_Date, Lost_Time || null, Color, Features, Photo_Path, Status || 'Open'
    ];

    const [result] = await db.promise().query(query, values);
    res.status(201).json({ message: 'Lost item reported successfully', Lost_Item_ID: result.insertId });
  } catch (err) {
    console.error('Error inserting lost item:', err);
    res.status(500).json({ error: 'Failed to report lost item' });
  }
});

// POST route to add a found item
app.post('/api/found-items', upload.single('Photo_Path'), async (req, res) => {
  const {
    Reported_By, Category_ID: categoryName, Location_ID: locationName, Item_Name, Description,
    Found_Date, Found_Time, Color, Features, Status
  } = req.body;
  const Photo_Path = req.file ? req.file.path : 'http://localhost:5000/uploads/image_not_available.avif';

  try {
    // Get Category_ID
    const [categoryRows] = await db.promise().query(
      'SELECT Category_ID FROM Category WHERE Category_Name = ?', [categoryName]
    );
    if (categoryRows.length === 0) {
      return res.status(400).json({ error: 'Invalid category name' });
    }
    const categoryId = categoryRows[0].Category_ID;

    // Get Location_ID
    const [locationRows] = await db.promise().query(
      'SELECT Location_ID FROM Location WHERE Building_Name = ?', [locationName]
    );
    if (locationRows.length === 0) {
      return res.status(400).json({ error: 'Invalid location name' });
    }
    const locationId = locationRows[0].Location_ID;

    // Insert found item
    const query = `
      INSERT INTO Found_Item 
      (Reported_By, Category_ID, Location_ID, Item_Name, Description, Found_Date, Found_Time, Color, Features, Photo_Path, Status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      Reported_By, categoryId, locationId, Item_Name, Description,
      Found_Date, Found_Time || null, Color, Features, Photo_Path, Status || 'Unclaimed'
    ];

    const [result] = await db.promise().query(query, values);
    res.status(201).json({ message: 'Found item reported successfully', Found_Item_ID: result.insertId });
  } catch (err) {
    console.error('Error inserting found item:', err);
    res.status(500).json({ error: 'Failed to report found item' });
  }
});

// GET route to search lost items
app.get('/api/lost-items', async (req, res) => {
  const { category, location, date, status, keyword } = req.query;
  let query = `
    SELECT li.*, c.Category_Name, l.Building_Name, u.First_Name, u.Last_Name
    FROM Lost_Item li
    JOIN Category c ON li.Category_ID = c.Category_ID
    JOIN Location l ON li.Location_ID = l.Location_ID
    JOIN User u ON li.Reported_By = u.User_ID
    WHERE 1=1
  `;
  const values = [];

  if (category) {
    query += ' AND c.Category_Name = ?';
    values.push(category);
  }
  if (location) {
    query += ' AND l.Building_Name LIKE ?';
    values.push(`%${location}%`);
  }
  if (date) {
    query += ' AND li.Lost_Date >= ?';
    values.push(date);
  }
  if (status) {
    query += ' AND li.Status = ?';
    values.push(status);
  }
  if (keyword) {
    query += ' AND (li.Item_Name LIKE ? OR li.Description LIKE ?)';
    values.push(`%${keyword}%`, `%${keyword}%`);
  }

  try {
    const [results] = await db.promise().query(query, values);
    const items = results.map(item => ({
      ...item,
      Photo_Path: item.Photo_Path ? `http://localhost:5000/${item.Photo_Path}` : null
    }));
    res.json(items);
  } catch (err) {
    console.error('Error fetching lost items:', err);
    res.status(500).json({ error: 'Failed to fetch lost items' });
  }
});

// GET route to search found items
app.get('/api/found-items', async (req, res) => {
    const { category, location, date, status, keyword } = req.query;
    let query = `
      SELECT fi.*, c.Category_Name, l.Building_Name, u.First_Name, u.Last_Name
      FROM Found_Item fi
      LEFT JOIN Category c ON fi.Category_ID = c.Category_ID
      LEFT JOIN Location l ON fi.Location_ID = l.Location_ID
      LEFT JOIN User u ON fi.Reported_By = u.User_ID
      WHERE 1=1
    `;
    const values = [];
  
    if (category) {
      query += ' AND c.Category_Name = ?';
      values.push(category);
    }
    if (location) {
      query += ' AND l.Building_Name LIKE ?';
      values.push(`%${location}%`);
    }
    if (date) {
      query += ' AND fi.Found_Date >= ?';
      values.push(date);
    }
    if (status) {
      // Map 'found' to 'Unclaimed'
      const dbStatus = status.toLowerCase() === 'found' ? 'Unclaimed' : status;
      query += ' AND fi.Status = ?';
      values.push(dbStatus);
    }
    if (keyword) {
      query += ' AND (fi.Item_Name LIKE ? OR fi.Description LIKE ?)';
      values.push(`%${keyword}%`, `%${keyword}%`);
    }
  
    try {
      const [results] = await db.promise().query(query, values);
      const items = results.map(item => ({
        ...item,
        Photo_Path: item.Photo_Path ? `http://localhost:5000/${item.Photo_Path}` : null
      }));
      res.json(items);
    } catch (err) {
      console.error('Error fetching found items:', err);
      res.status(500).json({ error: 'Failed to fetch found items' });
    }
  });

// Routes for categories and locations
app.get('/api/categories', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM Category');
    res.json(results);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/locations', async (req, res) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM Location');
    res.json(results);
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// SIGN UP a new user
app.post('/api/signup', async (req, res) => {
  const {
    First_Name, Last_Name, Email, Phone, User_Type, Department, Password
  } = req.body;

  const query = `
    INSERT INTO User (First_Name, Last_Name, Email, Phone, User_Type, Department, Password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [First_Name, Last_Name, Email, Phone, User_Type, Department, Password];

  try {
    const [result] = await db.promise().query(query, values);
    res.status(201).json({ message: 'Signup successful', userId: result.insertId });
  } catch (err) {
    console.error('❌ Signup failed:', err);
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

// LOGIN an existing user
app.post('/api/login', async (req, res) => {
  const { Email, Password } = req.body;

  const query = `
    SELECT * FROM User WHERE Email = ? AND Password = ?
  `;

  try {
    const [results] = await db.promise().query(query, [Email, Password]);
    if (results.length > 0) {
      res.status(200).json({ message: 'Login successful', user: results[0] });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('❌ Login failed:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST route to submit feedback
app.post('/api/feedback', async (req, res) => {
  const { User_ID, Message, Rating, Feedback_Type } = req.body;

  const query = `
    INSERT INTO Feedback (User_ID, Message, Rating, Feedback_Type, Status)
    VALUES (?, ?, ?, ?, 'New')
  `;
  const values = [User_ID || null, Message, Rating || null, Feedback_Type || null];

  try {
    const [result] = await db.promise().query(query, values);
    res.status(201).json({ message: 'Feedback submitted successfully', Feedback_ID: result.insertId });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});






