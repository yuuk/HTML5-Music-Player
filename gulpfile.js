/*
 * @Author: yuuk
 * @Date:   2017-03-18 11:30:56
 * @email: yuuk520@gmail.com
 */

'use strict';
const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

const dir = {
    dist: {
        css: 'dist/css/',
        js: 'dist/js/'
    },
    src: {
        css: 'src/css/*.less',
        js: 'src/js/*.js'
    }
}

console.log(plugins)

// 创建服务器
gulp.task('connect', function() {
    plugins.connect.server({
        root: __dirname,
        livereload: true
    });
});

//JS处理任务
gulp.task('watchJs', function() {
    gulp.watch(dir.src.js, function(event) {
        gulp.src(event.path)
            // 校验
            .pipe(plugins.jshint({
            	'globals': {
            	    '$': true
            	},
            	'browser': true,
            	'devel': true
            }))
            .pipe(plugins.jshint.reporter())
            //rename文件名
            .pipe(plugins.rename({ suffix: '.min' }))
            //压缩
            .pipe(plugins.uglify())
            //处理报错
            .on('error', function(err) {
                console.log('----------JS报错----------\n错误信息：' + err.message + '\n' + '错误行数：' + err.lineNumber);
                this.end();
                return false;
            })
            //输出到路径
            .pipe(gulp.dest(dir.dist.js))
            .pipe(plugins.connect.reload());
        console.log(`JS处理输入完毕！${new Date().getTime()}`);
    });
});

//JS处理任务
gulp.task('watchLess', function() {
    gulp.watch(dir.src.css, function(event) {
        gulp.src(event.path)
            // 编译less
            .pipe(plugins.less())
            // 前缀补全
            .pipe(plugins.autoprefixer({
                browsers: ['last 10 versions'],
                cascade: false
            }))
            .pipe(plugins.cleanCss())
            //rename文件名
            .pipe(plugins.rename({ suffix: '.min' }))
            //处理报错
            .on('error', function(err) {
                console.log('----------less报错----------\n错误信息：' + err.message + '\n' + '错误行数：' + err.lineNumber);
                this.end();
                return false;
            })
            //输出到路径
            .pipe(gulp.dest(dir.dist.css))
            .pipe(plugins.connect.reload());
        console.log(`CSS处理输入完毕！${new Date().getTime()}`);
    });
});

gulp.task('default', ['connect', 'watchJs', 'watchLess']);
