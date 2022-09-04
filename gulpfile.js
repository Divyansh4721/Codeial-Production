const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const del = require('del');



gulp.task('scss', function (done) {
    console.log('minifying scss...');
    gulp.src('./assets/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./assets/css'));
    done()
});


gulp.task('css', function (done) {
    console.log('minifying css...');
    gulp.src('./assets/**/*.css', { base: 'assets' })
        .pipe(cssnano())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            base: 'public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('js', function (done) {
    console.log('minifying js...');
    gulp.src('./assets/**/*.js', { base: 'assets' })
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            base: 'public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done()
});


gulp.task('images', function (done) {
    console.log('compressing images...');
    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg|ico)')
        .pipe(imagemin())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets'))
        .pipe(rev.manifest({
            base: 'public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
    done();
});



gulp.task('fonts', function (done) {
    console.log('minifying fonts...');
    gulp.src('./assets/**/*.woff')
        .pipe(gulp.dest('./public/assets'))
        .pipe(gulp.dest('./public/assets'));
    done();
});


// empty the public/assets directory
gulp.task('clean', function (done) {
    del.sync('./public/assets/**');
    del.sync('./assets/css/**');
    del.sync('./rev-manifest.json');
    done();
});

// gulp.task('build1', gulp.series('css', 'js'), function (done) {
//     console.log('Building assets');
//     done();
// });

// gulp.task('build2', gulp.series('images', 'fonts'), function (done) {
//     console.log('Building assets');
//     done();
// });

gulp.task('build', gulp.series('css', 'js', 'images', 'fonts'), function (done) {
    console.log('Building assets');
    done();
});