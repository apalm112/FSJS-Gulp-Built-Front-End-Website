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
	del = require('del');

const options = {
	src: 'src',
	dist: 'dist`'
};

gulp.task('concatScripts', function() {
	gulp.src(['js/*/*', 'js/*'])
		.pipe(concat('all.min.js'))
		.pipe(gulp.dest('js'));
});
