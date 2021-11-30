const { src, dest, parallel } = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const easings = require('postcss-easings');
const presetenv = require('postcss-preset-env');
const sorting = require('postcss-sorting');
const terser = require('gulp-terser');

const sortOrder = {
  order: [
    'custom-properties',
    'dollar-variables',
    {
      type: 'at-rule',
      name: 'include',
    },
    {
      type: 'at-rule',
      name: 'include',
      hasBlock: true,
    },
    'declarations',
    'at-rules',
    'rules',
  ],
  'properties-order': [
    'content',
    'position',
    'inset',
    'inset-inline',
    'inset-inline-start',
    'inset-inline-end',
    'inset-block',
    'inset-block-start',
    'inset-block-end',
    'top',
    'bottom',
    'left',
    'right',
    'z-index',
    'float',
    'display',
    'flex-direction',
    'flex-flow',
    'justify-content',
    'align-items',
    'align-content',
    'flex-basis',
    'flex-wrap',
    'flex-grow',
    'flex-shrink',
    'grid',
    'grid-template',
    'grid-template-columns',
    'grid-auto-columns',
    'grid-template-rows',
    'grid-auto-rows',
    'grid-template-areas',
    'grid-auto-flow',
    'grid-gap',
    'visibility',
    'backface-visibility',
    'max-block-size',
    'min-block-size',
    'block-size',
    'max-height',
    'min-height',
    'height',
    'max-inline-size',
    'min-inline-size',
    'inline-size',
    'max-width',
    'min-width',
    'width',
    'aspect-ratio',
    'margin',
    'margin-inline',
    'margin-inline-start',
    'margin-inline-end',
    'margin-block-start',
    'margin-block-end',
    'margin-block',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'padding',
    'padding-inline',
    'padding-inline-start',
    'padding-inline-end',
    'padding-block-start',
    'padding-block-end',
    'padding-block',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'border',
    'border-block-end',
    'border-block-end-color',
    'border-block-end-style',
    'border-block-end-width',
    'border-block-start',
    'border-block-start-color',
    'border-block-start-style',
    'border-block-start-width',
    'border-inline-end',
    'border-inline-end-color',
    'border-inline-end-style',
    'border-inline-end-width',
    'border-inline-start',
    'border-inline-start-color',
    'border-inline-start-style',
    'border-inline-start-width',
    'border-start-start-radius',
    'border-start-end-radius',
    'border-end-start-radius',
    'border-end-end-radius',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-radius',
    'border-collapse',
    'outline',
    'outline-width',
    'outline-style',
    'outline-color',
    'outline-offset',
    'box-sizing',
    'background',
    'background-image',
    'background-color',
    'background-position',
    'background-size',
    'background-repeat',
    'background-origin',
    'background-clip',
    'background-attachment',
    'box-shadow',
    'font',
    'font-style',
    'font-family',
    'font-size',
    'line-height',
    'font-weight',
    'font-stretch',
    'font-kerning',
    'font-variant',
    'color',
    'list-style',
    'list-style-image',
    'list-style-type',
    'list-style-position',
    'text-indent',
    'word-break',
    'word-wrap',
    'word-spacing',
    'text-overflow',
    'hyphens',
    'white-space',
    'text-decoration',
    'vertical-align',
    'text-transform',
    'letter-spacing',
    'direction',
    'text-shadow',
    'object-fit',
    'object-position',
    'transform',
    'transform-style',
    'perspective',
    'transition',
    'transition-property',
    'transition-duration',
    'transition-timing-function',
    'transition-delay',
    'animation',
    'animation-name',
    'animation-duration',
    'animation-timing-function',
    'animation-delay',
    'animation-iteration-count',
    'animation-direction',
    'animation-fill-mode',
    'animation-play-state',
    'opacity',
    'filter',
    'mix-blend-mode',
    'overflow',
    'overflow-x',
    'overflow-y',
    'scroll-behavior',
    'cursor',
    'pointer-events',
  ],
  'unspecified-properties-position': 'bottom',
};

const paths = {
  html: {
    src: ['./src/**/*.html'],
    dest: './dist/',
  },
  styles: {
    src: ['./src/css/**/*.css'],
    destDev: './src/css/',
    dest: './dist/css/',
  },
  scripts: {
    src: ['./src/js/**/*.js'],
    dest: './dist/js/',
  },
  images: {
    src: ['./src/img/**/*'],
    dest: './dist/img/',
  },
};

// Copy HTML
function copyHtml() {
  return src(paths.html.src).pipe(dest(paths.html.dest));
}

// Copy Images
function copyImages() {
  return src(paths.images.src).pipe(dest(paths.images.dest));
}

// Minify and Copy Javascript
function processJS() {
  return src(paths.scripts.src)
    .pipe(terser().on('error', (error) => console.log(error)))
    .pipe(dest(paths.scripts.dest));
}

// Polyfill, Autoprefix and Miify CSS
function processCSS() {
  return src(paths.styles.src)
    .pipe(
      postcss([presetenv({ stage: 0 }), easings(), autoprefixer(), cssnano()])
    )
    .pipe(dest(paths.styles.dest));
}

// Dev
function dev() {
  return src(paths.styles.src)
    .pipe(postcss([sorting(sortOrder)]))
    .pipe(dest(paths.styles.destDev));
}

// Export Functions
exports.default = parallel(dev);
exports.build = parallel(copyHtml, copyImages, processJS, processCSS);
