var gulp = require('gulp'),
  nightwatch = require('gulp-nightwatch');

gulp.task('test:nightwatch', function() {
  return gulp.src('test/*.js', {read: false})
    .pipe(nightwatch({configFile: 'nightwatch.conf.BASIC.js'}))
    .once('error', function() {
      process.exit(1)
    });
  process.exit();
});

