import { $, isInView } from '../util/index';

export default function (UIkit) {

    UIkit.component('scrollspy', {

        args: 'cls',

        props: {
            cls: 'list',
            target: String,
            hidden: Boolean,
            offsetTop: Number,
            offsetLeft: Number,
            repeat: Boolean,
            delay: Number
        },

        defaults: {
            cls: ['uk-scrollspy-inview'],
            target: false,
            hidden: true,
            offsetTop: 0,
            offsetLeft: 0,
            repeat: false,
            delay: 0,
            inViewClass: 'uk-scrollspy-inview'
        },

        init() {
            this.$emitSync();
        },

        computed: {

            elements() {
                return this.target && $(this.target, this.$el) || this.$el;
            }

        },

        update: [

            {

                write() {
                    if (this.hidden) {
                        this.elements.filter(`:not(.${this.inViewClass})`).css('visibility', 'hidden');
                    }
                }

            },

            {

                read() {
                    this.elements.each((_, el) => {

                        if (!el._scrollspy) {
                            var cls = $(el).attr('uk-scrollspy-class');
                            el._scrollspy = {toggles: cls && cls.split(',') || this.cls};
                        }

                        el._scrollspy.show = isInView(el, this.offsetTop, this.offsetLeft);

                    });
                },

                write() {

                    var index = this.elements.length === 1 ? 1 : 0;

                    this.elements.each((i, el) => {

                        var $el = $(el), data = el._scrollspy, cls = data.toggles[i] || data.toggles[0];

                        if (data.show) {

                            if (!data.inview && !data.timer) {

                                data.timer = setTimeout(() => {

                                    $el.css('visibility', '')
                                        .addClass(this.inViewClass)
                                        .toggleClass(cls)
                                        .trigger('inview');

                                    data.inview = true;
                                    delete data.timer;

                                }, this.delay * index++);

                            }

                        } else {

                            if (data.inview && this.repeat) {

                                if (data.timer) {
                                    clearTimeout(data.timer);
                                    delete data.timer;
                                }

                                $el.removeClass(this.inViewClass)
                                    .toggleClass(cls)
                                    .css('visibility', this.hidden ? 'hidden' : '')
                                    .trigger('outview');

                                data.inview = false;

                            }

                        }

                    });

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    });

}
