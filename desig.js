(function() {
    var browser = false,
        jq,
        rejections,
        matches;

    // browser, needs jQuery defined
    if (typeof module === 'undefined') {
        module = {};
        jq = jQuery;
        browser = true;
    } else {
        jq = require('jquery');
    }

    rejections = [
        /^Dear/i,
        /^Hi/i,
        /^Good/i
    ];

    matches = [
        /^\s*([A-Z]\w+\s*){2,}\s*$/,
        /^\s*Yours (sincerely|faithfully),?\s*$/i,
        /^\s*(with|many) thanks,?(\s*[A-Z]\w+)*\s*$/i,
        /^\s*(Thanks and|Kind|best)?\s*regards,?(\s*[A-Z]\w+)*\s*$/i,
        /^[-=]{5,}\s*$/,
        /^\s*This email is intended only for the named recipient\s?/
    ];

    module.exports = {
        sigStart: function(s) {
            var i,
                regex,
                result;

            for (i = 0; i < rejections.length; i++) {
                regex = rejections[i];
                if (regex.test(s)) {
                    return false;
                }
            }
            for (i = 0; i < matches.length; i++) {
                regex = matches[i];
                if (regex.test(s)) {
                    return true;
                }
            }
            return false;
        },
        index: function(s) {
            var has = module.exports.get(s);

            return has && has.index;
        },
        get: function(s) {
            var $,
                container,
                found = null,
                previous;

            if (browser) {
                $ = jQuery;
                container = $('<div></div>');
            } else {
                $ = jq.create();
                container = $('body');
            }

            container.html(s);
            container.contents().each(function(i, node) {
                // hasn't found something
                // must follow blank text
                // must be text node
                // must match sig rules
                if (!found && !previous && node.nodeType === 3 && module.exports.sigStart(node.nodeValue)) {
                    found = {
                        index: i,
                        value: node.nodeValue
                    };
                }
                previous = node.nodeValue;
            });

            return found;
        },
        has: function(s) {
            var has = module.exports.get(s);

            return has && has.value;
        },
        strip: function(s) {
            return s;
        }
    };

    if (browser) {
        jQuery.fn.desig = function() {
            this.each(function() {
                var $this = $(this),
                    index = module.exports.index($this.html()),
                    sig;

                if (index > 1) {
                    sig = $('<div class="sig collapse"></div>');
                    sig.append($this.contents().slice(index).remove());
                    $this.append(sig);
                    sig.on('click', function(e) {
                        $(e.currentTarget).toggleClass('collapse');
                    });
                }
            });
        };
    }
}).call(this);
