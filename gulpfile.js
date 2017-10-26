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
	browserSync = require('browser-sync');
// Variables w/ path to source & dist folders.
const options = {
	src: 'src',
	dist: 'dist'
};

/* Gulp Tasks      *********************************************************/
gulp.task('scripts', ['jsMinify'], ()=> {
	// Runs jsMinify task first, then creates source map, concats the two JS files.
	return gulp.src([options.src + '/js/circle/autogrow.js', options.src + '/js/global.js'])
		.pipe(maps.init())
		.pipe(concat('all.min.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/scripts/'));
});
gulp.task('jsMinify', ()=> {
	//	Minifies the one JS file that needs it, since js/autogrow.js is already minified.
	return gulp.src(options.src + '/js/circle/circle.js')
	.pipe(uglify())
	.pipe(rename('global.js'))
	.pipe(gulp.dest(options.src + '/js/'));
});

gulp.task('cssMinify', ()=> {
	return gulp.src(options.src + '/sass/global.scss')
		.pipe(maps.init({ largeFile: true, loadMaps: true }))
		.pipe(sass())
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/styles/'))
		.pipe(gulp.dest(options.src + '/css/'))
});

gulp.task('styles', ['cssMinify'], ()=> {
	// Needed in order to meet rubric for styles task to compile, concat & minify all SaSS files.
	return gulp.src(options.dist + '/styles/global.css')
		.pipe(csso())
		.pipe(rename('all.min.css'))
		.pipe(gulp.dest(options.dist + '/styles/'));
});

gulp.task('images', ()=> {
	// Uses gulp-imagemin module to optimize the images for production.
	return gulp.src(options.src + '/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest(options.dist + '/content'));
});

gulp.task('clean', ()=> {
	// Deletes all of the files and folders in the dist folder & other files created from tasks.
	return del(['dist/*', 'src/css/', 'src/js/global.js']);
});

gulp.task('html', ['scripts', 'styles', 'images'], ()=> {
	// Runs the clean, scripts, styles & images tasks as dependencies.  Then any JS scripts & CSS links in the index.html get concated, minified for production.
	return gulp.src(options.src + '/index.html')
		.pipe(iff('*.js', uglify()))
		.pipe(iff('*.css', csso()))
		.pipe(useref())
		.pipe(gulp.dest(options.dist));
});

gulp.task('build', ['clean'], ()=> {
	//  Runs the clean, scripts, styles, and images tasks. Setups the project development files into a folder for production.
	gulp.start('html');
	// Provide production files below:
	return gulp.src(['src/index.html',
									'src/icons/**'],
									{ base: './src/' })
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], ()=> {
	// When the default gulp command is run, it continuously watches for changes to any .scss file in the project.  Runs the build task as a dependency, then serves the project using a local webserver.
	browserSync.init({
		server: {
			baseDir: 'dist'
		}
	});
	gulp.watch(options.src + '/sass/**/*.scss', ['watchMinify']);
});

gulp.task('watchMinify', ['styles'], ()=> {
	// This task runs 'styles' as dependency, & then itself is run as a dependency of the 'watch' task.  Then it will minify the global.css file w/ csso(), update the production directory file & update the browser, displaying the changes.
	return gulp.src(options.src + '/index.html')
		.pipe(iff('*.js', uglify()))
		.pipe(iff('*.css', csso()))
		.pipe(useref())
		.pipe(gulp.dest(options.dist))
		.pipe(browserSync.reload({
			stream: true
		}));
});
