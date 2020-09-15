const gulp = require('gulp');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');

const minifyCss = require('gulp-minify-css');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');

const del = require('del');


function styles() {
  return gulp.src(['src/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error);
        this.emit('end');
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minifyCss())
    .pipe(gulp.dest('src/css/'))
}



function scripts() {
  return gulp.src('src/js/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('src/js/'))
}



function bsReload(done) {
  browserSync.reload();
  done();
}





function watchFiles() {
  browserSync.init({
    server: {
      baseDir: ['./'],
    }
  });

  gulp.watch("src/styles/**/*.scss", gulp.series(styles));

  gulp.watch("src/css/*.css").on('change', browserSync.reload);
  gulp.watch("src/js/*.js").on('change', browserSync.reload);
  gulp.watch("*.html").on('change', browserSync.reload);

}

gulp.task('default', gulp.series(gulp.parallel(styles), watchFiles));