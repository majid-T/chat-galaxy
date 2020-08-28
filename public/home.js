$(document).ready(()=>{
    let usernameInput = $('#nickname');
    let warningBox = $('.theWarning');

    usernameInput.focus(()=>{
        usernameInput.val('');
        warningBox.css('opacity','0');
    })

    $('.avatar').on(
        {
            'click' : function(e){
                let username = usernameInput.val();
                if(username){
                    window.open(`/chatroom?nickname=${username}&avatar=${e.target.id}`,'_self');
                }else{
                    warningBox.css('opacity','1');
                    warningBox.text('First choose a nickname');
                }
            } ,

            'mouseenter' : function(){
                $(this).css('background-color' , "#F5F5F5");
            } ,
            'mouseleave' : function(){
                $(this).css('background-color' , "white");
            }
        }
    )


    $('.card').mouseleave(function(e){
        e.preventDefault();
        let username = $('#nickname').val();
        warningBox.css('opacity','0');
    });
})

