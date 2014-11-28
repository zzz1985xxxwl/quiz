(function($) {
    'use strict';
    var $items = $('.item'),
        quizLength = $items.length - 2,
        $btns = $items.find('.btn'),
        $name = $('#txtName'),
        $quizWrap = $('#quizWrap'),
        $warning = $('#warning'),
        $quizTime = $('#quizTime');

    function init() {
        $btns.each(function(i, item) {
            item = $(item);
            item.attr('href', '#' + (+item.closest('.item').attr('id').replace(/d/g, '') + (item.hasClass('btn-default') ? -1 : 1)));
        });
        $('#d0').find('a').click(function() {
            if ($.trim($name.val()) === '') {
                $warning.slideDown(200).find('.content').text('Please enter Name');
                setTimeout(function() {
                    $warning.slideUp(200);
                }, 2000);
                return false;
            }
        });
        $quizTime.text('');
    }

    var quiztimer = (function() {
        var timer, c = 0,
            start = false;

        function setTime() {
            c++;
            var min = addZero(Math.floor(c / 60)),
                sec = addZero(c % 60);
            $quizTime.text(min + ':' + sec);
        }

        function addZero(num) {
            num = '' + num;
            if (num.length < 2) {
                num = '0' + num;
            }
            return num;
        }

        return {
            start: function() {
                if (start) {
                    return;
                }
                start = true;
                setTime();
                timer = setInterval(setTime, 1000);
                $.post('/api/quiz', {
                    name: $name.val()
                });
            },
            end: function() {
                clearInterval(timer);
                $quizTime.text('');
                var anslist = [];
                $items.find('textarea').each(function() {
                    anslist.push($(this).val());
                });
                $.post('/api/quiz', {
                    'name': $name.val(),
                    'anslist':anslist
                });
            }
        };
    })();

    init();
    crossroads.addRoute('{n}', function(n) {
        n = +n;
        $quizWrap.css({
            'margin-left': -618 * n
        }).parent().css('height', $('#d' + n).height());
        if (n >= 1 && n <= quizLength) {
            quiztimer.start();
        }
        if (n > quizLength) {
            quiztimer.end();
        }
    });
    hasher.initialized.add(crossroads.parse, crossroads);
    hasher.changed.add(crossroads.parse, crossroads);
    hasher.init();
})(jQuery);
