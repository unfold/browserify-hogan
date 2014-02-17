var exec = require('child_process').exec,
    path = require('path'),
    assert = require('assert');

var browserifyHogan = path.resolve(__dirname, '../index'),
    entryPoint = path.join(__dirname, 'fixtures', 'main.js'),
    browserifyBin = path.resolve(__dirname, '../node_modules/.bin/browserify'),
    command = browserifyBin + ' -t "' + browserifyHogan + '" "' + entryPoint + '" | node';

exec(command, function (err, stdout, stderr) {
    assert(!err && !stderr, 'No errors in Browserify or when executing bundle');
    assert.strictEqual(stdout.trim(), 'Hello Dave!', 'Template renders correctly');
});
