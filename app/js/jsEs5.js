'use strict';

$(document).ready(function () {
    var $menu__item = $('.menu__item');
    $menu__item.on('mouseover', function () {
        $(this).prev().find('.menu__link').addClass('beforeActive-js');
    });
    $menu__item.on('mouseleave', function () {
        $(this).prev().find('.menu__link').removeClass('beforeActive-js');
    });
});