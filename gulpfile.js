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
	imagemin = require('gulp-imagemin'),
	del = require('del');

const options = {
	src: 'src',
	dist: 'dist'
};

gulp.task('scripts', ['jsMap'], function() {
	gulp.src(['js/**/**', 'js/*'])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename('all.min.js'))
		.pipe(gulp.dest(options.dist + '/scripts/'));
	del('dist/scripts/all.js');
});

gulp.task('jsMap', function() {
	return gulp.src('js/**/*')
	.pipe(maps.init())
	.pipe(concat('all.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest(options.dist + '/scripts'));
});

gulp.task('styles', ['cssMaps'], function() {
	return gulp.src('sass/global.scss')
		.pipe(sass())
		.pipe(rename('all.min.css'))
		.pipe(gulp.dest(options.dist + '/styles'));
});

gulp.task('cssMaps', function() {
	return gulp.src('sass/global.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/styles'));
});

gulp.task('images', function() {
	return gulp.src('images/*')
		.pipe(imagemin())
		.pipe(gulp.dest(options.dist + '/content'));
});

gulp.task('clean', function() {
	return del('dist/*');
});

gulp.task('default', ['clean'], function() {
	// gulp.start('build');
});











//
