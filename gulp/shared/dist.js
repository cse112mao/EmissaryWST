var gulp = require('gulp');

/* this will create the dist folder
 * that is ready to serve by our backend
 */
gulp.task('dist', [
// uncomment once fixed
 'lint:server',
 'lint:client',
  'bower',
  'concat:css',
  'concat:js',
  'copy:assets',
  'copy:bower-components',
  'copy:views',
  'copy:css',
  'copy:js',
  'copy:images'
]);
