var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('default', function () {
  var tsResult = tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return tsResult.js
    .pipe(sourcemaps.write({
      // Return relative source map root directories per file.
      sourceRoot: function (file) {
        var sourceFile = path.join(file.cwd, file.sourceMap.file);
        return path.relative(path.dirname(sourceFile), file.cwd);
      }
    }))
    .pipe(gulp.dest('./assets/js'));
});