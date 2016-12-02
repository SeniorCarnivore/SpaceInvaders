const properties = {
  port: 8080, // LiveReload server port
  folders: {
    build: 'dist', // Deploy folder
    src: 'src', // Dev folder
  }
}

const
  mainBowerFiles = require('main-bower-files');

const plugins = {
  js: mainBowerFiles('**/*.js'),
  css: mainBowerFiles(['**/*.css', '**/*.scss']),
};

const
  gulp = require('gulp'),
  connect = require('gulp-connect'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  prefix = require('gulp-autoprefixer')
  babel = require('gulp-babel'),
  react = require('gulp-react'),
  //uglify = require('gulp-uglify'),
  watch = require('gulp-watch');
  //cleanCSS = require('gulp-clean-css');

function onError (err) {
  console.log(err);
  this.emit('end');
}

gulp.task('scripts', function() {
  return gulp.src([
      properties.folders.src + '/scripts/main.js',
    ])
    .pipe(react())
    .pipe(sourcemaps.init())
    //.pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(babel({
      "presets": ["es2015"]
    }))
    .on('error', onError)
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(properties.folders.build + '/scripts'))
    .pipe(connect.reload());
});

gulp.task('vendor', function () {
	gulp.src(plugins.css)
	  .pipe(concat('vendor.css'))
	  .pipe(gulp.dest(properties.folders.build + '/styles/'));
	gulp.src(plugins.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(properties.folders.build + '/scripts/'));
});

gulp.task('pug', function() {
	gulp.src(properties.folders.src + '/views/*.pug')
		.pipe(pug({
			pretty: true
		}))
    .on('error', onError)
		.pipe(gulp.dest('./'))
    .on('end', function(){
      gulp.src('../*.html')
        .pipe(connect.reload());
    });
});

gulp.task('sass', function () {
	gulp.src(properties.folders.src + '/styles/main.scss')
    .pipe(sourcemaps.init())
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix("last 3 version", "> 1%", "ie 8", "ie 7"))
    //.pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(properties.folders.build + '/styles'))
		.pipe(connect.reload());
});

gulp.task('server', function() {
  connect.server({
    port: properties.port,
		root: './',
		livereload: true
	});
});

gulp.task('watch', function() {
	watch(properties.folders.src + '/views/**/*.pug', function() {
    gulp.start('pug');
	});
	watch(properties.folders.src + '/styles/**/*.scss', function() {
    gulp.start('sass');
	});
	watch(properties.folders.src + '/scripts/**/*.js', function() {
    gulp.start('scripts');
	});
});

gulp.task('default', ['server', 'pug', 'scripts', 'vendor', 'sass', 'watch']);
