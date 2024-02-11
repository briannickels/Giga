$(document).ready(function(e){
    /* Mobile Menu */
    $('.button.is-menu').click(function(e){
        $('section.menu').toggleClass('is-open')
        setTimeout(function(){
            $('section.menu .menu-items-mobile').css('left', '30vw')
        }, 50)
    })

    $('.menu-mobile').click(function(e){
        if($(e.target).parents('.menu-mobile').length == 0) {
            $('section.menu .menu-items-mobile').css('left', '100vw')
            setTimeout(function(){
                $('section.menu').toggleClass('is-open')
            }, 500)
        }
    })

    $('.menu-mobile a.button.menu-item').click(function(){
        $('section.menu .menu-items-mobile').css('left', '100vw')
        setTimeout(function(){
            $('section.menu').toggleClass('is-open')
        }, 500)
    })

    function fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            var successful = document.execCommand('copy');
            if(successful)
                showCopiedMessage()
        } catch (err) {
        }

        document.body.removeChild(textArea);
    }

    function copyTextToClipboard(text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        navigator.clipboard.writeText(text).then(function () {
            showCopiedMessage()
        }, function (err) {
        });
    }

    function showCopiedMessage() {
        $('.ca .copied').removeClass('is-hidden')
        setTimeout(function(){
            $('.ca .copied').addClass('is-hidden')
        }, 1500)
    }

    $('.ca').click(function(e){
        copyTextToClipboard($('.ca span').first().text().trim())
    })

    $('a.button').click(function(e){
        let target = $(this).attr('href').split('#')[1]
        console.log(target)
        if(typeof(target) == 'undefined' || target.length == 0)
            return

        console.log(target)

        e.preventDefault()

        let mobileOffset = $('.is-hidden-mobile').is(':visible') ? 0 : 68

        $('html, body').animate({
            scrollTop: $("#" + target).offset().top - mobileOffset
        }, 500);
    })

    /* Buy With Card Modal */
    $('.cardbuy .button').click(function(){
        $('.cardbuy-modal').addClass('is-active')
        $.get('/getcardconfig', {
            _token: window.xtoken,
        }, function(response){
            if(response.success) {
                window.cardconfig = response.data
                $('.cardbuy-modal .overlay').addClass('is-hidden')
            } else {
                $('.cardbuy-modal .overlay').addClass('is-hidden')
                $('.cardbuy-modal .overlay.error').removeClass('is-hidden')
            }
        })
    })

    $('.cardbuy-modal .close').click(function(){
        $('.cardbuy-modal').removeClass('is-active')
    })

    /* Chatting */
    $('.chatinput input').on('keyup', function(e){
        let prompt = $('.chatinput input').val()

        if(prompt.length >= 2 && prompt.length <= 150) {
            $('.chatinput button').attr('disabled', false)
        } else {
            $('.chatinput button').attr('disabled', true)
        }

        if(e.keyCode == 13)
            sendPrompt()
    })

    $('.chatinput button').click(function(){
        sendPrompt()
    })

    let chats = 0
    function sendPrompt() {
        let prompt = $('.chatinput input').val()
        if(prompt.length < 2 && prompt.length > 150)
            return false

        if(chats == 2) {
            $('.chatbox .overlay').removeClass('is-hidden')
            return
        }

        if(chats == 0) {
            $('.chathistory p.prompt').html(prompt)
        } else {
            $('.chathistory').append('<div class="chat right"><p>' + prompt + '</p><img src="/assets/img/user.svg" alt=""></div>')
        }

        chats++

        $('.chathistory').append('<div class="chat left"><img src="/assets/img/head.png" alt=""><p class="loading-response"><img src="/assets/img/loading.svg" alt=""></p></div>')
        $('.chatinput input').val('')
        $('.chatinput input').attr('disabled', true)
        $('.chatinput button').attr('disabled', true)
        $('.chathistory')[0].scrollTop = $('.chathistory')[0].scrollHeight

        $.post('/chat', {
            '_token': window.xtoken,
            'prompt': prompt
        }, function(response){
            console.log(response)
            if(response.success)
                updateChat(prompt, response)
        })
    }

    function updateChat(prompt, response) {
        $('.chathistory .loading-response').html(response.response).removeClass('loading-response')
        $('.chatinput input').attr('disabled', false)
        $('.chathistory')[0].scrollTop = $('.chathistory')[0].scrollHeight
        $('.chatinput input').focus()
    }

    /* FAQ */
    $('.faq-item').click(function(){
        $('.faq-item.is-active').removeClass('is-active')
        $(this).addClass('is-active')
    })
})
