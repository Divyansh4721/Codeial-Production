{
    let a = $('#add-remove-friend');
    if (a[0]) {
        a.click(function () {
            let flag;
            if (a[0].innerText == 'Remove Friend') {
                flag = true;
                a[0].innerText = 'Add Friend';
                a.css('background-color', '#0571ed');
            }
            else {
                flag = false;
                a[0].innerText = 'Remove Friend';
                a.css('background-color', '#f02849');
            }
            $.ajax({
                type: 'post',
                url: '/friendship/create/?profileid=' + a[0].value + '&isFriend=' + flag,
                success: function (data) {
                    new Noty({
                        theme: 'nest',
                        text: data.message,
                        type: data.status,
                        layout: 'topCenter',
                        timeout: 1500
                    }).show();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        });
    }
}