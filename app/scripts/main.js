 + function($) {
     'use strict';
     var $quizContainer = $("#quizContainer"),
         $items = $(".item"),
         $btns = $items.find(".btn"),
         $name = $("#txtName"),
         $quizWrap=$("#quizWrap"),
         $warning=$("#warning");

     function init() {
         $btns.each(function(i, item) {
             item = $(item);
             item.attr("href", "#" + (+item.closest(".item").attr("id").replace(/d/g, '') + (item.hasClass("btn-default") ? -1 : 1)));
         });
         $("#d0").find("a").click(function() {
             if ($.trim($name.val()) === "") {
             	$warning.slideDown(200).find(".content").text("Please enter Name");
             	setTimeout(function(){
             		$warning.slideUp(200);
             	},2000);
                return false;
             }
         });
     }

     init();
     crossroads.addRoute("{n}", function(n) {
         $quizWrap.css({"margin-left":-618*n}).parent().css("height",$("#d"+n).height());
     });
     hasher.initialized.add(crossroads.parse, crossroads);
     hasher.changed.add(crossroads.parse, crossroads);
     hasher.init();
 }(jQuery)
