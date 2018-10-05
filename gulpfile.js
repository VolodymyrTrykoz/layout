var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    bourbon = require('node-bourbon'),
    ftp = require('vinyl-ftp'),
    notify = require('gulp-notify'),
    pug = require('gulp-pug'),
    babel = require('gulp-babel');

// Скрипты проекта
gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery-3.3.1/jquery-3.3.1.min.js',
        'app/libs/slick/slick.js',
        'app/js/jsEs5.js',
    ])
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('babel', function() {
    return gulp.src('app/js/main.js')
        .pipe(babel({presets: ['env']}))
        .pipe(concat('jsEs5.js'))
        .pipe(gulp.dest('app/js'))
});

gulp.task('buildJs', ['babel'], function() {
    gulp.start('scripts');
});

gulp.task('pug', function buildHTML() {
    return gulp.src('app/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        https: true,
        notify: false,
        ghostMode: false
    });
});

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon.includePaths
        }).on("error", notify.onError()))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});



gulp.task('watch', ['pug', 'sass', 'buildJs', 'browser-sync'], function(){
    gulp.watch('app/pug/*.pug', ['pug']);
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/js/main.js', ['buildJs']);
    gulp.watch('app/*.html', browserSync.reload);
});


gulp.task('imagemin', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'scripts'], function() {

    var buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess'
    ]).pipe(gulp.dest('dist'));

    var buildCss = gulp.src([
        'app/*.css'
    ]).pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src([
        'app/js/scripts.min.js'
    ]).pipe(gulp.dest('dist/js'));

    var buildFonts = gulp.src([
        'app/fonts/**/*']
    ).pipe(gulp.dest('dist/fonts'));
});

gulp.task('deploy', function() {
    var conn = ftp.create({
        host: 'hostname.com',
        user: 'username',
        password: 'userpassword',
        parallel: 10,
        log: gutil.log
    });

    var globs = [
        'dist/**',
        'dist/.htaccess',
    ];
    return gulp.src(globs, {buffer: false})
        .pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() {
    return del.sync('dist')
});
gulp.task('clearcache', function() {
    return cache.clearAll()
});

gulp.task('default', ['watch']);