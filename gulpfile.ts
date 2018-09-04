'use strict';

namespace GulpModule {

    let gulp = require('gulp');

    gulp.task('copy', [], () => {
        return gulp.src(
            [

                'config/default.js',
                'logs/*',

                'public/*.css',
                'public/css/**/*.css',
                'public/dialogs/**/*.html',
                'public/fonts/**/*',
                'public/images/**/*',
                'public/js/**/*.js',
                'public/*.html',
                'public/favicons/**/*',


                'routes/**/*.js',
                'views/**/*.pug',
                'views/**/*.jade',

                'package.json',
                'bower.json',

                '.bowerrc'
            ],
            {base: '..'}
        )
            .pipe(gulp.dest('product'));
    });


}