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

/*gulp.task('scripts', ()=> {
	// TODO: Fix bug, current format of concat, minify js files results in js/circle being left out & all.min.js being empty.  circle/autogrow.js is already minified.
	return gulp.src([options.src + '/js/circle/circle.js'])
	//	'/js/circle/autogrow.js', '/js/global.js'
		.pipe(maps.init())
		.pipe(concat('all.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/scripts/'));
});

gulp.task('jsMinify', ['scripts'], ()=> {
	// del('src/js/all.js');
	return gulp.src(options.dist + '/scripts/all.js')
		.pipe(uglify())
		.pipe(rename('all.min.js'))
		.pipe(gulp.dest(options.dist + '/scripts/'));
});*/
/**********************************************************/
gulp.task('scripts', ['jsMinify'], ()=> {
	// DONE Works!
	return gulp.src([options.src + '/js/circle/autogrow.js', options.src + '/js/circle.min.js'])
		.pipe(maps.init())
		.pipe(concat('all.min.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest(options.dist + '/scripts/'));
});
gulp.task('jsMinify', ()=> {
	return gulp.src(options.src + '/js/circle/circle.js')
	.pipe(uglify())
	.pipe(rename('circle.min.js'))
	.pipe(gulp.dest(options.src + '/js/'));
});
/**********************************************************/

gulp.task('styles', ()=> {
	// Maybe remove the globbing patterns for the *.sass files?  'src/sass/circle/_components.sass', 'src/sass/circle/_core.sass'
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
	// TODO: Fix bug!!!  Is overwriting the all.min.js leaving it empty!
	return gulp.src(options.src + '/index.html')
		// useref() does file concatenation, but Not minification.
		.pipe(useref())
		.pipe(iff('*.js', uglify()))
		.pipe(iff('*.css', csso()))
		.pipe(gulp.dest(options.dist));
});

gulp.task('build', ['clean'], ()=> {
	// gulp.start(['jsMinify','styles', 'images']);
	gulp.start('html');
	// Provide production files below:
	return gulp.src([//'css/global.css',
									// 'dist/scripts/all.min.js',
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

// gulp.task('watch', ()=> {
// 	gulp.watch('sass/**/*.scss', ['styles']);
// });
