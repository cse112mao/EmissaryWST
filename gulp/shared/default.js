var gulp = require('gulp');
var runSequence = require('run-sequence');

/* The default task */
gulp.task('default', ['build:dev', 'apidoc']);

