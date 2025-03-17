const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Initialize express app
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

// MongoDB URI (Use MongoDB Compass or MongoDB Atlas connection string)
const mongoURI = 'mongodb://localhost:27017/userDB'; // Local MongoDB URI
// For MongoDB Atlas, use the connection string from your Atlas dashboard.
// Example: 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define a User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

// Create a User model
const User = mongoose.model('User', userSchema);

// 1. Create a new user (POST)
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  // Create a new user document
  const newUser = new User({
    name,
    email,
  });

  newUser.save()
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(400).send({ message: 'Error creating user', error: err }));
});

// 2. Get all users (GET)
app.get('/users', (req, res) => {
  User.find()
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(400).send({ message: 'Error fetching users', error: err }));
});

// 3. Get a single user by ID (GET)
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(user);
    })
    .catch((err) => res.status(400).send({ message: 'Error fetching user', error: err }));
});

// 4. Update a user by ID (PUT)
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  User.findByIdAndUpdate(userId, { name, email }, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(updatedUser);
    })
    .catch((err) => res.status(400).send({ message: 'Error updating user', error: err }));
});

// 5. Delete a user by ID (DELETE)
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  User.findByIdAndDelete(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(deletedUser);
    })
    .catch((err) => res.status(400).send({ message: 'Error deleting user', error: err }));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
