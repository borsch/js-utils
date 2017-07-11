var gulp = require('gulp'),
    uglyflyJs = require('gulp-uglyfly'),
    rename = require('gulp-rename');

gulp.task('minify', function(){
    gulp.src(['./**/*.js',
        '!node_modules', '!node_modules/**',
        '!js_autocomplete_tag', '!js_autocomplete_tag/**',
        '!gulpfile.js'
    ])
        .pipe(uglyflyJs())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/'));
});
