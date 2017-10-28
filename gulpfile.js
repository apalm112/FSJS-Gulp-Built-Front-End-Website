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
	browserSync = require('browser-sync'),
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
		gulp.src([options.src + '/js/circle/*.js']),
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
		maps.init({ largeFile: true }),
		sass(),
		maps.write('./'),
		gulp.dest(options.dist + '/styles/')
	],
	callback
	);
});

gulp.task('styles', ['cssMinify'], (callback) => {
	pump([
		gulp.src(options.dist + '/styles/global.css'),
		csso(),  // Minifies
		rename('all.min.css'),
		gulp.dest(options.dist + '/styles/'),
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

gulp.task('clean', ()=> {
	// Deletes all of the files and folders in the dist folder created from tasks.
	return del(['dist/*']);
});

// Takes the index.html file & runs it thru useref(). Then any JS scripts & CSS links in the index.html get concated, minified for production.
/*gulp.task('html', ['scripts', 'styles', 'images'], (callback)=> {
	pump([
		gulp.src(options.src + '/index.html'),
		// TODO: fix this bug.
		useref(),		// useref() here fixs bug of all.min.js, all.min.css ARE minified. BUT the Source Maps Are Still NOT Working!  Clearly, this is where the useref() belongs.
		iff('*.js', uglify()),
		iff('*.css', csso()),
		// .pipe(useref())	// useref() here creates bug of all.min.css NOT minified.
		gulp.dest(options.dist)
	],
	callback
	);
});*/

//  Setups the project development files into a folder for production.
gulp.task('build', ['clean'], () => {
	gulp.start('scripts', 'styles', 'images');
	// Provide static production files below:
	return gulp.src(['src/icons/**/*',
									'src/index.html'],
									{ base: './src/' })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], () => {
	// gulp.start('watchFiles');
	gulp.start('watcher');
	/*return	gulp.src(options.dist + '/index.html')
		.pipe(iff('*.css', csso()))
		.pipe(useref())
		.pipe(gulp.dest(options.dist + '/'));*/
});

gulp.task('server', () => {
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	});
});

gulp.task('watcher', ['server'], () => {
	gulp.watch(options.src + '/sass/**/*.scss', ['styles']);
});

gulp.task('watchFiles', () => {
	gulp.src(options.dist + '/index.html')
	// TODO: Fix bug here too. Same problem as above, source maps NOT working.
	// iff('*.js', uglify()),
		.pipe(iff('*.css', csso()))
		.pipe(useref())
	//.pipe(useref())When 'watchFiles' runs, then all.min.css does NOT get minified & is overwritten w/ a copy of global.css.
		.pipe(gulp.dest(options.dist + '/styles/'));
	browserSync.reload({
		stream: true
	});
});
