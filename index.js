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

function wrap (template, input, enableLambdas) {
    var prefix;
    if (enableLambdas) {
        prefix = (
            'var H = require(\'hogan.js\'); var T = H.Template;' +
            'var t = new T(' + template + ',' + JSON.stringify(input) + ',H,{});'
        );
    } else {
        prefix = (
            'var t = new (require(\'hogan.js/lib/template\')).Template(' + template + ');'
        );
    }

    return (
        prefix +
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

    var input = '';
    var write = function (buffer) {
        input += buffer;
    }

    var end = function () {
        if (opts.minify) {
            var minifierOpts = extend({}, minifierDefaults, opts.minifierOpts);
            input = minify(input, minifierOpts);
        }
        this.queue(wrap(hogan.compile(input, { asString: true }), input, opts.enableLambdas));
        this.queue(null);
    }

    return through(write, end);
}
