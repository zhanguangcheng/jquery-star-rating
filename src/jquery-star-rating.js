/*!
 * 基于jQuery的星级评价小插件
 *
 * @link https://github.com/zhanguangcheng/jquery-star-rating
 * @author Grass <14712905@qq.com>
 * @version 0.1
 */
(function (factory) {
    if (typeof define == 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports == 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    "use strict"

    var defaultOptions = {
        readonly: false,
        defaultStar: 0,
        starNumber: 5,
        step: 0.5,
        theme: 'images/default.jpg',
        eventHover: function (event, star, options) { },
        eventOut: function (event, star, options) { },
        eventChange: function (event, star, options) { },

        starWidth: 24,
        starHeight: 24,
    };

    $.fn.starRating = function (options) {
        options = $.extend({}, defaultOptions, options);
        var getStar = function (x) {
            return Math.ceil((x / options.starWidth).toFixed(1) / options.step) / (1 / options.step);
        };
        var showStar = function (cxt, star) {
            var left = options.starHeight * 2;
            if (star == options.starNumber) {
                left = options.starHeight * 3;
            } else if (star >= options.starNumber * 0.6) {
                left = options.starHeight;
            }
            $('.choose-star', cxt).css({
                width: options.starWidth * options.step * star * (1 / options.step),
                backgroundPosition: 'left -' + left + 'px'
            });
        };

        $.each(this, function () {
            var $this = $(this);
            var elementOptions = {};
            $.each(['readonly', 'defaultStar', 'starNumber', 'step', 'theme', 'starWidth', 'starHeight'], function(i, attr) {
                if ($this.data(attr)) {
                    elementOptions[attr] = $this.data(attr);
                }
            });
            options = $.extend({}, options, elementOptions);
            var currentStar = options.defaultStar;
            var currentHoverStar;

            /** initial */
            $this.bind('starRating:hover', options.eventHover);
            $this.bind('starRating:out', options.eventOut);
            $this.bind('starRating:change', options.eventChange);
            $this.html('<div class="choose-star"></div>');
            $this.css({
                width: options.starWidth * options.starNumber,
                height: options.starHeight,
                background: 'url(' + options.theme + ') repeat-x left top',
            });
            $this.find('.choose-star').css({
                width: options.starWidth * options.defaultStar,
                height: options.starHeight,
                background: 'url(' + options.theme + ') repeat-x left top',
            });

            /** process event */
            showStar($this, currentStar);
            if (options.readonly) {
                return;
            }
            $this.on('mousemove', function (event) {
                var star = getStar(event.offsetX);
                if (currentHoverStar != star) {
                    currentHoverStar = star;
                    showStar($this, star);
                    $this.trigger('starRating:hover', [star, options]);
                }
            }).on('mouseleave', function (event) {
                showStar($this, currentStar);
                currentHoverStar = currentStar;
                $this.trigger('starRating:out', [currentStar, options]);
            }).on('click', function (event) {
                currentStar = getStar(event.offsetX);
                $this.trigger('starRating:change', [currentStar, options]);
            });
        })
    };
});
