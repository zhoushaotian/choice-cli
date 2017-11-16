'use strict';
const Metalsmith = require('metalsmith');
const render = require('consolidate').handlebars.render;
const async = require('async');

const filter = require('./filter');
const readMeta = require('./meta');
const ask = require('./ask');

function filterMid(files, metalsmith, done) {
    let metadata = metalsmith.metadata();
    let mode = metadata.mode;
    // 写入模式
    metadata.react = mode === 'react';
    metadata.vue = mode === 'vue';
    console.log('#################');
    console.log(metadata);
    console.log('#############');
    filter(files, metadata.filters[mode], done);

}
/**
 * metalsmith plugin to ask question
 * 
 * @param {Object} prompts 问题集合 
 */
function askQuestions(prompts) {
    return (files, metalsmith, done) => {
        ask(prompts, metalsmith.metadata(), done);
    };
}
/**
 * metalsmith plugin to render file
 * 
 * @param {Object} files 
 * @param {Object} metalsmith 
 * @param {Function} done 
 */
function renderTemplate(files, metalsmith, done) {
    // 过滤meta.json
    if (files['meta.json']) {
        delete files['meta.json'];
    }
    const keys = Object.keys(files);
    const metadata = metalsmith.metadata();
    async.each(keys, function (file, next) {
        const fileStr = files[file].contents.toString();
        if (!/{{[^}]+}}/g.test(fileStr)) { // 如果文件中不包含{{}}则直接跳过此文件
            return next();
        }
        render(fileStr, metadata, function (err, res) {
            if (err) {
                err.message = `${file} ${err.message}`;
                return next(err);
            }
            files[file].contents = new Buffer(res);
            next();
        });
    }, done);
}
/**
 * 构建模板文件输出到目标目录
 * 
 * @param {String} des 目标目录 
 * @param {String} cachePath 缓存目录
 * @param {Function} done 构建成功之后的回调 
 */
module.exports.buildTemplate = function (des, cachePath, done) {
    const metalsmith = Metalsmith(cachePath);
    let opts = Object.assign(metalsmith.metadata(), readMeta(cachePath));
    metalsmith.clean(false)
        .use(askQuestions(opts.questions))
        .use(filterMid)
        .use(renderTemplate)
        .source('.')
        .destination(des)
        .build(done);
};