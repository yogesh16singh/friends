const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userSchema'); 
const dotenv = require('dotenv');
dotenv.config();

const generateRandomUsername = (index) => {
  return `user_${index + 1}`;
};

const generateRandomInterests = () => {
  const interestsList = ['coding', 'music', 'reading', 'traveling', 'photography', 'sports', 'gaming', 'cooking', 'fitness', 'movies', 'gardening', 'hiking'];
  const randomInterests = [];
  const numInterests = Math.floor(Math.random() * 3) + 2; 
  for (let i = 0; i < numInterests; i++) {
    const randomInterest = interestsList[Math.floor(Math.random() * interestsList.length)];
    if (!randomInterests.includes(randomInterest)) {
      randomInterests.push(randomInterest);
    }
  }
  return randomInterests;
};

const generateUsers = (numUsers = 100) => {
  const users = [];
  for (let i = 0; i < numUsers; i++) {
    users.push({
      username: generateRandomUsername(i),
      password: `password${i + 1}`,
      interests: generateRandomInterests(),
    });
  }
  return users;
};

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('Cleared existing users');

    const userDocs = [];
    const users = generateUsers(100); 

  
    for (const user of users) {

      const newUser = new User(user);
      const savedUser = await newUser.save();
      userDocs.push(savedUser); 
      console.log(`Created user: ${user.username}`);
    }

  
    for (let i = 0; i < userDocs.length; i++) {
      const currentUser = userDocs[i];
      const friendsToAdd = [];
      
      while (friendsToAdd.length < 5) {
        const randomFriend = userDocs[Math.floor(Math.random() * userDocs.length)];
        if (randomFriend._id.toString() !== currentUser._id.toString() && !friendsToAdd.includes(randomFriend._id.toString())) {
          friendsToAdd.push(randomFriend._id.toString());
        }
      }

      await User.findByIdAndUpdate(currentUser._id, {
        $push: { friends: { $each: friendsToAdd } },
      });

      for (const friendId of friendsToAdd) {
        await User.findByIdAndUpdate(friendId, {
          $push: { friends: currentUser._id },
        });
      }

      console.log(`Added friends for user: ${currentUser.username}`);
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();