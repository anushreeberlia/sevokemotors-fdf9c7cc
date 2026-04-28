const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || '/data/scraper.json';

// Ensure data directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Initialize database if it doesn't exist
function initializeDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({}, null, 2));
  }
}

// Read database
function readDb() {
  try {
    initializeDb();
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return {};
  }
}

// Write database
function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
}

// Get all items from a collection
function getAll(collection) {
  const db = readDb();
  return db[collection] || [];
}

// Get item by ID
function getById(collection, id) {
  const items = getAll(collection);
  return items.find(item => item.id === id);
}

// Insert new item
function insert(collection, item) {
  const db = readDb();
  if (!db[collection]) {
    db[collection] = [];
  }
  
  // Auto-generate ID if not provided
  if (!item.id) {
    item.id = Date.now();
  }
  
  db[collection].push(item);
  writeDb(db);
  return item;
}

// Update item
function update(collection, id, data) {
  const db = readDb();
  if (!db[collection]) {
    db[collection] = [];
  }
  
  const index = db[collection].findIndex(item => item.id === id);
  if (index !== -1) {
    db[collection][index] = { ...db[collection][index], ...data };
    writeDb(db);
    return db[collection][index];
  }
  return null;
}

// Remove item
function remove(collection, id) {
  const db = readDb();
  if (!db[collection]) {
    return false;
  }
  
  const index = db[collection].findIndex(item => item.id === id);
  if (index !== -1) {
    const removed = db[collection].splice(index, 1)[0];
    writeDb(db);
    return removed;
  }
  return false;
}

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove
};