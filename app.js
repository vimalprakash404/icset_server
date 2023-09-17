const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 80;
const cors = require('cors');


// Connect to your MongoDB instance
mongoose.connect('mongodb+srv://vimalprakash3322:gAvdAtbcv6PUqKzp@cluster0.hknayny.mongodb.net/ICSET?retryWrites=true&w=majority', {
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
  time : Date,
  verifiedby : String
});

const GoogleSchema = new mongoose.Schema({
    _id: String,
    Name: String,
    Institution: String,
    phone: String,
    verify: Boolean,
    email: String,
    verifiedby : String,
  });

  const IbmSchema = new mongoose.Schema({
    _id: String,
    Name: String,
    Institution: String,
    phone: String,
    verify: Boolean,
    email: String,
    verifiedby : String
  });


  const AuthenticateSchema = new mongoose.Schema({
    _id: String,
    password : String
  });

const User = mongoose.model('User', UserSchema);
const Google = mongoose.model('Google', GoogleSchema);
const Ibm = mongoose.model('Ibm', IbmSchema);
const Authenticate = mongoose.model('Authenticate',AuthenticateSchema);
// Middleware for parsing JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// GET route to retrieve all users
app.get("")
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({_id: 1});
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
      const users = await Google.find().sort({_id: 1});
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  });


  app.get('/ibm', async (req, res) => {
    try {
      const users = await Ibm.find().sort({_id: 1});
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching data' });
    }
  });

// POST route to create a new user

