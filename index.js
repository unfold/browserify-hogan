var hogan = require('hogan.js'),
    through = require('through')

var filenamePattern = /\.(html|hogan|hg)$/

var wrap = function(template) {
    return 'module.exports=(function() {var t = ' + template + '; return function(l) { return t(l) }}())'
}

module.exports = function(file) {
    if (!filenamePattern.test(file)) return through()

    var input = ''
    var write = function(buffer) {
        input += buffer
    }

    var end = function() {
        this.queue(wrap(hogan.compile(input, {asString: true})))
        this.queue(null)
    }

    return through(write, end)
}
