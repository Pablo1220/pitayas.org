//html
import htmlmin from 'gulp-htmlmin'

//javascrip
import gulp from 'gulp'
import babel from 'gulp-babel'
import terser from 'gulp-terser'

//css
import postcss from 'gulp-postcss'
import cssnano from 'cssnano'
import autoprefixer from 'autoprefixer'
//clean css
import clean from 'gulp-purgecss'

//pug
import pug from 'gulp-pug'

//SASS
//import sass from 'gulp-sass'
//compiler
const sass = require('gulp-sass')(require('sass'));


//common
import concat from 'gulp-concat'

//caché  Aparentemente no hace nada

// import cacheBust from "gulp-cache-bust"
//var cachebust = require('gulp-cache-bust');


//optimización de imágenes
//import imagemin from 'gulp-imagemin'  // This is a ESM. Compiler gives error[ERR_REQUIRE_ESM]

const squoosh = require('gulp-libsquoosh');

import {init as server, reload, stream} from 'browser-sync'

const cssPlugins = [
    cssnano(),
    autoprefixer()
]
const producction = false


gulp.task('babel', ()=>{
    return gulp
    .src('./src/js/*.js')
    .pipe(concat('scryits.min.js')) //debe estar en esta posición para que no aparedcan multiples "use strict"
    //.pipe(babel({ presets: ["@babel/preset-env"] })) si no lo pones no pasa nada porque ya está en babelrc
    .pipe(terser())
    .pipe(gulp.dest('./docs/js'))
    
})

gulp.task('html', ()=> {
    return gulp
    .src('./src/views/pages/*.html')
    // .pipe(htmlmin({
    //     //collapseWhitespace:true, esto da error, elimina clases
    //     removeComments:true
    // }))
    .pipe(gulp.dest('./docs'))
})

gulp.task('styles', ()=>{
    return gulp
    .src('./src/css/*.css')
    .pipe(concat('styles.min.css'))
    .pipe(postcss(cssPlugins))
    .pipe(gulp.dest('./docs/css'))
    .pipe(stream())

})

gulp.task('views', () => {
    return gulp
        .src('./src/views/pages/*.pug')
        .pipe(pug({
            pretty: producction ? false: true
        }))
        .pipe(cachebust({
            type: 'timestamp' //parece que no hace nada
        }))
        .pipe(gulp.dest('./docs'))
})

gulp.task('sass', () => {
    return gulp
        .src('./src/scss/styles.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('./src/css'))
        .pipe(stream())
})

gulp.task('clean', () => {
    return gulp
        .src('./docs/css/styles.css')
        .pipe(clean({
            content: ['./docs/*.html']
        }))
        .pipe(gulp.dest('./docs/css'))
})

gulp.task('imgmin', () => {
    return gulp
    .src('./src/assets/images/* ')
    .pipe(squoosh({
        oxipng: 'auto',
        webp: 'auto',
        //avif: {},
        mozjpg: 'auto',
      }))
    .pipe(gulp.dest('./docs/assets/images2'))
})



gulp.task('default', ()=> {
    server({server: './docs'})
    gulp.watch('./src/views/**/*.html', gulp.parallel('html')).on('change', reload)
    gulp.watch('./src/css/*.css', gulp.parallel('styles'))
    gulp.watch('./src/js/*.js', gulp.parallel('babel')).on('change', reload)
    gulp.watch('./src/views/**/*.pug', gulp.parallel('views')).on('change', reload)
    gulp.watch('./src/scss/**/*scss', gulp.parallel('sass'))
    gulp.watch('./docs/css/*.css').on('change', reload)


})