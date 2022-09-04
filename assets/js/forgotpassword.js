$('#forgotpassword').click(function () {
    if ($('#email')[0].value) {
        $.ajax({
            type: 'get',
            url: '/reset-password/' + $('#email')[0].value,
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
                console.log(error.resposeText);
            }
        });
    }
    else {
        new Noty({
            theme: 'nest',
            text: 'Please Enter a Valid Email!',
            type: 'warning',
            layout: 'topCenter',
            timeout: 1500
        }).show();
    }
});