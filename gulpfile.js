'use strict';
// TODO: Check that source maps are working correctly in the browser.
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
	del = require('del'),
	browserSync = require('browser-sync');

// Variables w/ path to source & dist folder.
const options = {
	src: 'src',
	dist: 'dist'
};

/**********************************************************/
gulp.task('scripts', ['jsMinify'], ()=> {
	// DONE Works!  scripts & jsMinify tasks successfuly minify & concat the two js files into all.min.js.
	return gulp.src([options.src + '/js/circle/autogrow.js', options.src + '/js/circle.min.js'])
		.pipe(maps.init())
		.pipe(concat('all.min.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/scripts/'));
});
gulp.task('jsMinify', ()=> {
	//	Minifies the one JS file that needs it.
	return gulp.src(options.src + '/js/circle/circle.js')
	.pipe(uglify())
	.pipe(rename('circle.min.js'))
	.pipe(gulp.dest(options.src + '/js/'));
});
/**********************************************************/

gulp.task('styles', ()=> {
	// Maybe remove the globbing patterns for the *.sass files?  'src/sass/circle/_components.sass', 'src/sass/circle/_core.sass'
	// Compiles the SaSS into CSS, writes source map for SaSS files.
	return gulp.src([options.src + '/sass/global.scss'])
		.pipe(maps.init())
		.pipe(sass())
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/styles/'))
		.pipe(gulp.dest(options.src + '/css/'));
});

gulp.task('images', ()=> {
	return gulp.src(options.src + '/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest(options.dist + '/content'));
});

gulp.task('clean', ()=> {
	return del(['dist/*', 'src/css/', 'src/js/all.js', 'src/js/all.js.map', 'src/js/circle.min.js']);
});

gulp.task('html', ['scripts', 'styles', 'images'], ()=> {
	return gulp.src(options.src + '/index.html')
		.pipe(useref())	// useref() does file concatenation, but Not minification.
		.pipe(iff('*.js', uglify()))	// bug not this line
		.pipe(iff('*.css', csso()))
		.pipe(gulp.dest(options.dist));
});

gulp.task('build', ['clean'], ()=> {
	// gulp.start(['jsMinify','styles', 'images']);
	gulp.start('html');
	// Provide production files below:
	return gulp.src(['css/global.css',
									'dist/scripts/all.min.js',
									'src/index.html',
									'src/icons/**'],
									{ base: './src/' })
		.pipe(gulp.dest('dist'));
});

// DONE: Default Task
	// The gulp command properly runs the build task as a dependency.
	// The gulp command serves the project using a local webserver.
gulp.task('default', ['build'], ()=> {
	// gulp.start('build');
	return connect.server({ port: 7000 });
});

/* TODO: Complete watch task.  Exceeds:
		The gulp command also listens for changes to any .scss file. When there is a change to any .scss file, the gulp styles command is run, the files are:  (compiled, concatenated)<--DONE BY sass() module, &
		(minified)<--DONE BY csso() module, to the dist folder, and the browser reloads, displaying the changes
		*/

//	gulp.watch('files-to-watch', ['tasks', 'to', 'run']);
gulp.task('watch', ['browser', 'watchMinify'], ()=> {
	// When run, watches SaSS files for changes, runs styles task on change.
	gulp.watch(options.src + '/sass/**/*.scss', ['watchMinify']);
});

gulp.task('browser', ()=> {
	// Starts a local server, opens project in new browser tab.
	browserSync.init({
		server: {
			baseDir: 'dist'
		},
	});
});

// gulp.task() takes 'styles' as dependency, is run as a dependency of 'watch' task, it will minify the global.css w/ csso().
gulp.task('watchMinify', ['styles'], ()=> {
	return gulp.src(options.dist + '/styles/global.css')
		.pipe(csso())
		.pipe(rename('all.min.css'))
		.pipe(gulp.dest(options.dist + '/styles/'))
		.pipe(browserSync.reload({
			stream: true
		}));
});












//
