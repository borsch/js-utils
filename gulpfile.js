var gulp = require('gulp'),
    uglyflyJs = require('gulp-uglyfly'),
    rename = require('gulp-rename');

gulp.task('minify', function(){
    gulp.src(['./**/*.js',
        '!dist', '!dist/**',
        '!node_modules', '!node_modules/**',
        '!js_autocomplete_tag', '!js_autocomplete_tag/**',
        '!gulpfile.js'
    ])
        .pipe(uglyflyJs())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'))
        .on('end', function(){
            gulp.src([
                './**/*.gif'
            ])
                .pipe(gulp.dest('dist/'));
        });
});
