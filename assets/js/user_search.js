{
    let a = document.querySelector('#headersearch');
    if (a) {
        a.addEventListener('keyup', function () {
            $.ajax({
                type: 'post',
                url: 'http://localhost:8000/api/v1/users/search/?name=' + a.value,
                success: function (data) {
                    $('#searchoptions')[0].innerHTML = "";
                    if (typeof data.user == 'string') {
                        endanimation();
                        return;
                    }
                    startanimation();
                    if (typeof data.user == 'object' && data.user.length == 0) {
                        $('#searchoptions').append(`<div id="eachoption" onclick=""><span>No User Found</span></div>`);
                        return;
                    }
                    else {
                        for (let i of data.user) {
                            $('#searchoptions').append(`<a href="/users/profile/${i._id}"><div id="eachoption" onclick=""><img src="${i.avatar}"><span>${i.name}</span></div></a>`);
                        }
                    }
                }
            });
        });
        document.addEventListener('click', function () {
            $('#searchoptions')[0].innerHTML = "";
            endanimation();
        });
        function startanimation() {
            $('#searchoptions').css('padding-bottom', '5px');
            $('#searchbar').css('box-shadow', '0px 0px 30px slategray');
            $('#searchbar').css('border-radius', '0px 0px 10px 10px');
            $('#searchbox').css('width', '260px');
            $('#searchbar').css('background-color', 'white');
            $('#logo').css('opacity', '0');
            $('#arrowleft').css('opacity', '1');
        }
        function endanimation() {
            $('#searchoptions').css('padding-bottom', '0');
            $('#searchbar').css('box-shadow', '0px 0px 0px slategray');
            $('#searchbar').css('border-radius', '0');
            $('#searchbox').css('width', '230px');
            $('#searchbar').css('background-color', '#0571ed');
            $('#logo').css('opacity', '1');
            $('#arrowleft').css('opacity', '0');
        }
    }
}