'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-js-module:app', function () {
  this.timeout(5000);
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withArguments(['mocha test'])
      .withPrompts({
        name: 'test',
        description: 'just a test',
        useLess: true,
        useBower: true,
        author: 'eeve',
        email: 'eeveme@gmail.com',
        license: 'MIT',
        autoInstall: true
      })
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'README.md',
      'bower.json',
      'config.js',
      'index.js',
      'package.json',
      'webpack.config.js'
    ]);
  });
});
