const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const FriendRequest = require('../models/friendRequest');

const SECRET_KEY = 'Letsmakenewfriends';

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send({ error: 'Unauthorized' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

router.use((req, res, next) => {
  req.io = req.app.get('io');
  next();
});

router.get('/home', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends');
    res.send({
      user,
      allUsers: user.friends,
    });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching users' });
  }
});

router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({ username: new RegExp(query, 'i') });
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Error searching users' });
  }
});

router.post('/send-request', authMiddleware, async (req, res) => {
  try {
    const { receiverId } = req.body;  

  
    if (req.userId === receiverId) {
      return res.status(400).send({ error: 'You cannot send a friend request to yourself' });
    }

  
    const existingRequest = await FriendRequest.findOne({
      sender: req.userId,
      receiver: receiverId,
    });

    if (existingRequest) {
      return res.status(400).send({ error: 'Friend request already sent' });
    }

  
    const newRequest = new FriendRequest({
      sender: req.userId,
      receiver: receiverId,
    });

    await newRequest.save();

    req.io.emit('friend-request', { senderId: req.userId, receiverId });

    res.status(200).send({ message: 'Friend request sent' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error sending friend request' });
  }
});

router.post('/manage-request', authMiddleware, async (req, res) => {
  try {
    const { friendRequestId, action } = req.body;

    const friendRequest = await FriendRequest.findById(friendRequestId);

    if (!friendRequest) {
      return res.status(404).send({ error: 'Friend request not found' });
    }

   
    if (friendRequest.receiver.toString() !== req.userId) {
      return res.status(403).send({ error: 'You are not authorized to manage this request' });
    }

   
    if (action === 'accept') {
      friendRequest.status = 'accepted';
      await friendRequest.save();

      
      const sender = await User.findById(friendRequest.sender);
      const receiver = await User.findById(friendRequest.receiver);

      if (!sender || !receiver) {
        return res.status(404).send({ error: 'Sender or Receiver not found' });
      }

      
      if (!receiver.friends.includes(sender._id)) {
        receiver.friends.push(sender._id);
      }
      if (!sender.friends.includes(receiver._id)) {
        sender.friends.push(receiver._id);
      }

      
      await sender.save();
      await receiver.save();

      req.io.emit('friend-request-status', { friendRequestId, action: 'accepted' });

      return res.send({ message: 'Friend request accepted' });

    } 
   
    else if (action === 'reject') {
      friendRequest.status = 'rejected';
      await friendRequest.save();

      req.io.emit('friend-request-status', { friendRequestId, action: 'rejected' });

      return res.status(302).send({ message: 'Friend request rejected' });

    } 
    else {
      return res.status(400).send({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Error managing friend request' });
  }
});



router.get('/recommend-friends', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'friends username');
    const userFriendIds = user.friends.map((friend) => friend._id.toString());


    const candidates = await User.find({
      _id: { $nin: [...userFriendIds, req.userId] },
    }).populate('friends', 'username _id');

   
    const recommendations = candidates.map((candidate) => {
     
      const mutualFriends = candidate.friends.filter((friend) =>
        userFriendIds.includes(friend._id.toString())
      );

      return {
        _id: candidate._id,
        username: candidate.username,
        mutualFriendsCount: mutualFriends.length,
        mutualFriends: mutualFriends.map((mf) => mf.username),
      };
    });


    recommendations.sort((a, b) => b.mutualFriendsCount - a.mutualFriendsCount);

    res.send(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error fetching recommendations' });
  }
});



router.get('/sent-requests', authMiddleware, async (req, res) => {
  try {
    const sentRequests = await FriendRequest.find({ sender: req.userId }).populate('receiver', 'username');
    res.send(sentRequests);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching sent requests' });
  }
});


router.get('/received-requests', authMiddleware, async (req, res) => {
  try {
    const receivedRequests = await FriendRequest.find({ receiver: req.userId }).populate('sender', 'username');
    res.send(receivedRequests);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching received requests' });
  }
});


module.exports = router;