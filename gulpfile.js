'use strict';
// Require the needed npm modules.
const gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	maps = require('gulp-sourcemaps'),
	csso = require('gulp-csso'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	del = require('del'),
	browserSync = require('browser-sync').create(),
	runSequence = require('run-sequence'),
	pump = require('pump');  // pump is a wrapper for .pipe() that gives moar readable error messages.  https://github.com/gulpjs/gulp/blob/master/docs/why-use-pump/README.md

// Variables w/ path to source & dist folders.
const options = {
	src: 'src',
	dist: 'dist'
};

/* Gulp Tasks      *********************************************************/
gulp.task('jsMinify', (callback) => {
	// Concats, creates source maps & minifies the .js files.
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
gulp.task('scripts', ['jsMinify'], (callback) => {
	// Renames & copies the all.min.js file to the dist/scripts folder.
	pump([
		gulp.src(options.src + '/js/global.js'),
		rename('all.min.js'),
		gulp.dest(options.dist + '/scripts/')
	],
	callback
	);
});

gulp.task('cssMinify', (callback) => {
	// Concats SaSS files, creates source map.
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
	// Minifies the CSS files for production folder.
	pump([
		gulp.src(options.src + '/css/global.css'),
		csso(),
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
	// Deletes all of the files and folders in the dist folder created from tasks & other files created during build process.
	return del(['dist/*', 'src/css/', 'src/js/global.js.map', 'src/js/global.js']);
});

gulp.task('build', (callback) => {
	//  Runs tasks in sequence to create files for the production folder.
	runSequence('clean', ['scripts', 'styles', 'images', 'buildOut'],
		callback
	);
});

gulp.task('buildOut', () => {
	//  Provides the static development files for the production folder.
	gulp.src(['src/icons/**/*', 'src/index.html'], { base: './src/' })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', (callback) => {
	runSequence('build', ['server'],
		callback
	);
});

gulp.task('server', () => {
	// Start local webserver displaying the project files, refreshes on change to any .scss file.
	browserSync.init({
		server: {
			baseDir: 'src'
		}
	});
	gulp.watch(options.src + '/sass/**/*.scss', ['styles']);
});
