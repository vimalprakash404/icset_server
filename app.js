const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');


// Connect to your MongoDB instance
mongoose.connect('mongodb://localhost/ICSET', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

function convertToFourDigitNumber(number) {
  // Convert the number to a string
  let numberStr = number.toString();

  // Check the length of the string
  if (numberStr.length === 1) {
    // If it's a single-digit number, add leading zeros
    return "000" + numberStr;
  } else if (numberStr.length === 2) {
    // If it's a two-digit number, add one leading zero
    return "00" + numberStr;
  } else if (numberStr.length === 3) {
    // If it's a three-digit number, add two leading zeros
    return "0" + numberStr;
  } else if (numberStr.length === 4) {
    // If it's already a four-digit number, return it as is
    return numberStr;
  } else {
    // If it's a number with more than four digits, you can choose to handle it as needed
    // For example, you can truncate or round the number
    return numberStr.slice(0, 4);
  }
}

// Example usage:
const number = 12345;
const fourDigitNumber = convertToFourDigitNumber(number);

// Create a mongoose schema and model for the User
const UserSchema = new mongoose.Schema({
  _id: String,
  Name: String,
  Institution: String,
  phone: String,
  verify: Boolean,
  email: String,
  lunch: Boolean,
});

const GoogleSchema = new mongoose.Schema({
    _id: String,
    Name: String,
    Institution: String,
    phone: String,
    verify: Boolean,
    email: String,
  });

  const IbmSchema = new mongoose.Schema({
    _id: String,
    Name: String,
    Institution: String,
    phone: String,
    verify: Boolean,
    email: String,
  });

const User = mongoose.model('User', UserSchema);
const Google = mongoose.model('Google', GoogleSchema);
const Ibm = mongoose.model('Ibm', IbmSchema);
// Middleware for parsing JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET route to retrieve all users
app.get("")
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/', (req, res) => {
    res.send({status : true});
  });

app.get('/google', async (req, res) => {
    try {
      const users = await Google.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  });


  app.get('/ibm', async (req, res) => {
    try {
      const users = await Ibm.find();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  });

// POST route to create a new user

app.put('/users/:userId/verify', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { verify } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.verify = verify;
      await user.save();
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating verification status' });
    }
  });

  app.put('/users/:userId/lunch', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { lunch } = req.body;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.lunch = lunch;
      await user.save();
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating verification status' });
    }
  });

  
  app.put('/google/:userId/verify', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { verify } = req.body;
      const new_userId=convertToFourDigitNumber(userId);
      const user = await Google.findById(new_userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.verify = verify;
      await user.save();
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating verification status' });
    }
  });

  app.put('/ibm/:userId/verify', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { verify } = req.body;
      const new_userId=convertToFourDigitNumber(userId);
      const user = await Ibm.findById(new_userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.verify = verify;
      await user.save();
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating verification status' });
    }
  });

app.get('/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user data' });
    }
  });


  app.get('/google/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await Google.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user data' });
    }
  }); 
  app.get('/ibm/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await Ibm.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user data' });
    }
  });



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
