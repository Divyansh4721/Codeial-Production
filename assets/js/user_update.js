{
    function readURL(input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $('#profile-user-avatar')
                    .attr('src', e.target.result)
            };
            reader.readAsDataURL(input.files[0])
        }
    }
}
{
    $('#chngpass').click(() => {
        $('#cpassword').css('display', 'block');
        $('#password').css('display', 'block');
        $('#chngpass').css('display', 'none');
        $('#inputbox').css('height', '350px');
    });
}