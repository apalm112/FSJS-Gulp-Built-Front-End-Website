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
// TODO: THIS BRANCH IS FOR CHECKING ALL THE TASKS ARE WORKING.
gulp.task('scripts', (callback) => {
	pump([
		gulp.src([options.src + '/js/circle/*.js']),
		maps.init(),
		concat('all.min.js'),
		uglify(),
		maps.write('./'),
		gulp.dest(options.src + '/scripts/'),
		// rename('all.min.js'),
		gulp.dest(options.src + '/scripts/')
	],
	callback
	);
});
gulp.task('cssMinify', (callback) => {
	pump([
		gulp.src(options.src + '/sass/global.scss'),
		// rename('all.scss'),
		maps.init({ largeFile: true }),
		sass(),
		maps.write('./'),
		gulp.dest(options.src + '/styles/')
	],
	callback
	);
});
// Needed in order to meet rubric for styles task to compile, concat & minify all SaSS files.
gulp.task('styles', ['cssMinify'], (callback) => {
	pump([
		gulp.src(options.src + '/styles/global.css'),
		csso( '.test {color: #ff0000;}, {debug: 3}'),  // Minifies
		rename('all.min.css'),
		gulp.dest(options.src + '/styles/'),
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
		gulp.dest(options.src + '/content')
	],
	callback
	);
});
gulp.task('clean', ()=> {
	// Deletes all of the files and folders in the dist folder & other files created from tasks.
	return del(['dist/*', 'src/scripts/*', 'src/styles/*']);
});
// Takes the index.html file & runs it thru useref().  Runs the clean, scripts, styles & images tasks as dependencies.  Then any JS scripts & CSS links in the index.html get concated, minified for production.
gulp.task('html', ['scripts', 'styles', 'images'], (callback)=> {
	pump([
		gulp.src(options.src + '/index.html'),

		// TODO: fix this bug.?  Is it even in this task tho?

		useref(),		// useref() here fixs bug of all.min.js, all.min.css ARE minified. BUT the Source Maps Are Still NOT Working!  Clearly, this is where the useref() belongs.

		iff('*.js', uglify()),


		iff('*.css', csso()),
		// .pipe(useref())	// useref() here creates bug of all.min.css NOT minified.
		gulp.dest(options.dist)
	],
	callback
	);
});
//  Runs the clean, scripts, styles, and images tasks. Setups the project development files into a folder for production.
gulp.task('build', ['clean'], () => {
	gulp.start('scripts', 'styles', 'images');
	// Provide static production files below:
	return gulp.src(['src/icons/**/*',
									'src/index.html'],
									{ base: './src/' })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], () => {
	// When the default gulp command is run, it continuously watches for changes to any .scss file in the project.  Runs the build task as a dependency, then serves the project using a local webserver.
	return browserSync.init({
		server: {
			baseDir: 'src'
		}
	});
	// return gulp.start('watchFiles');
});

// This task runs 'styles' as dependency, & then itself is run as a dependency of the 'watch' task.  Then it will minify the global.css file w/ csso(), update the production directory file & update the browser, displaying the changes.
gulp.task('watchFiles', ['styles'], (callback) => {
	pump([
		gulp.watch(options.src + '/sass/**/*.scss', ['styles']),
		gulp.src(options.src + '/index.html'),

			// TODO: Fix bug here too. Same problem as above, source maps NOT working, Ggrrrrr!

		useref(),
		iff('*.js', uglify()),
		iff('*.css', csso()),
		//.pipe(useref())When 'watchFiles' runs, then all.min.css does NOT get minified & is overwritten w/ a copy of global.css.
		gulp.dest(options.dist)
		/*.pipe(browserSync.reload({
			stream: true
		}));*/
	],
	callback
	);
});
