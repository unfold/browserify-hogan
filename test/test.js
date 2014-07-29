var exec = require('child_process').exec,
    path = require('path'),
    assert = require('assert');

var browserifyHogan = path.resolve(__dirname, '../index');
    browserifyBin = path.resolve(__dirname, '../node_modules/.bin/browserify');

// Test: minify
(function minify() {
  var entryPoint = path.join(__dirname, 'fixtures', 'minify.js'),
      command = browserifyBin + ' -t [ "' + browserifyHogan + '" --minify ] "' + entryPoint + '" | node';

  console.log('Testing minify:', command);

  exec(command, function (err, stdout, stderr) {
      assert(!err && !stderr, 'No errors in Browserify or when executing bundle');
      assert.strictEqual(stdout.trim(), 'Hello Dave! Here is <span class=bar>some text from a partial, Dave</span>.');

      console.log('minify: ✓');
  });
})();

// Test: lambdas
(function lambdas() {
  var entryPoint = path.join(__dirname, 'fixtures', 'lambdas.js'),
      command = browserifyBin + ' -t [ "' + browserifyHogan + '" --enableLambdas ] "' + entryPoint + '" | node';

  console.log('Testing lambdas:', command);

  exec(command, function (err, stdout, stderr) {
      assert(!err && !stderr, 'No errors in Browserify or when executing bundle');
      assert.strictEqual(stdout.trim(), '<abbr title="Jess" />');

      console.log('lambdas: ✓');
  });
})();
