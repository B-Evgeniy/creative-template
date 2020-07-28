const {task, src, dest, watch} = require('gulp'); 
const sass = require('gulp-sass');   
const browserSync = require('browser-sync');
const notify = require('gulp-notify'); 
const cssnano = require('cssnano');  
const rename = require('gulp-rename'); 
const postcss = require('gulp-postcss'); 
const autoprefixer = require('autoprefixer'); 
const mqpacker = require('css-mqpacker'); 
const sortCSSmq = require('sort-css-media-queries'); 
const concat = require('gulp-concat'); 
const uglify = require('gulp-uglify'); 
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');

const PATH = {                           
  htmlFiles: './**/*.html',
  scssFile: './assets/scss/style.scss',
  scssFiles: './assets/scss/**/*.scss',
  cssFolder: './assets/css',
  jsFolder: './assets/js',
  jsFiles: ['./assets/js/**/*.js',   
  '!./assets/js/**/all.js',        
  '!./assets/js/**/*.es6.min.js',      
  '!./assets/js/**/*.min.js'],
  // imgSrcFolder:'./images_before_compression/*.{png, gif, jpg, jpeg, gif}',
  imgSrcFolder:'./images_for_compression/*.*',
  imgBuildFolder:'./images_for_compression/COMPRESED_images'
  // imgBuildFolder:'./images_AFTER_compression/'
}

//  scss -> css  
function scss (){
    return src(PATH.scssFile , {sourcemaps: true})  
    .pipe(sass({ outputStyle:'expanded' }).on('error', sass.logError))   
    .pipe(postcss([      
      autoprefixer({ overrideBrowserslist: ['last 5 versions', '> 1%'], cascade: true }), 
      mqpacker({sort:sortCSSmq })    
     ]))
    .pipe(dest(PATH.cssFolder , {sourcemaps: true})) 
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify({ message: '-----------Compiled!-----------', sound: false })) 
}
// scss -> min.css 
function scssMin (){
  return src(PATH.scssFile)           
  .pipe(sass({ outputStyle:'expanded' }).on('error', sass.logError))  
  .pipe(postcss(       
    [ 
      autoprefixer({ overrideBrowserslist: ['last 5 versions', '> 1%'], cascade: true }),
      cssnano(),
      mqpacker({sort: sortCSSmq })  
    ]
    )) 
  .pipe(rename({ suffix: '.min' }))  
  .pipe(dest(PATH.cssFolder))       
  .pipe(browserSync.reload({stream: true}))
  .pipe(notify({ message: '-------file "style.min.css" UPDATED!-------', sound: false })) 
}

function syncInit() { 
       browserSync({
           server: { 
            baseDir: './'
            },  
            notify: false
            });
     }

async function sync() {
  browserSync.reload();
}

async function watchFiles(){
  syncInit();
  watch(PATH.htmlFiles, sync);    
  watch(PATH.scssFiles, scss);
  watch(PATH.jsFiles, sync);
}

function concatJs(){
  return src(PATH.jsFiles)    
  .pipe(concat('all.js'))     
  .pipe(dest(PATH.jsFolder))  
}

function uglifyJs(){
  return src(PATH.jsFiles)    
  .pipe(uglify({             
     toplevel: true,
     output: { quote_style: 3 }
  })) 
  .pipe(rename({ suffix: '.min' }))     
  .pipe(dest(PATH.jsFolder))  
}

function uglifyEs6(){
  return src(PATH.jsFiles)    
  .pipe(terser())               
  .pipe(rename({ suffix: '.es6.min' }))    
  .pipe(dest(PATH.jsFolder)) 
}

function imageCompression(){
  return src(PATH.imgSrcFolder)
  .pipe(imagemin({
    progressive: true,
    svgoPlugins: [{removeViewBox: false}],
    interlased: true,
    optimizationLevel: 3 // 0 to 7
  }))
  .pipe(dest(PATH.imgBuildFolder))
}


task('scss', scss);  
task('min', scssMin); 
task('concat', concatJs); 
task('uglify', uglifyJs); 
task('es6', uglifyEs6); 
task('image', imageCompression); 

task('watch', watchFiles); 