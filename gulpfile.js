var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var jsFiles = [
    './bower_components/jquery/dist/jquery.js',
    './bower_components/bootstrap/dist/js/bootstrap.min.js',
    './bower_components/angular/angular.js'
];
var cssFiles = [
    './bower_components/bootstrap/dist/css/bootstrap.min.css',
    './bower_components/font-awesome/css/font-awesome.min.css',
    './src/css/signin.css'
];
// �������� `min` ����֮�⣬������������ `min` �������������ڲ����ļ�ѹ��
gulp.task('scripts_min', function(){
    return gulp.src(jsFiles)
        .pipe(concat('all.js')) // �ϲ� JavaScript �������úϲ�����ļ���
        .pipe(uglify()) // ִ�� JavaScript ѹ��
        .pipe(gulp.dest('./dist/js'));
});
gulp.task('stylesheets_min', function(){
    return gulp.src(cssFiles)
        .pipe(concat('all.css')) // �ϲ� CSS �������úϲ�����ļ���
        .pipe(minifyCss()) // ִ�� CSS ѹ��
        .pipe(gulp.dest('./dist/css'));
});

// copy files for build
gulp.task('copyFiles', function () {
    return gulp.src([
        './src/assets/**/*',
        './src/fonts/*',
        './src/index.html'], {
        base: './src/'
    })
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
    // ��ͬ���ļ����ԣ���Ҫִ�в�ͬ������������
    gulp.watch(['bower_components/*'], ['scripts', 'stylesheets']);
    gulp.watch(['src/css/*']);
    gulp.watch(['app/controllers/*', 'app/modules/*', 'app/services/*'], ['scripts']);
});

gulp.task('webserver', function(){
    gulp.src('./dist/')
        .pipe(webserver({
            livereload: true,
            fallback: 'index.html'
        }));
});

gulp.task('default',['scripts_min', 'stylesheets_min', 'copyFiles', 'webserver','watch']); //����Ĭ������