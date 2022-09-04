
{
    let createPost = function () {
        let newPostForm = $('#new-post-form');



        newPostForm.submit(function (e) {

            e.preventDefault();
            $(this).ajaxSubmit({
                success: function (data) {
                    new Noty({
                        theme: 'nest',
                        text: data.message,
                        type: data.status,
                        layout: 'topCenter',
                        timeout: 1500
                    }).show();
                    if (data.status == 'success') {
                        let newPost = newPostDom(data.data.post);
                        $('#post-form-content')[0].value = '';
                        $('#post-form-image')[0].value = '';
                        $('#post-list-container>ul').prepend(newPost);
                        deletePost($(' .delete-post-button', newPost));
                        $(' #new-comment-form', newPost).submit(function (e) {
                            e.preventDefault();
                            createCommentAJAX($(' #new-comment-form', newPost));
                        });
                        $('#post-like-button').click(allpostlikebuttonfunc);
                    }
                },
                error: function (err) {
                    console.log(error.resposeText);
                }
            })
        });

        let alldeletebuttons = $(document.querySelectorAll('.delete-post-button'));
        for (let onebutton of alldeletebuttons) {
            deletePost(onebutton);
        }
    }
    function convertDate(fulldate) {
        let b = new Date(fulldate);
        let time = new Date(fulldate).toString().slice(0, 21).split("").reverse().join("").slice(0, 5).split("").reverse().join("");
        let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let a = b.getDate() + ' ' + month[b.getMonth()] + ' ' + 'at ' + time;
        return a;
    }
    let newPostDom = function (i) {
        return $(`
        <li class="main-post-container" id="post-${i._id}">
        <div id="post-header">
            <div id="post-header-sub1">
                <img id="post-avatar" src="${i.user.avatar}" alt="${i.user.name}">
        
                <span id="post-user-name">
                    ${i.user.name}
                </span>
                <span id="post-time">
                    ${convertDate(i.createdAt)}
                        <i class="fas fa-cog"></i>
                </span>
                <div id="post-details">
                        <a class="delete-post-button" href="/posts/destroy/${i._id}"><i class="fas fa-trash-alt"></i></a>
                </div>
            </div>
            <div id="post-header-sub2">
                <span id="post-content">
                    ${i.content}
                </span>
            </div>
        </div>
        <div id="post-image" style="display: flex;justify-content: center;background-color: black;position: relative;">
            <img src="${i.postImage}" alt="${i.user.name}"
                style="position: relative;max-height: 670px;max-width: 100%;">
        </div>
        <div id="post-comment-container">
        
            <div id="post-comments-list">
                <div id="post-comment-header1">
                    <span id="commentcount">
                        <span id="comment-count-${i._id}">
                            ${i.comments.length}
                        </span> comments
                    </span>
                    <span id="likecount">
                        <i class="fas fa-thumbs-up"></i>
                        <span id="like-count-${i._id}">
                            ${i.like.length}
                        </span> likes
                    </span>
                </div>
                <div id="post-comment-header2">
                <form action="/likes/create" method="POST" id="post-like-form">
                    <input type="checkbox" name="like" id="post-like-checkbox-${i._id}" style="display: none;">
                    <input type="hidden" name="refid" value="${i._id}">
                    <input type="hidden" name="reftype" value="Post">
                    <label for="post-like-checkbox-${i._id}">
                    <div id="post-like-button">
                        <i class="fas fa-thumbs-up"><span>Like</span></i>
                    </div>
                    </label>
                </form>
                <div id="post-comment-button">
                <label for="comment-content-${i._id}">
                    <i class="fas fa-comment"><span>Comment</span></i>
                </label>
                </div>
                </div>
                <ul id="post-comment-${i._id}">
        
                </ul>
            </div>
                <div id="post-comment-form">
                    <img src="${i.user.avatar}" alt="">
                    <form action="/comments/create" id="new-comment-form" method="POST">
                        <input id="comment-content-${i._id}" class="comment-content" name="content" type="text" placeholder="Write a comment..."
                            required></input>
                        <input type="hidden" name="post" value="${i._id}">
                        <input id="submit-${i._id}" class="submit" type="submit" value="" style="display: none;">
                        <label for="submit-${i._id}">
                            <i id="submit" class="fas fa-paper-plane"></i>
                        </label>
                    </form>
                </div>
        </div>
        
        </li>
    
        `);
    }


    let deletePost = function (deleteLink) {
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
                        $(`#post-${data.data.post_id}`).remove();
                    }
                },
                error: function (err) {
                    console.log(error.resposeText);
                }
            });
        });
    }




    createPost();
}
