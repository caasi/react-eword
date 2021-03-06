require! {
  'path'
  'nib'
  'webpack'
  'webpack-dev-server': WebpackDevServer
  'gulp'
  'gulp-util': gutil
  'gulp-livescript': livescript
  'gulp-stylus': stylus
  'gulp-pug': pug
  'gh-pages': ghPages
}

# http://stackoverflow.com/questions/7697038/more-than-10-lines-in-a-node-js-stack-error
#Error.stackTraceLimit = Infinity

options =
  src:   path.resolve __dirname, './src'
  dist:  path.resolve __dirname, './dist'
  build: path.resolve __dirname, '.'

gulp.task \js ->
  gulp
    .src "#{options.src}/**/*.ls"
    .pipe livescript!
    .pipe gulp.dest options.dist

gulp.task \css ->
  gulp
    .src "#{options.src}/**/*.styl"
    .pipe stylus use: [nib!]
    .pipe gulp.dest options.dist

gulp.task \compile <[js css]>

gulp.task \webpack <[compile]> ->
  port = 8080
  host = 'localhost'
  config =
    devtool: \cheap-module-source-map
    entry:
      * "webpack-dev-server/client?http://#host:#port"
      * 'webpack/hot/dev-server'
      * './dist'
    output:
      path: __dirname # required for webpack-dev-server
      filename: 'bundle.js'
      publicPath: '/'
    plugins:
      * new webpack.HotModuleReplacementPlugin
      ...
    module:
      loaders:
        * test: /\.css$/ loader: \style!css
        * test: /\.js$/  loader: \react-hot exclude: /node_modules/
        ...
  webpack config
  server = new WebpackDevServer do
    webpack config
    publicPath: config.output.publicPath
    hot: true
  server.listen port, host, (err) ->
    throw gutil.PluginError '[webpack-dev-server]', err if err
    gutil.log "Listening at #host:#port"

gulp.task \build <[compile]> (done) ->
  config =
    entry:
      * './dist'
    output:
      path: __dirname
      filename: 'bundle.js'
      publicPath: '/'
    plugins:
      * new webpack.optimize.DedupePlugin
      * new webpack.optimize.UglifyJsPlugin do
          compress:
            warnings: off
          mangle: on
          comments: off
      * new webpack.optimize.OccurenceOrderPlugin
    module:
      loaders:
        * test: /\.css$/ loader: \style!css
        * test: /\.js$/  loader: \react-hot exclude: /node_modules/
        ...
  err, stats <- webpack config
  console.error err if err
  done err

gulp.task \deploy <[build]> (done) ->
  ghPages.publish do
    options.build
    src:
      * './index.html'
      * './bundle.js'
    done

gulp.task \html ->
  gulp
    .src "#{options.src}/*.jade"
    .pipe pug!
    .pipe gulp.dest options.build

gulp.task \watch <[html webpack]> ->
  gulp
    ..watch "#{options.src}/**/*.ls"    <[compile]>
    ..watch "#{options.src}/**/*.styl"  <[compile]>
    #..watch "#{options.src}/*.jade"     <[html]>

gulp.task \default <[watch]>
