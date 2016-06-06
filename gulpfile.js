var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var jsFiles = [
    './bower_components/jquery/dist/jquery.js',
    './bower_components/bootstrap/dist/js/bootstrap.min.js',
    './bower_components/angular/angular.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './src/framework/jquery.dcjqaccordion.2.7.js',

    './src/app_js/app.js',
    //'./src/app_js/app.routers.js'
    './src/framework/common-scripts.js'
];
var cssFiles = [
    './src/css/bootstrap.css',
    './src/css/font-awesome.min.css',
    './src/css/bootstrap-reset.css',
    './src/css/style.css',
    './src/css/style-responsive.css'
];
// 在这两个 `min` 任务之外，还有两个不带 `min` 的任务，区别在于不对文件压缩
gulp.task('scripts_min', function(){
    return gulp.src(jsFiles)
        .pipe(concat('all.js')) // 合并 JavaScript ，并设置合并后的文件名
        .pipe(uglify()) // 执行 JavaScript 压缩
        .pipe(gulp.dest('./dist'));
});
gulp.task('stylesheets_min', function(){
    return gulp.src(cssFiles)
        .pipe(concat('all.css')) // 合并 CSS ，并设置合并后的文件名
        .pipe(minifyCss()) // 执行 CSS 压缩
        .pipe(gulp.dest('./dist'));
});

// copy files for build
gulp.task('copyFiles', function () {
    return gulp.src([
        './src/assets/**/*',
        './src/fonts/*',
        './src/tpls/*',
        './src/index.html'], {
        base: './src/'
    })
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
    // 不同的文件个性，需要执行不同的任务来处理
    gulp.watch(['bower_components/*'], ['scripts', 'stylesheets']);
    gulp.watch(['src/css/*']);
    gulp.watch(['app_js/*']);
});

gulp.task('webserver', function(){
    gulp.src('./dist/')
        .pipe(webserver({
            livereload: true,
            fallback: 'index.html'
        }));
});

gulp.task('default',['scripts_min', 'stylesheets_min', 'copyFiles', 'webserver','watch']); //定义默认任务