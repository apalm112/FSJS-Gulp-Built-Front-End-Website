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

// Variables w/ path to source & dist folder.
const options = {
	src: 'src',
	dist: 'dist'
};

gulp.task('watch', function() {
	gulp.watch([options.src + '/sass/**/*.scss', '/sass/**/*.sass'], ['styles']);
});

gulp.task('scripts', ['jsMap'], function() {
	return gulp.src([options.src + '/js/**/**', '/js/*'])
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename('all.min.js'))
		.pipe(gulp.dest(options.dist + '/scripts/'));
	//del('dist/scripts/all.js');
});

gulp.task('jsMap', function() {
	return gulp.src('js/**/*')
	.pipe(maps.init())
	.pipe(concat('all.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest(options.dist + '/scripts'));
});

gulp.task('styles', function() {
	return gulp.src(options.src + '/sass/global.scss')
		.pipe(maps.init())
		.pipe(sass())
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/styles'));
});

gulp.task('images', function() {
	return gulp.src(options.src + '/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest(options.dist + '/content'));
});

gulp.task('clean', function() {
	return del('dist/*');
});

gulp.task('html', ['styles'], function() {
	gulp.src(options.src + '/index.html')
		.pipe(useref())
		.pipe(iff('*.js', uglify()))
		.pipe(iff('*.css', csso()))
		.pipe(gulp.dest(options.dist));
});

gulp.task('build', ['html'], function() {
	return gulp.src(['css/global.css', 'js/global.js', 'index.html', 'content/*', 'icons/**/*'], { base: './' })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function() {
	// gulp.start('build');
});











//
