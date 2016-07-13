'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({

  // 初始化准备工作
  initializing: function () {
    if (this.args.indexOf('mocha test') !== -1) {
      this.debug = true;
    }
  },

  // 接受用户输入
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the riveting ' + chalk.red('generator-js-module') + ' generator!'
    ));

    var prompts = [{
      name: 'name',
      message: 'name for module:',
      default: this.appname.replace(/\s/g, '-')
    }, {
      name: 'description',
      message: 'description:',
      default: ''
    }, {
      type: 'confirm',
      name: 'useLess',
      message: 'Would you like to use LESS?',
      default: true
    }, {
      type: 'confirm',
      name: 'useBower',
      message: 'Would you like to use useBower?',
      default: true
    }, {
      name: 'author',
      message: 'author:',
      default: this.user.git.name()
    }, {
      name: 'email',
      message: 'email:',
      default: this.user.git.email()
    }, {
      name: 'license',
      message: 'license:',
      default: 'MIT'
    }, {
      type: 'confirm',
      name: 'autoInstall',
      message: 'auto install dependencies:',
      default: true
    }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  // 生成目录结构阶段
  writing: function () {
    var self = this;
    var copy = function (from, to) {
      self.fs.copy(self.templatePath(from), self.destinationPath(to));
    };
    copy('_gitignore', '.gitignore');
    copy('_editorconfig', '.editorconfig');
    copy('_index.js', 'index.js');
    copy('_config_js', 'config.js');

    this.template('_README.md', 'README.md');
    this.template('_package.json', 'package.json');
    this.template('_webpack.config_js', 'webpack.config.js');

    if (self.props.useBower) {
      copy('_bowerrc', '.bowerrc');
      this.template('_bower.json', 'bower.json');
    }
  },

  // 安装项目依赖
  install: function () {
    if (this.props.autoInstall) {
      if (this.props.useBower) {
        this.installDependencies();
      } else {
        this.npmInstall();
      }
    }
  },

  // 生成器退出前运行npm start，开启构建任务
  end: function () {
    if (!this.debug && this.props.autoInstall) {
      var done = this.async();
      this.spawnCommand('npm', ['start'])
        .on('exit', function (code) {
          if (code) {
            done(new Error('code:' + code));
          } else {
            done();
          }
        })
        .on('error', done);
    }
  }
});
