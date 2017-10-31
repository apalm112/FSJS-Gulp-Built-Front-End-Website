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
			baseDir: 'dist'
		}
	});
	gulp.watch(options.src + '/sass/**/*.scss', ['styles']);
	gulp.watch(options.src + '/js/**/*.js', browserSync.reload);
	gulp.watch(options.dist + '/index.html', browserSync.reload);
});

/********************************************************************
TODO: Refactor for:
Don't forget that source maps don't need to be included in your html. They connect to each other through the css so there is no need to include it. If you delete it you will see that it works. Also i noticed that in your html file you are not including the minified version. This defeats the whole idea of concatenating and minifying doesn't it. This isn't asked of in this project(although before it was and they took it out) yet I think it's an important tool to know. So being able to change the css and js includes so that your production html will include the correct files is kinda important. Here is a link you might find useful incase you want to read up and add it to your project. It's actually super simple https://css-tricks.com/gulp-for-beginners/

You can also set up browser sync to work for your html too so if you changed some html it would also reload and build etc and you can add it for js too. Again not asked for in this project so just pointing it out incase you wanted to dig deeper and take better use of gulp for future projects or just general knowledge.

***************************************************************************/
