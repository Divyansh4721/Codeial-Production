const User = require('../models/user');
const Chatboxpair = require('../models/chatboxpair');
const Chat = require('../models/chat');


module.exports.chatSockets = function (socketServer) {
    let io = require('socket.io')(socketServer);
    io.sockets.on('connection', function (socket) {
        console.log('New Connection Recieved!', socket.id);

        socket.on('disconnect', function () {
            console.log('Socket Disconnected!');
        });

        socket.on('join_room', async function (data) {
            let user = await User.findOne({ email: data.user_email });
            if (user) {
                let pair1 = await Chatboxpair.findOne({ user1: data.my_email, user2: data.user_email });
                let pair2 = await Chatboxpair.findOne({ user2: data.my_email, user1: data.user_email });
                let pair;
                if (pair1) { pair = pair1; } else if (pair2) { pair = pair2; } else {
                    pair = await Chatboxpair.create({ user1: data.my_email, user2: data.user_email });
                }
                let chat = await Chat.find({ chatid: pair.id });
                socket.join(pair.id);
                // console.log('chat left', io.of("/").adapter.rooms);
                io.in(pair.id).emit('user_joined', {
                    name: user.name,
                    id: user.id,
                    email: user.email,
                    avatar: user.avatar,
                    chat_id: pair.id,
                    allchats: chat,
                });
            }
        });

        socket.on('chat_sent', async function (data) {
            let user = await User.findOne({ email: data.user_email });
            await Chat.create({ chatid: data.chat_id, content: data.content, user: user });
            io.in(data.chat_id).emit('chat_recieved', data);
            // console.log(data);
        });

        socket.on('close_chat', function (data) {
            socket.leave(data.chat_id);
            // console.log('chat left', io.of("/").adapter.rooms);

        });

    });
}