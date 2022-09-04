function createCommentAJAX(newCommentForm) {
    $.ajax({
        type: 'post',
        url: '/comments/create',
        data: newCommentForm.serialize(),
        success: function (data) {
            new Noty({
                theme: 'nest',
                text: data.message,
                type: data.status,
                layout: 'topCenter',
                timeout: 1500
            }).show();
            if (data.status == 'success') {
                let newComment = newCommentDom(data.data.comment);
                newCommentForm[0][0].value = '';
                $(`#comment-count-${data.data.postid}`)[0].innerText = data.data.numofcomment + " ";
                $(`#post-comment-${data.data.comment.post}`).append(newComment);
                deleteComment($(' .delete-comment-button', newComment));
                $(document.querySelector(`#comment-${data.data.comment._id}`).querySelector('#comment-like-button')).click(allcommentlikebuttonfunc);
            }
        },
        error: function (err) {
            console.log(error.resposeText);
        }
    });
}

var createComment = function () {
    let allcommentforms = $(document.querySelectorAll('#new-comment-form'));
    for (let newCommentForm of allcommentforms) {
        newCommentForm = $(newCommentForm);
        newCommentForm.submit(function (e) {
            e.preventDefault();
            createCommentAJAX(newCommentForm);
        });
    }
    let alldeletebuttons = $(document.querySelectorAll('.delete-comment-button'));
    for (let onebutton of alldeletebuttons) {
        deleteComment(onebutton);
    }
}
function convertDate(fulldate) {
    let b = new Date(fulldate);
    let time = new Date(fulldate).toString().slice(0, 21).split("").reverse().join("").slice(0, 5).split("").reverse().join("");
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let a = b.getDate() + ' ' + month[b.getMonth()] + ' ' + 'at ' + time;
    return a;
}
let newCommentDom = function (j) {
    return $(`
        <li id="comment-${j._id}">
        <img src="${j.user.avatar}" alt="">
        <div id="commentcontent">

            <div id="commentbox">
                <span id="span1">
                    ${j.user.name}
                </span>

                <br>
                <span id="span2">
                    ${j.content}
                </span>

                
                <div id="countlikes">
                    <i class="fas fa-thumbs-up"></i>
                    <span id="comment-like-count-${j._id}">${j.like.length}</span>
                </div>
            </div>

            <div id="span3">
                <form action="/likes/create" method="POST" id="comment-like-form">
                    <input type="checkbox" name="like" id="comment-like-checkbox-${j._id}" style="display: none;">
                    <input type="hidden" name="refid" value="${j._id}">
                    <input type="hidden" name="reftype" value="Comment">
                    <label for="comment-like-checkbox-${j._id}">
                        <span id="comment-like-button">Like</span>
                    </label>
                </form>
                <span id="commenttime">${convertDate(j.createdAt)}</span>
                <a class="delete-comment-button" href="/comments/destroy/${j._id}"><i class="fas fa-trash-alt"></i></a>
            </div>
        </div>
    </li>
        `);
}

let deleteComment = function (deleteLink) {
    $(deleteLink).click(function (e) {
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function (data) {
                new Noty({
                    theme: 'nest',
                    text: data.message,
                    type: data.status,
                    layout: 'topCenter',
                    timeout: 1500
                }).show();
                if (data.status == 'success') {
                    $(`#comment-count-${data.data.postid}`)[0].innerText = data.data.numofcomment + " ";
                    $(`#comment-${data.data.comment_id}`).remove();
                }
            },
            error: function (err) {
                console.log(error.resposeText);
            }
        });
    });
}

createComment();

