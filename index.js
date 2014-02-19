var hogan = require('hogan.js'),
    through = require('through')

var filenamePattern = /\.(html|hogan|hg|mustache|ms)$/

var wrap = function (template) {
    return (
        'var t = new (require(\'hogan.js/lib/template\')).Template(' + template + ');' +
        'module.exports = {' +
        '  render: function () { return t.render.apply(t, arguments); },' +
        '  r: function () { return t.r.apply(t, arguments); },' +
        '  ri: function () { return t.ri.apply(t, arguments); }' +
        '};'
    )
}

module.exports = function (file) {
    if (!filenamePattern.test(file)) return through();

    var input = ''
    var write = function (buffer) {
        input += buffer
    }

    var end = function () {
        this.queue(wrap(hogan.compile(input, {asString: true})))
        this.queue(null)
    }

    return through(write, end)
}