app.put('/users/:userId/verify', async (req, res) => {
    try {
      const userId = req.params.userId
      const { verify } = req.body;
      const new_userId=convertToFourDigitNumber(userId);
      const user = await User.findById(new_userId);
      const { userid } = req.body
      if (user.verify) 
      {
        console.log("data")
        return res.json(user);
      } 
      if (userid === undefined)
      {
       return res.json({ error: 'user id not provided' })
      }
      else{
        if (! await Authenticate.findOne({ _id : userid }))
        {
          return res.json({ error: 'wrong user id ' })
        }
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const currentTimeseries = new Date();
      user.verify = verify;
      user.verifiedby = userid;
      user.time = currentTimeseries;
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
      const { verify } = req.body;
      const new_userId=convertToFourDigitNumber(userId);
      const user = await User.findById(new_userId);
      
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
  
      const { userid } = req.body
      if (user.verify) 
      {
        console.log("data")
        return res.json(user);
      } 
      if (userid === undefined)
      {
       return res.json({ error: 'user id not provided' })
      }
      else{
        if (! await Authenticate.findOne({ _id : userid }))
        {
          return res.json({ error: 'wrong user id ' })
        }
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.verify = verify;
      user.verifiedby = userid;
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
      if (user.verify) 
      {
        console.log("data")
        return res.json(user);
      } 
      console.log("data created")
      const { userid } = req.body
      if (userid === undefined)
      {
       return res.json({ error: 'user id not provided' })
      }
      else{
        if (! await Authenticate.findOne({ _id : userid }))
        {
          return res.json({ error: 'wrong user id ' })
        }
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const currentTimeseries = new Date();
      user.verify = verify;
      user.verifiedby = userid;
      user.time = currentTimeseries;
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

  app.get('/users/verified/count', async (req, res) => {
    try {
      const count = await User.countDocuments({ verify: true });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error counting verified users' });
    }
  });

  app.get('/ibm/verified/count', async (req, res) => {
    try {
      const count = await Ibm.countDocuments({ verify: true });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error counting verified users' });
    }
  });

  app.get('/google/verified/count', async (req, res) => {
    try {
      const count = await Google.countDocuments({ verify: true });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error counting verified users' });
    }
  });

  app.get('/google-reception-count', async (req, res) => {
    try {
      // Get the IDs to match from the 'matchingIds' collection
      const matchingIds = await Google.find({}, '_id');
  
      // Extract the IDs from the matchingIds array
      const idsToMatch = matchingIds.map((entry) => entry._id);
  
      // Count the number of verified users with matching IDs
      const count = await User.countDocuments({ _id: { $in: idsToMatch }, verify: true });
  
      res.json({ count });
    } catch (error) {
      console.error('Error fetching verified user count:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });

  app.get('/ibm-reception-count', async (req, res) => {
    try {
      // Get the IDs to match from the 'matchingIds' collection
      const matchingIds = await Ibm.find({}, '_id');
  
      // Extract the IDs from the matchingIds array
      const idsToMatch = matchingIds.map((entry) => entry._id);
  
      // Count the number of verified users with matching IDs
      const count = await User.countDocuments({ _id: { $in: idsToMatch }, verify: true });
  
      res.json({ count });
    } catch (error) {
      console.error('Error fetching verified user count:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });

  function formatDateToYYYYMMDDHHMISS(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  
  function parseStringToDate(yyyy_mm_dd_hh_mi_ss) {
    // Split the input string into date and time parts
    const [datePart, timePart] = yyyy_mm_dd_hh_mi_ss.split(' ');
  
    // Split the date part into year, month, and day components
    const [year, month, day] = datePart.split('-').map(Number);
  
    // Split the time part into hour, minute, and second components
    const [hour, minute, second] = timePart.split(':').map(Number);
  
    // Create a new Date object
    const dateObject = new Date(year, month - 1, day, hour, minute, second); // Months are zero-based

    if (isNaN(dateObject.getTime())) {
      throw new Error('Invalid date format');
    }
  
    return dateObject;
  }

  function compareTimeSeries(date1, date2) {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      throw new Error('Both arguments must be valid Date objects');
    }
  
    if (date1 < date2) {
      return 'earlier';
    } else if (date1 > date2) {
      return 'later';
    } else {
      return 'equal';
    }
  }

  function getLatestTimeSeries(callback) {
    // Find the document with the latest timestamp
    TimeSeries.findOne().sort({ timestamp: -1 }).exec((err, latestEntry) => {
      if (err) {
        console.error('Error getting latest time series:', err);
        callback(err, null);
      } else {
        callback(null, latestEntry);
      }
    });
  }

  function getLatestTimeSeries() {
    return User.findOne().sort({ time: -1 });
  }

  function getDataBetweenTimeSeries(startDate, endDate) {
    return User.find({
      time: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();
  }

app.get('/current-timeseries', (req, res) => {
  try {
    const currentTimeseries = new Date(); // Get the current date and time in a readable format
    const parsedDate = Date.parse(currentTimeseries);
    const return_data= formatDateToYYYYMMDDHHMISS(currentTimeseries)
    const sampledate=new Date("2023-09-14 23:14:13")

    const startTimestamp = new Date('2023-09-14T18:42:06.668Z'); // Replace with your start date and time
    const endTimestamp = new Date('2023-09-14T18:43:08.832Z');   // Replace with your end date and time

    getDataBetweenTimeSeries(startTimestamp, endTimestamp)
      .then((data) => {
        console.log('Data between time series:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    const data = [45,6565,544]
    res.json({ return_data});
  } catch (error) {
    console.error('Error fetching current timeseries:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

async function isNull() {
  try {
    const count = await User.countDocuments({ 'time': null });

    // If count is zero, it means the field is null in all rows
    return count === 0;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getAllVerifiedUsers() {
  try {
    const verifiedUsers = await User.find({ verify: true });

    return verifiedUsers;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getVerifiedUsersAfterTimestamp(timestamp) {
  try {
    const verifiedUsers = await User.find({
      verify: true,
      time: { $gt: timestamp }, // Filter by timestamp greater than or equal to the provided value
    });
    return verifiedUsers;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function getMaxTime() {
  try {
    const latestDocument = await User.findOne({}).sort({ time: -1 });

    if (latestDocument) {
      // Use the specified field name to extract the value
      const fieldValue = latestDocument["time"];
      return fieldValue;
    } else {
      // Handle the case where no documents exist in the collection
      return null; // or any other default value
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

app.post('/time-sync', async (req, res,next) => {
  try {
    const userMaxtime = req.body.maxtime; // Assuming the client sends the string in the 'inputString' field of the request body
    if(userMaxtime === null)
    {
      const data= await getAllVerifiedUsers();
      const maxtime = await getMaxTime({ time: -1 });
      res.json({ data  ,maxtime});
    }
    else
    {
      const time_data = new Date(userMaxtime)
      const data= await getVerifiedUsersAfterTimestamp(time_data)
      const maxtime = await getMaxTime();
      res.json({ data  , maxtime});
      next()
    }

    
    
  } catch (error) {
    console.error('Error processing string:', error);
    res.status(500).json({ error: 'Error processing string' });
  }
});

app.post('/getUsersByInstitution', async (req, res) => {
  try {
    const institutionName = req.body.institution; // Extract institution name from the request body

    if (!institutionName) {
      return res.status(400).json({ error: 'Institution name is required in the request body' });
    }

    const users = await User.find({ institution: institutionName });

    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});


async function checkCredentials(userid, password) {
  try {
    const user = await Authenticate.findOne({ "_id" :  userid });

    if (!user) {
      console.log("no user found")
      return null; // User not found
    }

    // In production, use a secure password hashing library to compare passwords
    if (user.password === password) {
      console.log("correct password")
      return user; // Credentials match
    } else {
      console.log("wrong password")
      return null; // Incorrect password
    }
  } catch (error) {
    throw error;
  }
}

app.post('/login', async (req, res) => {
  const { userid, password } = req.body;

  try {
    const user = await checkCredentials(userid, password);

    if (user) {
      res.json({ message: 'Login successful', user , authenticate_status : true });
    } else {
      res.json({ authenticate_status : false, message : 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error checking credentials' });
  }
});

app.get('/count-update', async (req, res) => {
  try {
    const Ibm_verfied_count = await Ibm.countDocuments({ verify: true });
    const google_verfied_count = await Google.countDocuments({ verify: true })
    const user_verfied_count = await User.countDocuments({ verify: true })

    const total_user_count = await User.countDocuments({ })
    const total_ibm_count = await Ibm.countDocuments({ })
    const total_google_count = await Google.countDocuments({ })
    
    res.json({ "user total": total_user_count ,"google total" : total_google_count, "ibm total" : total_ibm_count , "user total":total_user_count , "user verfied": user_verfied_count,"google verifed" : google_verfied_count ,"ibm verified":Ibm_verfied_count });
  } catch (error) {
    res.status(500).json({ error: 'Error counting verified users' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
