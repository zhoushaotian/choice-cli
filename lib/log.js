'use strict';
const chalk = require('chalk');
const ora = require('ora');

module.exports.succeedLog = function(msg) {
    return console.log(chalk.green(msg));
};

module.exports.errorLog = function(msg) {
    return console.log(chalk.red(msg));
};

module.exports.infoLog = function(msg) {
    return console.log(chalk.gray(msg));
};

module.exports.spinner = function(msg) {
    return ora(msg);
};
