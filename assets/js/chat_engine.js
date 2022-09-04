
class ChatEngine {
    constructor(chatBoxId, userEmail) {
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000', { transports: ['websocket'] });

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        this.socket.on('connect', function () {
            console.log('Connection Established!');

            //sending server req to open chat
            let allusers = document.querySelectorAll('#sec3-each-user');
            for (let i of allusers) {
                $(i).click(function (e) {
                    e.preventDefault();
                    if ($(i).data('email') != self.userEmail) {
                        self.socket.emit('join_room', {
                            my_email: self.userEmail,
                            user_email: $(i).data('email')
                        });
                    }
                });
            }


            //reciveing that which user chat is opened
            self.socket.on('user_joined', function (data) {
                if (data.email != self.userEmail) {
                    if ($('#chats-container')[0]) {
                        let a = 0;
                        let interval = setInterval(function () {
                            if ((a * -1) > $('#chats-container')[0].offsetHeight) {
                                clearInterval(interval);
                                $('#chats-container').remove();
                            }
                            $('#chats-container').css('bottom', a = a - 10);
                        }, 3);
                        self.socket.emit('close_chat', {
                            chat_id: $('#chats-container form').data('chatid'),
                        });
                    }
                    setTimeout(function () {

                        $('#home-container').append(newchat(data));
                        $('#chats-body')[0].scrollTo(0, Number.MAX_SAFE_INTEGER);
                        $('#chats-container').css('bottom', $('#chats-container')[0].offsetHeight * -1);
                        let a = $('#chats-container')[0].offsetHeight * -1;
                        let interval = setInterval(function () {
                            if (a > -12) {
                                clearInterval(interval);
                            }
                            $('#chats-container').css('bottom', a = a + 10);
                        }, 3);

                        $('#chats-container .fa-times').click(function () {
                            let a = 0;
                            let interval = setInterval(function () {
                                if ((a * -1) > $('#chats-container')[0].offsetHeight) {
                                    clearInterval(interval);
                                    $('#chats-container').remove();
                                }
                                $('#chats-container').css('bottom', a = a - 10);
                            }, 3);

                            self.socket.emit('close_chat', {
                                chat_id: $('#chats-container form').data('chatid'),
                            });
                        });


                        //sending chat to server
                        $('#chat-form-id').submit(function (e) {
                            e.preventDefault();
                            let msg = $('#chat-form-input').val();
                            if (msg != "") {
                                self.socket.emit('chat_sent', {
                                    user_email: self.userEmail,
                                    chat_id: $('#chats-container form').data('chatid'),
                                    content: msg,
                                });
                            }
                        });
                    }, 500);

                }
            });



            //recieving chat from server
            self.socket.on('chat_recieved', function (data) {

                let messageType = 'otherlft';
                if (data.user_email == self.userEmail) {
                    messageType = 'userrt';
                }

                let newMessage = $(`
                    <div class="${messageType}">
                        <div id="content">${data.content}</div>
                        <div id="time">29 May at 20:09</div>
                    </div>
                `);

                $('#chats-body-body').append(newMessage);
                $('#chat-form-input').val('');
                $('#chats-body')[0].scrollTo(0, Number.MAX_SAFE_INTEGER);
            });

        });
    }
}


function convertDate(fulldate) {
    let b = new Date(fulldate);
    let time = new Date(fulldate).toString().slice(0, 21).split("").reverse().join("").slice(0, 5).split("").reverse().join("");
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let a = b.getDate() + ' ' + month[b.getMonth()] + ' ' + 'at ' + time;
    return a;
}

function newchat(data) {
    let livechat = "";
    for (let i of data.allchats) {
        let type = 'userrt';
        if (data.id == i.user) {
            type = 'otherlft';
        }
        livechat += `
        <div class="${type}">
            <div id="content">${i.content}</div>
            <div id="time">${convertDate(i.createdAt)}</div>
        </div>
        `
    }
    return ($(`
    <div id="chats-container">
    <div id="chats-header">
        <div id="header-avatar" onclick="location.href='/users/profile/${data.id}'">
            <img src="${data.avatar}" alt="">
            <span>${data.name}</span>
        </div>
        <i class="fas fa-times"></i>
    </div>
    <div id="chats-body">
        <div id="chats-body-header">
            <img src="${data.avatar}" alt="">
            <br>
            <span id="name">${data.name}</span><br>
            <span id="text">Codeial</span><br>
            <span id="text">You're friends on Codeial</span>
        </div>
        <div id="chats-body-body">
            ${livechat}
        </div>
    </div>
    <div id="chat-form">
        <form id="chat-form-id" data-chatid="${data.chat_id}">
            <input name="content" id="chat-form-input" type="text" placeholder="Type a message.." autocomplete="off">
            <button type="submit" id="chat-form-submit" style="display: none;"></button>
            <label for="chat-form-submit">
                <i class="fas fa-paper-plane"></i>
            </label>
        </form>
    </div>
</div>
    `));
}