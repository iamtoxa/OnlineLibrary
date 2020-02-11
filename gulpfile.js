'use strict';

const { task, series } = require('gulp');
const { src, dest } = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

sass.compiler = require('node-sass');


task('watch', function(cb) {
    watch('src/**/*', function() {
        build_all(() => {
            console.log("[ReBuild] "+ Date())
        });
    });

});

function build_js() {
    return src('src/**/*.js')
        .pipe(dest('dist/'));
}

function build_sass() {
    return src('src/**/style_*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(dest('dist'));
}

function build_css() {
    return src('src/**/style_*.css')
        .pipe(dest('dist'));
}

function build_htaccess() {
    return src('src/**/.htaccess')
        .pipe(dest('dist'));
}

function build_all(cb) {
    build_js();
    build_sass();
    build_css();
    build_htaccess();
    cb();
}

exports.build = build_all;
exports.default = series(build_all);