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
	connect = require('gulp-connect'),
	del = require('del');

// Variables w/ path to source & dist folder.
const options = {
	src: 'src',
	dist: 'dist'
};

gulp.task('scripts', function() {
	return gulp.src(['js/**/*', '/js/*'])
		.pipe(maps.init())
		.pipe(concat('all.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/scripts/'));
});

gulp.task('jsMap', ['scripts'], function() {
	del('dist/scripts/all.js');
	return gulp.src(options.dist + '/scripts/all.js')
	.pipe(uglify())
	.pipe(rename('all.min.js'))
	.pipe(gulp.dest(options.dist + '/scripts/'));
});

gulp.task('styles', function() {
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

gulp.task('html', ['styles'], function() {
	return gulp.src('index.html')
			.pipe(useref())
			.pipe(iff('*.js', uglify()))
			.pipe(iff('*.css', csso()))
			.pipe(gulp.dest(options.dist));
});

gulp.task('watch', function() {
	gulp.watch('sass/**/*.scss', ['styles']);
});

gulp.task('build', ['jsMap', 'styles', 'images'], function() {
	// gulp.start(['jsMap','styles', 'images']);
	return gulp.src(['index.html', 'icons/**/*'], { base: './' })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function() {
	connect.server({ port: 7000 });
});










//
