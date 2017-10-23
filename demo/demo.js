'use strict';
const program = require('commander');
const inquirer = require('inquirer');
const down = require('download-git-repo');
const chalk = require('chalk');
const path = require('path');
const home = require('user-home');
const rm = require('rimraf').sync;
const Metalsmith = require('metalsmith');
const ora = require('ora');
const exists = require('fs').existsSync;


/**
 * 初始化commander 设置option
 */
program
    .usage('<command> [options]')
    .option('-d, --demo', 'demo')
    .option('-t, --tian', 'test');

/**
 * --help参数的回调
 */
program.on('--help', function() {
    console.log(' 这是一个测试的Demo');
    console.log('测试chalk');
    console.log(chalk.red('Hello world'));

});

/**
 * 定义help函数 确保命令参数的正确解析
 * 如果没有参数 则返回帮助信息
 */
function help() {
    program.parse(process.argv);
    if(program.args.length < 1) {
        return program.help();
    }
}
help();

/**
 * 
 * 参数赋值
 * 
 */
const template = program.args[0] || 'react-scaffold';
const des = program.args[1] || '.';
const cachePath = path.join(home, '.choicetem');   //本地的缓存目录

/**
 * 执行操作
 */
function run() {
    if(!template) {
        return console.log(chalk.red('please input the template name!'));
    }
    const spinner = ora('downloading template').start();
    downTemplate(template, function(err) {
        if(err) {
            spinner.fail(err.message);
            return console.log(chalk.red(`download ${template} failed please check the name`));
        }
        spinner.succeed('template download succeed!');
        console.log(chalk.gray(`template cache is at ${cachePath}`));
        generate(path.resolve(des));
    });
}
run();

/**
 * 下载模板
 * @param {String} name 模板名称
 * @param {Function} cb 下载完成之后的回调函数
 */
function downTemplate(name, cb) {
    if(exists(cachePath)) {
        rm(cachePath);   //如果对应模板的缓存存在则删除该缓存
    }
    down(`github:zhoushaotian/${name}`, cachePath, {
        clone: false
    }, cb);
}


/**
 * 生成模板到对应目录
 * 
 * @param {String} des 目标路径
 */
function generate(des) {
    inquirer.prompt([{
        type: 'input',
        name: 'projectName',
        message: 'please input a project name:'
    }]).then((answers) => {
        //拿到项目名
        let projectName = '';
        if(!answers.projectName) {
            projectName = 'new-project';
        }
        projectName = answers.projectName;
        console.log(chalk.gray(`${projectName} start output files!`));
        //到对应的缓存目录取文件
        let metalsmith = Metalsmith(cachePath);
        metalsmith.clean(false)
            .source('.')
            .destination(des)
            .build(function(err) {
                if(err) {
                    console.log(chalk.red(err.message));
                    return console.log(chalk.red('build scaffold failed'));
                }
                console.log(chalk.green(`build scaffold success at ${des}`));
                console.log(chalk.gray('please run npm install'));
            });
    });
}