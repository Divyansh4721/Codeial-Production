function allpostlikebuttonfunc() {
    let a = this;
    a = a.querySelector('i');
    $.ajax({
        type: 'post',
        url: '/likes/create',
        data: $(this.parentElement.parentElement).serialize(),
        success: function (data) {
            if ($(a).css("color") == 'rgb(5, 113, 237)') {
                a.style.color = '#6f6a6b';
            }
            else {
                a.style.color = '#0571ed';
            }
            $('#like-count-' + data.data.refid)[0].innerHTML = data.data.numoflikes;
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function allcommentlikebuttonfunc() {
    let a = this;
    $.ajax({
        type: 'post',
        url: '/likes/create',
        data: $(this.parentElement.parentElement).serialize(),
        success: function (data) {
            if ($(a).css("color") == 'rgb(5, 113, 237)') {
                a.style.color = '#6f6a6b';
            }
            else {
                a.style.color = '#0571ed';
            }
            $('#comment-like-count-' + data.data.refid)[0].innerHTML = data.data.numoflikes;
        },
        error: function (err) {
            console.log(err);
        }
    })
}


let createLikePost = function () {

    let allpostlikebutton = $(document.querySelectorAll('#post-like-button'));
    for (let eachbutton of allpostlikebutton) {
        $(eachbutton).click(allpostlikebuttonfunc);
    }


    let allcommentlikebutton = $(document.querySelectorAll('#comment-like-button'));
    for (let eachbutton of allcommentlikebutton) {
        $(eachbutton).click(allcommentlikebuttonfunc);
    }
}
createLikePost();