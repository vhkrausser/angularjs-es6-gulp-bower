//dependecies
var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    clean           = require('gulp-clean'),
    jshint          = require('gulp-jshint'),
    bsHtmlInjector  = require('bs-html-injector'),
    babel           = require('gulp-babel'),
    browserSync     = require('browser-sync').create();

//paths
var PATHS = {
  dist    : './dist/',
  styles  : ['./app/**/*.scss'],
  js      : ['./app/**/*.js'],
  html    : ['./app/**/*.html'],
  images  : [],
  extras  : []
};

//tasks
gulp.task('default', ['clean', 'styles', 'lint-dev', 'js', 'copy', 'watch', 'browser-sync']);

gulp.task('clean', function() {
    gulp.src(PATHS.dist+'*.*')
      .pipe(clean({force : true}));
});

gulp.task('styles', function() {
    gulp.src(PATHS.styles)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(PATHS.dist))
      .pipe(browserSync.stream());
});

gulp.task('lint-dev', function() {
    gulp.src(PATHS.js)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
      //.pipe(jshint.reporter('fail')); only fail in production
});

gulp.task('js', function() {
    gulp.src(PATHS.js)
      .pipe(sourcemaps.init())
      .pipe(babel({ presets : ['es2015'] }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(PATHS.dist))
      .pipe(browserSync.stream());
});

gulp.task('copy', function() {
    gulp.src(PATHS.html)
      .pipe(gulp.dest(PATHS.dist));
});


gulp.task('watch', function() {
    gulp.watch(PATHS.js, ['lint-dev', 'js']);
    gulp.watch(PATHS.styles, ['styles']);
    gulp.watch(PATHS.html).on('change', function() {
      gulp.start('copy');
      //browserSync.reload();
    });
});

gulp.task('browser-sync', function() {

    var config = {
      open  : false,
      server : {
        baseDir : './dist'
      }
    };

    browserSync.use(bsHtmlInjector, {
        files : PATHS.html
    });

    browserSync.init(config);
});
