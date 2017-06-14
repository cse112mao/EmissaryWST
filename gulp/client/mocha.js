var gulp = require('gulp'),
    mocha = require('gulp-mocha');

/**
* Run Mocha Tests
**/
gulp.task('test:mocha', () =>
   gulp.src('client/test/mocha/test/*.js', {read: false})
      .pipe(mocha({reporter: 'spec'}))
      .once('error', () => {
        process.exit(1);
      })
      //.once('end', () => {
      //  process.exit();
      //})
);