var hogan   = require('hogan.js'),
    through = require('through'),
    minify  = require('html-minifier').minify;

var filenamePattern = /\.(html|hogan|hg|mustache|ms)$/;
var minifierDefaults = {
    removeComments               : true,
    collapseWhitespace           : true,
    removeAttributeQuotes        : true,
    removeCommentsFromCDATA      : false,
    removeCDATASectionsFromCDATA : false,
    collapseBooleanAttributes    : false,
    removeRedundantAttributes    : false,
    useShortDoctype              : false,
    removeOptionalTags           : false,
    removeEmptyElements          : false
};

function wrap (template) {
    return (
        'var t = new (require(\'hogan.js/lib/template\')).Template(' + template + ');' +
        'module.exports = {' +
        '  render: function () { return t.render.apply(t, arguments); },' +
        '  r: function () { return t.r.apply(t, arguments); },' +
        '  ri: function () { return t.ri.apply(t, arguments); }' +
        '};'
    );
}

function extend (obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        if (!source) { return; }

        for (var key in source) {
            obj[key] = source[key];
        }
    });

    return obj;
}

module.exports = function (file, opts) {
    if (!filenamePattern.test(file)) return through();

    opts = opts || {};
    var minifierOpts = extend({}, minifierDefaults, opts.minifierOpts);

    var input = '';
    var write = function (buffer) {
        input += buffer;
    }

    var end = function () {
        this.queue(wrap(hogan.compile(minify(input, minifierOpts), { asString: true })));
        this.queue(null);
    }

    return through(write, end);
}
