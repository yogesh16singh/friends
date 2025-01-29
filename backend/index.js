const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const userRoute = require('./router/userRoute');
const friendRoute = require('./router/friendRoute');
const cors = require('cors');

const corsOptions = {
  origin: '*', 
  methods: 'GET, POST, PUT, DELETE', 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};


app.use(cors(corsOptions));

dotenv.config();

const connectDB = require('./utils/dbconnection');
connectDB();

app.use(express.json());

app.set('io', io);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/users', userRoute);
app.use('/friends', friendRoute);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});