'use strict';

// Require the needed npm modules.
const gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
	useref = require('gulp-useref'),
	iff = require('gulp-if'),
	csso = require('gulp-csso'),
	concat = require('gulp-concat'),
	del = require('del');

// This task may be redundant due to 'minifyScripts' task.  Delete it?
// gulp.task('concatScripts', function() {
// 	return gulp.src(['js/**/*', 'js/*'])
// 			.pipe(concat('all.js'))
// 			.pipe(gulp.dest('js'));
// });

gulp.task('scripts', ['jsMap'], function() {
	gulp.src(['js/**/**', 'js/*'])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename('all.min.js'))
		.pipe(gulp.dest('dist/scripts/'));
});

gulp.task('jsMap', function() {
	return gulp.src('js/**/*')
	.pipe(maps.init())
	.pipe(concat('all.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', function() {
	return gulp.src('sass/global.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(maps.write('./'))
		.pipe(gulp.dest('dist/styles'));
});














//
