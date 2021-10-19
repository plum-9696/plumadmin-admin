const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
	publicPath: "/",
	lintOnSave: false,
	productionSourceMap: false,
	parallel: require("os").cpus().length > 1,

	css: {
		extract: isProduction,
		sourceMap: false,
		loaderOptions: {
			sass: {
				prependData: `@import "@/assets/css/common.scss";`
			}
		}
	},

	devServer: {
		port: 9000,
		open: false,
		compress: false,
		overlay: {
			warnings: false,
			errors: true
		},
		disableHostCheck: true
	},

	chainWebpack: config => {
		// 设置 svg
		config.module.rule("svg").uses.clear();

		config.module
			.rule("svg-sprite-loader")
			.test(/.svg$/)
			.exclude.add(/node_modules/)
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "[name]"
			});

		// 生产模式下
		if (isProduction) {
			// 去掉元素之间空格
			config.module
				.rule("vue")
				.use("vue-loader")
				.loader("vue-loader")
				.tap(options => {
					options.compilerOptions.preserveWhitespace = true;
					return options;
				})
				.end();

			// 移除 prefetch 插件
			config.plugins.delete("prefetch-index");

			// 移除 preload 插件，避免加载多余的资源
			config.plugins.delete("preload-index");

			config.optimization.minimizer("terser").tap(args => {
				// 去掉注释
				args[0].terserOptions.output = {
					comments: false
				};
				return args;
			});

			// 分割模块
			config.optimization.splitChunks({
				chunks: "all",
				maxInitialRequests: Infinity,
				minSize: 300000,
				automaticNameDelimiter: "-",
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name(module) {
							const packageName = module.context.match(
								/[\\/]node_modules[\\/](.*?)([\\/]|$)/
							)[1];
							return `chunk.${packageName.replace("@", "")}`;
						},
						priority: 10
					}
				}
			});
		}
	},

	configureWebpack: config => {
		// 构建缓存
		config.plugins.push(new HardSourceWebpackPlugin());
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: "javascript/auto"
		});

	}
};
