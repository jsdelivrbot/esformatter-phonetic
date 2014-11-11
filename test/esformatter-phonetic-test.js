// Load in dependencies
var assert = require('assert');
var fs = require('fs');
var esformatter = require('esformatter');
var esformatterPhonetic = require('../');

// Register our plugin
esformatter.register(esformatterPhonetic);

// TODO: Allow for updating top level variables via `topLevel: true`

// Define test utilities
var testUtils = {
  format: function (filepath) {
    before(function formatFn () {
      // Format our content
      var input = fs.readFileSync(filepath, 'utf8');
      this.output = esformatter.format(input, {
        phonetic: {
          baseSeed: 1337
        }
      });

      // If we are in a debug environment, write the output to disk
      if (process.env.TEST_DEBUG) {
        try {
          fs.mkdirSync(__dirname + '/actual-files/');
        } catch (err) {
          // Ignore error (prob caused by directory existing)
        }
        var debugFilepath = filepath.replace('test-files/', 'actual-files/');
        fs.writeFileSync(debugFilepath, this.output);
      }
    });
    after(function cleanup () {
      // Cleanup output
      delete this.output;
    });
  }
};

// Start our tests
describe('esformatter-phonetic', function () {
  describe('formatting a JS file with a declared `var`', function () {
    testUtils.format(__dirname + '/test-files/declared-yes.js');

    it('updates the names', function () {
      var expectedOutput = fs.readFileSync(__dirname + '/expected-files/declared-yes.js', 'utf8');
      assert.strictEqual(this.output, expectedOutput);
    });
  });
});
