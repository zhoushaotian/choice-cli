'use strict';
/**
 * 
 * 
 * @param {any} name 
 */
function searchFile(filterArr, file) {
    for(let filter of filterArr) {
        if(file.includes(filter)) {
            return true;
        }
    }
    return false;
}
/**
 * 过滤文件
 * 
 * @param {any} files 
 * @param {any} filters  
 * @param {any} done 
 */
module.exports = function(files, filters, done) {
    let fileNames = Object.keys(files);
    console.log(files);
    for (let name of fileNames) {
        if(searchFile(filters, name)) {
            delete files[name];
        }
    } 
    done();
};