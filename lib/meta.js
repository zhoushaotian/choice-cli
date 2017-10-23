'use strict';
const read = require('read-metadata');
const exists = require('fs').existsSync;
const path = require('path');

/**
 * 读取模板目录下的配置信息
 * 
 * @param {any} dir 文件目录 
 * @param {any} opts 配置对象 
 */
module.exports = function readMeta(dir) {
    if(!exists(dir)) {
        return {};
    }
    let opts = read.sync(path.join(dir, 'meta.json'));
    return opts;
};
