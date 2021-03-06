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

var rename = require('gulp-rename');
var ejs = require('gulp-ejs');
var fs = require('fs');

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

// gulp.task('ejs', function() {
//
//   var tmp_file = 'src/ejs/template.ejs'; // テンプレートファイル
//   var json_file = 'src/ejs/data/pages.json'; // ページデータ（JSONファイル）
//
//   var json = JSON.parse(fs.readFileSync(json_file)); //ページデータ（JSONファイル）の読み込み
//   var page_data = json.pages;
//
//   for (var i = 0; i < page_data.length; i++) // ページ数分loop
//     var id = page_data[i].id;
//
//     gulp.src(tmp_file)
//     .pipe(ejs({
//         pageData: page_data[i]  // ejsにページデータを渡す
//     }));
//     .pipe(rename(id + '.html')); // ファイル名を(id).htmlに
//     .pipe(gulp.dest("dist/")); // 生成したHTMLファイルの保存先
//   }
// });

gulp.task('ejs', () => {
    // var json = JSON.parse(fs.readFileSync("src/ejs/data/data.json"));
    gulp.src( ['src/ejs//**/*.ejs', '!' + 'src/ejs/**/_*.ejs'])
        .pipe(ejs('', {"ext": ".html"}))
        .pipe(rename({extname: '.html'}))
        .pipe(gulp.dest('dist'));
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
  gulp.watch('src/ejs/**/*.ejs', ['ejs']);
  gulp.watch("src/js/*js", ["compress"])
  // gulp.watch("src/scss/foundation/*",["css"]);
  // gulp.watch("src/scss/layout/*",["css"]);
  // gulp.watch("src/scss/object/*",["css"]);
  // gulp.watch("src/scss/second/*",["css"])
});


// // scssタスク
//   var gulp = require('gulp');
//   var sass = require('gulp-sass');
//   var autoprefixer = require('gulp-autoprefixer');
//   var plumber = require('gulp-plumber');
//   var notify = require('gulp-notify');
//   var csscomb = require('gulp-csscomb');
//   var cmq = require('gulp-combine-media-queries');
//   var webserver = require('gulp-webserver');
//   var connectSSI = require('connect-ssi');
//   var cleancss = require('gulp-clean-css');
//   var uglify = require('gulp-uglify');
//
//   // SCSSコンパイル
//   gulp.task('sass', function() {
//     gulp.src('src/scss/*.scss')
//       .pipe(plumber({
//         errorHandler: notify.onError("Error: <%= error.message %>")
//       }))
//       .pipe(autoprefixer({
//         cascade: false
//       }))
//       .pipe(sass())
//       .pipe(csscomb())
//       .pipe(cmq({}))
//       .pipe(cmq({}))
//       .pipe(cleancss())
//       .pipe(gulp.dest('dist/common/css'));
//   });
//
//   // ローカルサーバー立ち上げ
//   gulp.task('webserver', function() {
//     gulp.src('./dist/')
//       .pipe(webserver({
//         livereload: true,
//         middleware: [
//           connectSSI({
//             ext: '.html', // file extension. Only urls ending in this will be evaluated.
//             baseDir: __dirname // base path to look in for files
//           })
//         ],
//         open: true
//       }));
//   });
//
//   gulp.task('compress', function() {
//     // 除外するディレクトリ、ファイルがあるときの記述例
//     //  gulp.src(['src/**/*.js', '!exclude/**/*.js'])
//     gulp.src('src/js/*.js')
//       .pipe(plumber({
//         errorHandler: notify.onError("Error: <%= error.message %>")
//       }))
//       .pipe(uglify())
//       .pipe(gulp.dest('dist/common/js')
//         // 上書きしないときの出力先ディレクトリ
//         // .pipe(gulp.dest('src/dist')
//       );
//   });
//
//   // 適宜dir変更
//   gulp.task('default', function() {
//     gulp.watch("src/scss/*", ["sass"]);
//     gulp.watch("src/scss/foundation/*", ["sass"]);
//     gulp.watch("src/scss/layout/*", ["sass"]);
//     gulp.watch("src/scss/object/*", ["sass"]);
//     gulp.watch("src/scss/second/*", ["sass"]);
//     gulp.watch("src/js/*js", ["compress"])
//   });
