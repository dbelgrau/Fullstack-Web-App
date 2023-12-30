const { addComment, modifyComment, deleteComment } = require("../controllers/comments");

const comments = (io) => {
  io.on('connection', socket => {
    //console.log('User connected');
  
    socket.on('disconnect', () => {
      //console.log('User disconnected');
    });

    socket.on("join-room", (id) => {
      //console.log('join', id);
      socket.join(id);
    });
    
    socket.on("leave-room", (id) => {
      //console.log('leave', id);
      socket.leave(id);
    });    
  
    socket.on('add-comment', async (data) => {
      const comment = await addComment(data);
      const room = data.id;
      socket.emit("receive-comment", comment);
      socket.to(room).emit("receive-comment", comment);
    });

    socket.on('update-comment', async (data) => {
      await modifyComment(data);
      const room = data.id;
      const comment = data;
      socket.emit("receive-update-comment", comment);
      socket.to(room).emit("receive-update-comment", comment);
    });
  
    socket.on('delete-comment', data => {
      deleteComment(data.cid);
      const room = data.id;
      socket.emit("receive-delete-comment", data.cid);
      socket.to(room).emit("receive-delete-comment", data.cid);
    });
  });
};

module.exports = comments;
