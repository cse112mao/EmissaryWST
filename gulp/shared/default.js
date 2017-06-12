var gulp = require('gulp');
var runSequence = require('run-sequence');

/* The default task */
gulp.task('default', function(callback) {
  runSequence(['build:dev', 'apidoc']);
});

