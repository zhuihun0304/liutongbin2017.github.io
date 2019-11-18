/*!
 * Clean Blog v1.0.0 (http://startbootstrap.com)
 * Copyright 2015 Start Bootstrap
 * Licensed under Apache 2.0 (https://github.com/IronSummitMedia/startbootstrap/blob/gh-pages/LICENSE)
 */


$(document).ready(function() {
    $('#toc').toc({title: "目录",listType: "ol"});


    $('#toc').affix({
        offset: {
            top: 525,
            bottom: function () {
                return (this.bottom = $('.footer').outerHeight(true));
            }
        }
    });
});

// Tooltip Init
$(function() {
    $("[data-toggle='tooltip']").tooltip();
});



$(function() {
// only load tagcloud.js in tag.html
    if($('#tag_cloud').length !== 0){
        $.fn.tagcloud.defaults = {
            //size: {start: 1, end: 1, unit: 'em'},
            color: {start: '#bbbbee', end: '#0085a1'},
        };
        $('#tag_cloud a').tagcloud();
    }
})



// make all images responsive
/*
 * Unuse by Hux
 * actually only Portfolio-Pages can't use it and only post-img need it.
 * so I modify the _layout/post and CSS to make post-img responsive!
 */
// $(function() {
// 	$("img").addClass("img-responsive");
// });

// responsive tables
$(document).ready(function() {
    $("table").wrap("<div class='table-responsive'></div>");
    $("table").addClass("table");
});

// responsive embed videos
$(document).ready(function () {
    $('iframe[src*="youtube.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="youtube.com"]').addClass('embed-responsive-item');
    $('iframe[src*="vimeo.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="vimeo.com"]').addClass('embed-responsive-item');
});

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
    var MQL = 1170;

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var headerHeight = $('.navbar-custom').height();
        $(window).on('scroll', {
                previousTop: 0
            },
            function() {
                var currentTop = $(window).scrollTop();
                //check if user is scrolling up
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                        $('.navbar-custom').addClass('is-visible');
                    } else {
                        $('.navbar-custom').removeClass('is-visible is-fixed');
                    }
                } else {
                    //if scrolling down...
                    $('.navbar-custom').removeClass('is-visible');
                    if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
                }
                this.previousTop = currentTop;
            });
    }
});


/**
 * Created by XmacZone on 2017/9/6.
 */
$(function() {
    $('.avatar').hover(function() {
      $(this).addClass('animated jello');
    },function() {
        $(this).removeClass('animated jello');
    })

});


$(function() {
    if( $("#search-btn").length > 0 ) {
        function searchGoogle(keyWord) {
            if(keyWord) {
                window.open('https://www.google.com/#q=site:darknights.me+'+ keyWord);
            }
        }
        $("#autocomplete").keyup(function(e) {
            if(e.which == 13) {
                var val = $("#autocomplete").val();

                $.each(window.searchData, function(i, item) {
                    if(val == item.value || item.value.indexOf(val) > 0) {
                        location.href = item.data;
                    }
                });

            }

        });

        $("#search-btn").click(function() {
            var val = $("#autocomplete").val();
            searchGoogle(val);
        })

        $.getJSON("https://cdn.darknights.cn/assets/search.json", function(res) {
            window.searchData = res.data;
            $('input[name="q"]').autoComplete({
                minChars: 1,
                source: function(term, suggest){
                    term = term.toLowerCase();
                    var choices = res.data;
                    var suggestions = [];
                    for (i=0;i<choices.length;i++)
                        if (~(choices[i].value+' '+choices[i].subtitle).toLowerCase().indexOf(term)) suggestions.push(choices[i]);

                    console.log(suggestions);
                    suggest(suggestions);
                },
                renderItem: function (item, search){
                    return '<div class="autocomplete-suggestion" data-val="'+item.value+'" data-data="'+ item.data +'"  data-search="'+search+'"> '+item.value+'</div>';
                },
                onSelect: function(e, term, item){
                    var $target = $(e.target),
                        value = $target.data("val"),
                        data = $target.data("data");
                    if(!!data) location.href= data;

                }
            });
        })
    }
});

//语法高亮
hljs.initHighlightingOnLoad();

var $nav = document.querySelector("nav");
if($nav) FastClick.attach($nav);
