const { resolve } = require( "path" );
const webpack = require( "webpack" );
const src = resolve( __dirname, "src" );
const pub = resolve( __dirname, "public" );
const isProd = process.env.NODE_ENV === "production";

module.exports = {
	  context: resolve( __dirname )
	, devServer: {
		  contentBase: "./public"
		, historyApiFallback: true
		, hot: true
		, overlay: false
		, stats: { colors: true }
	}
	, devtool: isProd ? "source-map" : "cheap-eval-source-map"
	, entry: isProd ? "./src/index.js" : [
		  "webpack-dev-server/client?http://127.0.0.1:8080"
		, "webpack/hot/only-dev-server"
		, "./src/index.js"
	]
	, externals: { child_process: "child_process" }
	, module: {
		rules: [
			{
				  include: src
				, test: /\.js$/
				, use: "babel-loader"
			}
			, {
				  loaders: "url-loader?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]"
				, test: /\.ttf/

			}
			, {
				  include: src
				, test: /\.p?css$/
				, use: [
					"style-loader"
					, {
						loader: "css-loader"
						, options: {
							  importLoaders: 1
							, localIdentName: "[local]__[hash:base64:9]"
						}
					}
					, "postcss-loader"
				]
			}
		]
	}
	, node: {
		  fs: "empty"
		, net: "empty"
		, tls: "empty"
	}
	, output: isProd ? {
		  filename: "bundle.js"
		, path: pub
	} : {
		  filename: "bundle.js"
		, path: pub
		, publicPath: "http://127.0.0.1:8080/"
	}
	, plugins: isProd ? [
		  new webpack.DefinePlugin( {
			"process.env": { NODE_ENV: JSON.stringify( "production" ) }
		  } )
		, new webpack.optimize.UglifyJsPlugin()
	] : [
		  new webpack.HotModuleReplacementPlugin()
		, new webpack.LoaderOptionsPlugin( { debug: true } )
	]
	, resolve: {
		extensions: [ ".js", ".css" ]
	}
	, target: "electron-main"
};
