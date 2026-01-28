import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import { deleteAsync } from 'del';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import htmlmin from 'gulp-htmlmin';
import browserSync from 'browser-sync';
import webp from 'gulp-webp';
import newer from "gulp-newer";

const sass = gulpSass(dartSass);
const bs = browserSync.create();

const paths = {
  html: {
    src: 'src/pages/**/*.html',
    dest: 'docs/',
    watch: ['src/pages/**/*.html', 'src/components/**/*.html'],
  },
  styles: {
    src: 'src/scss/volonteers-main.scss',
    dest: 'docs/assets/css/',
    watch: 'src/scss/**/*.scss',
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'docs/assets/js/',
    watch: 'src/js/**/*.js',
  },
  assets: {
    src: 'src/assets/**/*',
    dest: 'docs/assets/',
    watch: 'src/assets/**/*',
  },
  images: {
    src: 'src/images/**/*{.jpg,.jpeg,.png}',
    dest: 'docs/assets/images',
  },
  svg: {
    src: 'src/images/**/*.svg',
    dest: 'docs/assets/images'
  }
};

export const html = () =>
  gulp
    .src(paths.html.src)
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: 'src/components/',
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: false,
        removeComments: true,
      })
    )
    .pipe(gulp.dest(paths.html.dest))
    .pipe(bs.stream());

export const styles = () =>
  gulp
    .src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(bs.stream());

const imagesToWebp = () =>
  gulp.src(paths.images.src, { encoding: false })
    .pipe(newer(paths.images.dest))
    .pipe(webp({ quality: 80 }))
    .pipe(gulp.dest(paths.images.dest));

export const scripts = () =>
  gulp
    .src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(bs.stream());

export const svg = () =>
  gulp.src(paths.svg.src)
    .pipe(gulp.dest(paths.svg.dest));

export const assets = () =>
  gulp
    .src(paths.assets.src, { encoding: false })
    .pipe(gulp.dest(paths.assets.dest));

// Очистка
export const clean = () => deleteAsync(['docs']);

// Сервер
export const serve = () => {
  bs.init({
    server: {
      baseDir: './docs',
    },
    notify: false,
    open: true,
    cors: true,
  });

  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.html.watch, html);
  gulp.watch(paths.scripts.watch, scripts);
  gulp.watch(paths.assets.watch, assets);
  gulp.watch(paths.images.src, imagesToWebp);
  gulp.watch(paths.svg.src, svg);
};

// Сборка
export const build = gulp.series(
  clean, 
  gulp.parallel(
    styles,
    html,
    scripts,
    assets,
    imagesToWebp,
    svg
  )
);

export default gulp.series(build, serve);