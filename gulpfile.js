var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var inject = require('gulp-inject');

var buildDir = 'dist';

var css = [
    'assets/css/*.css'
];

var scripts = [
    'assets/js/library.js',
    'assets/js/library-*.js',
    'app/*.js'
];

var resources = [
    'assets/img/*',
    'assets/templates/*'
];

gulp.task('clean', function () {
    return del(buildDir);
});

gulp.task('css', function () {
    return gulp.src(css)
        .pipe(concat('style.css'))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(buildDir + '/assets/css'));
});

gulp.task('scripts', function () {
    return gulp.src(scripts)
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildDir + '/app'));
});

gulp.task('resources', function () {
    return gulp.src(resources, { base: "." })
        .pipe(gulp.dest(buildDir));
});

gulp.task('dev', function () {
    var src = gulp.src(scripts.concat(css), {read: false});
    return gulp.src('index_base.html')
        .pipe(rename('index.html'))
        .pipe(inject(src, {addRootSlash: false}))
        .pipe(gulp.dest('.'));
});

gulp.task('prod', ['css', 'scripts', 'resources'], function () {
    var src = gulp.src(['app/app.js', 'assets/css/style.css'], {read: false});
    return gulp.src('index_base.html')
        .pipe(rename('index.html'))
        .pipe(inject(src, {addRootSlash: false}))
        .pipe(gulp.dest(buildDir));
});