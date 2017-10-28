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
	pump = require('pump'),  // pump is a wrapper for .pipe that gives moar readable error messages.
	QPromise = require('q');  //	https://www.npmjs.com/package/q

// Variables w/ path to source & dist folders.
const options = {
	src: 'src',
	dist: 'dist'
};

/* Gulp Tasks      *********************************************************/
gulp.task('scripts', (callback) => {
	pump([
		gulp.src([options.src + '/js/circle/*.js', options.src + '/js/global.js']),
		maps.init(),
		concat('all.min.js'),
		uglify(),
		maps.write('./'),
		gulp.dest(options.dist + '/scripts/'),
	],
	callback
	);
});

gulp.task('cssMinify', (callback) => {
	pump([
		gulp.src(options.src + '/sass/global.scss'),
		rename('all.min.css'),
		maps.init({ largeFile: true }),
		sass(),
		maps.write('./'),
		gulp.dest(options.dist + '/styles/'),
		gulp.dest(options.src + '/css/')
	],
	callback
	);
});

gulp.task('styles', ['cssMinify'], (callback) => {
	pump([
		gulp.src(options.dist + '/styles/global.css'),
		rename('all.min.css'),
		csso(),  // Minifies
		gulp.dest(options.dist + '/styles/'),
		gulp.dest(options.src + '/sass/'),
		browserSync.reload({
			stream: true
		})
	],
	callback
	);
});

gulp.task('images', (callback) => {
	// Uses gulp-imagemin module to optimize the images for production.
	pump([
		gulp.src(options.src + '/images/*'),
		imagemin(),
		gulp.dest(options.dist + '/content')
	],
	callback
	);
});

gulp.task('clean', () => {
	// Deletes all of the files and folders in the dist folder created from tasks.
	return del(['dist/*']);
});
gulp.task('cleanUp', () => {
	// Remove unwanted file from the production folder.
	del(options.dist + '/styles/global.css');
});

// Takes the index.html file & runs it thru useref(). Then any JS scripts & CSS links in the index.html get concated, minified for production.
gulp.task('html', (callback)=> {
	// TODO: BUG! USE A MODULE, (QPROMISE, RUN-SEQUENCE) TO CHANGE ORDER OF TASKS TO SYNCHRONOUS.
	pump([
		gulp.src(options.src + '/index.html'),
		iff('*.js', uglify()),
		iff('*.css', csso()),
		useref(),		//  Clearly, this is where the useref() belongs.
		gulp.dest(options.dist)
	],
	callback
	);
});

//  Setups the project development files into a folder for production.
gulp.task('build', (callback) => {
	runSequence('clean',
							['scripts', 'styles', 'images', 'buildOut'],
							callback
	)
});

gulp.task('buildOut', () => {
	return gulp.src(['src/icons/**/*',
									'src/index.html'],
									{ base: './src/' })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', (callback) => {
	runSequence('build',
							['watcher', 'html'],
							callback
	)
});

gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	});
});

gulp.task('watcher', (callback) => {
	gulp.watch(options.src + '/sass/**/*.scss', ['styles']);
	runSequence('server', callback);
	//	'cleanUp',
});
