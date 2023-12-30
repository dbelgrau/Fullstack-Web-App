const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});
const cors = require('cors');
const bp = require('body-parser');
const cookieParser = require('cookie-parser');
const comments = require('./websockets/comments');


server.listen(8080);
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(bp.urlencoded({extended: false}));
app.use(bp.json());

const usersRoute = require('./routes/users');
const memesRoute = require('./routes/memes');
const imagesRoute = require('./routes/images');
const commentsRoute = require('./routes/comments');
const dbRoute = require('./routes/database');

app.use('/api/users', usersRoute);
app.use('/api/memes', memesRoute);
app.use('/api/images', imagesRoute);
app.use('/api/comments', commentsRoute);
app.use('/api/database', dbRoute);

comments(io);