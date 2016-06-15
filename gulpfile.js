var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var util = require('gulp-util');
var replace = require('gulp-replace');
var jsVendorFiles = [
    './bower_components/angular/angular.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/angular-ui-router/release/angular-ui-router.js',
    './bower_components/angular-animate/angular-animate.js',
    './src/framework/ui-bootstrap-tpls-1.3.1.js',
    './bower_components/moment/min/moment.min.js'
];
var cssFiles = [
    './src/css/bootstrap.css',
    './src/css/font-awesome.min.css',
    './src/css/bootstrap-reset.css',
    './src/css/style.css',
    './src/css/style-responsive.css'
];
var defaultApi = 'http://localhost:8000/';
/*
 * Returns the api specified at command line as --api=http://52.74.41.47:8089/
 * If no --api attribute has been specified returns the defaultApi value
 * */
function getAPIVersion() {
    return util.env.api ? util.env.api : defaultApi;
}

/*
 * Builds the ServicePortal.ASAAPI.js and version.json files to target/build/ folder
 * */
gulp.task('build-api', function () {
    var api = getAPIVersion();
    util.log('Updating ServicePortal.ASAAPI.js:_apiUrl to: "' + api + '"');
    return gulp.src(['./src/app_js/api/ServicePortal.ASAAPI.js'])
        .pipe(replace('BUILD_API_PLACEHOLDER', api))
        .pipe(gulp.dest('./dist/js'));
});


gulp.task('scripts_min_vendor', function(){
    return gulp.src(jsVendorFiles)
        .pipe(concat('all.vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('scripts_min', function(){
    return gulp.src([
        './dist/js/ServicePortal.ASAAPI.js',
        './src/app_js/tech/NGeTP.appSDK.mod.js',
        './src/app_js/app.js',
        './src/app_js/controllers.js',
        './src/app_js/directives.js',
        './src/app_js/filters.js',
        './src/app_js/services.js'
    ])
        .pipe(concat('all.js'))
        //.pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

gulp.task('stylesheets_min', function(){
    return gulp.src(cssFiles)
        .pipe(concat('all.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist'));
});

// copy files for build
gulp.task('copyFiles', function () {
    return gulp.src([
        './src/assets/**/*',
        './src/fonts/*',
        './src/tpls/**/*',
        './src/index.html'], {
        base: './src/'
    })
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function(){
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

gulp.task('default',['build-api','scripts_min','scripts_min_vendor', 'stylesheets_min', 'copyFiles', 'webserver','watch']);