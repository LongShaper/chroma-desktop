var gulp = require('gulp'),
	sass = require('gulp-sass'),
	connect = require('gulp-connect'),
	cssnano = require('gulp-cssnano'),
	bourbon = require('node-bourbon');

bourbon.with('sass');

gulp.task('compileSass', function(){
	gulp.src("sass/**/*.scss")
	.pipe(sass({ includePaths: bourbon.includePaths }))
	.pipe(cssnano())
	.pipe(gulp.dest('css'))
	.pipe(connect.reload());
});

gulp.task('html', function(){
	return gulp.src('**/*.html')
	.pipe(connect.reload());
});

gulp.task('watch', ['connect'], function(){
	gulp.watch('sass/**/*.scss', ['compileSass']);
	gulp.watch('**/*.html', ['html']);
});

gulp.task('connect', function(){
	connect.server({
		root: [__dirname],
		livereload: true,
		port: 3000
	});
});


gulp.task('default', ['watch'], function(){});











