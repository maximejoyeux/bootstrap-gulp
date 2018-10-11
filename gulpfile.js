var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    prefix      = require('gulp-autoprefixer'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    sassLint    = require('gulp-sass-lint'),
    sourcemaps  = require('gulp-sourcemaps');
// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
runSequence = require('run-sequence');
// livereload = require('gulp-livereload');

var displayError = function(error) {
    // Initial building up of the error
    var errorString = '[' + error.plugin.error.bold + ']';
    errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

    // If the error contains the filename or line number add it to the string
    if(error.fileName)
        errorString += ' in ' + error.fileName;

    if(error.lineNumber)
        errorString += ' on line ' + error.lineNumber.bold;

    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    console.error(errorString);
};

var onError = function(err) {
    notify.onError({
        title:    "Gulp",
        subtitle: "Failure!",
        message:  "Error: <%= error.message %>",
        sound:    "Basso"
    })(err);
    this.emit('end');
};

var sassOptions = {
    outputStyle: 'compressed'
};

var prefixerOptions = {
    browsers: ['since 2008']
};

// BUILD SUBTASKS
// ---------------

gulp.task('styles-telecom', function() {
    return gulp.src('src/sass/telecom.sass')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions))
        .pipe(prefix(prefixerOptions))
        .pipe(rename('telecom.css'))
        .pipe(gulp.dest('public/telecom/css/'))
});


gulp.task('styles-energy', function() {
    return gulp.src('src/sass/energy.sass')
        .pipe(plumber({errorHandler: onError}))
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions))
        .pipe(prefix(prefixerOptions))
        .pipe(rename('energy.css'))
        .pipe(gulp.dest('public/energie/css/'))
});

gulp.task('sass-lint', function() {
    gulp.src('src/sass/telecom/**/*.sass')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError());
});

gulp.task('watch-energy', function() {
    gulp.watch('src/sass/**/**/*.*', ['styles-energy']);
    // livereload.listen();
});

gulp.task('watch-telecom', function() {
    gulp.watch('src/sass/**/**/*.*', ['styles-telecom']);
    // livereload.listen();
});


// BUILD TASKS
// ------------

gulp.task('default', function(done) {
    runSequence('styles-telecom','styles-energy', 'watch-energy', 'watch-telecom', done);
});

gulp.task('telecom', function(done) {
    runSequence('styles-telecom','watch-telecom', done);
});

gulp.task('energy', function(done) {
    runSequence('styles-energy','watch-energy', done);
});

gulp.task('build-telecom', function(done) {
    runSequence('styles-telecom', done);
});

gulp.task('build-energy', function(done) {
    runSequence('styles-energy', done);
});


// install : sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
// install : sudo apt-get install -y nodejs

// install : sudo npm install gulp -g
// install : npm install