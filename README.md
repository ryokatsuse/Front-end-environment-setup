## 設定
最低限のフロントエンド環境。

## 共通系

```
npm install gulp gulp-webserver connect-ssi autoprefixer gulp-plumber gulp-notify --save-dev

```

### SCSSの場合
```
npm install gulp gulp-sass gulp-autoprefixer gulp-csscomb gulp-combine-media-queries gulp-clean-css --save-dev

```
gulp-combine-media-queriesの152行目をコメントアウトする。


```
 file.contents = new Buffer(cssJson);

 // file.contents = new Buffer(cssJson);

```
## gulpfile.js
```
// scssタスク
  var gulp = require('gulp');
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');
  var plumber = require('gulp-plumber');
  var notify = require('gulp-notify');
  var csscomb = require('gulp-csscomb');
  var cmq = require('gulp-combine-media-queries');
  var webserver = require('gulp-webserver');
  var connectSSI = require('connect-ssi');
  var cleancss = require('gulp-clean-css');
  var uglify = require('gulp-uglify');

  // SCSSコンパイル
  gulp.task('sass', function() {
    gulp.src('src/scss/*.scss')
      .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      }))
      .pipe(autoprefixer({
        cascade: false
      }))
      .pipe(sass())
      .pipe(csscomb())
      .pipe(cmq({}))
      .pipe(cmq({}))
      .pipe(cleancss())
      .pipe(gulp.dest('dist/common/css'));
  });

  // ローカルサーバー立ち上げ
  gulp.task('webserver', function() {
    gulp.src('./dist/')
      .pipe(webserver({
        livereload: true,
        middleware: [
          connectSSI({
            ext: '.html', // file extension. Only urls ending in this will be evaluated.
            baseDir: __dirname // base path to look in for files
          })
        ],
        open: true
      }));
  });

  gulp.task('compress', function() {
    // 除外するディレクトリ、ファイルがあるときの記述例
    //  gulp.src(['src/**/*.js', '!exclude/**/*.js'])
    gulp.src('src/js/*.js')
      .pipe(plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
      }))
      .pipe(uglify())
      .pipe(gulp.dest('dist/common/js')
        // 上書きしないときの出力先ディレクトリ
        // .pipe(gulp.dest('src/dist')
      );
  });

  // 適宜dir変更
  gulp.task('default', function() {
    gulp.watch("src/scss/*", ["sass"]);
    gulp.watch("src/scss/foundation/*", ["sass"]);
    gulp.watch("src/scss/layout/*", ["sass"]);
    gulp.watch("src/scss/object/*", ["sass"]);
    gulp.watch("src/scss/second/*", ["sass"]);
    gulp.watch("src/js/*js", ["compress"])
  });

```

### postcssの場合

```
npm install gulp-postcss postcss-cssnext postcss-simple-vars postcss-nested postcss-mixins postcss-import css-mqpacker csswring

```

## gulpfile.js

```
// post cssタスク
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var cssnext = require('postcss-cssnext');
var PostcssSimpleVars = require('postcss-simple-vars');
var PostcssNested = require('postcss-nested');
var PostcssMixins = require('postcss-mixins');
var PostcssImport = require('postcss-import');
var autoprefixer = require('autoprefixer');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var CssMqpacker = require('css-mqpacker');
var csswring = require("csswring");
var webserver = require('gulp-webserver');
var connectSSI = require('connect-ssi');
var uglify = require('gulp-uglify');

var paths = {
  'src': 'src/',
  'dist': 'dist/'
}

gulp.task('css', function() {
  var processors = [
    cssnext(),
    PostcssMixins(),
    PostcssSimpleVars(),
    PostcssNested(),
    PostcssImport(),
    autoprefixer(),
    CssMqpacker(),
    csswring(),
  ];
  return gulp.src(paths.src + 'pcss/*.css')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.dist + 'common/css'))
});

// ローカルサーバー立ち上げ
gulp.task('webserver', function() {
  gulp.src('./dist/')
    .pipe(webserver({
      livereload: true,
      middleware: [
        connectSSI({
          ext: '.html', // file extension. Only urls ending in this will be evaluated.
          baseDir: __dirname // base path to look in for files
        })
      ],
      open: true
    }));
});
gulp.task('compress', function() {
  // 除外するディレクトリ、ファイルがあるときの記述例
  //  gulp.src(['src/**/*.js', '!exclude/**/*.js'])
  gulp.src('src/js/*.js')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/common/js')
      // 上書きしないときの出力先ディレクトリ
      // .pipe(gulp.dest('src/dist')
    );
});
gulp.task('default', function() {
  gulp.watch("src/pcss/*css", ["css"]);
  gulp.watch("src/js/*js", ["compress"]);
  // gulp.watch("src/scss/foundation/*",["css"]);
  // gulp.watch("src/scss/layout/*",["css"]);
  // gulp.watch("src/scss/object/*",["css"]);
  // gulp.watch("src/scss/second/*",["css"])
});

```

### js系

```
npm install gulp-uglify

```
