'use strict';
const inquirer = require('inquirer');
const async = require('async');
/**
 * prompt wrapper
 * 
 * @param {Object} question 问题对象 
 * @param {String} key 问题的key
 * @param {Object} data 结果对象
 * @param {Function} done 回调函数
 */
function prompt(question, key, data, done) {
    inquirer.prompt([question]).then(function(answers) {
        data[key] = answers[key];
        done();
    });
}
/**
 * 项目信息交互
 * 
 * @param {Object} questions 问题集合
 * @param {Object} data 储存交互信息
 * @param {Function} done 交互完毕之后的回调函数
 */
module.exports = function ask(questions, data, done) {
    async.eachSeries(Object.keys(questions), function(question, next) {
        prompt(questions[question], question, data, next);
    }, done);
};

