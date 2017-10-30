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
	del = require('del'),
	browserSync = require('browser-sync').create(),
	runSequence = require('run-sequence'),
	pump = require('pump');  // pump is a wrapper for .pipe that gives moar readable error messages.

// Variables w/ path to source & dist folders.
const options = {
	src: 'src',
	dist: 'dist'
};

/* Gulp Tasks      *********************************************************/
gulp.task('jsMinify', (callback) => {
	pump([
		gulp.src(options.src + '/js/circle/*.js'),
		maps.init(),
		concat('global.js'),
		uglify(),
		maps.write('./'),
		gulp.dest(options.src + '/js/')
	],
	callback
	);
});
gulp.task('moveAllJS', ['jsMinify'], (callback) => {
	pump([
		gulp.src(options.src + '/js/global.js'),
		rename('all.min.js'),
		gulp.dest(options.dist + '/scripts/')
	],
	callback
	);
});
gulp.task('scripts', ['moveAllJS'], () => {
	gulp.src(options.src + '/js/all.min.js');
	del(options.src + '/js/all.min.js');
});


gulp.task('cssMinify', (callback) => {
	pump([
		gulp.src(options.src + '/sass/global.scss'),
		maps.init({ largeFile: true }),
		sass(),
		maps.write('./'),
		gulp.dest(options.src + '/css/'),
		browserSync.reload({
			stream: true
		})
	],
	callback
	);
});

gulp.task('styles', ['cssMinify'], (callback) => {
	pump([
		gulp.src(options.src + '/css/global.css'),
		csso(),  // Minifies
		rename('all.min.css'),
		gulp.dest(options.dist + '/styles/'),
	],
	callback
	);
});

gulp.task('images', () => {
	// Uses gulp-imagemin module to optimize the images for production.
	return gulp.src(options.src + '/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest(options.dist + '/content'));
});

gulp.task('clean', () => {
	// Deletes all of the files and folders in the dist folder created from tasks.
	return del(['dist/*', 'src/css/', 'src/js/global.js.map', 'src/js/global.js']);
});

//  Setups the project development files into a folder for production.
gulp.task('build', (callback) => {
	runSequence('clean',
							['scripts', 'styles', 'images', 'buildOut'],
							callback
	);
});

gulp.task('buildOut', () => {
	// Provides the static development files for the production folder.
	return gulp.src(['src/icons/**/*',
									'src/index.html'],
									{ base: './src/' })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', (callback) => {
	runSequence('build',
							['server'],
							callback
	);
});

gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: 'src/'
		}
	});
	gulp.watch(options.src + '/sass/**/*.scss', ['styles']);
});
