import VueRouter from "vue-router";
import { Message } from "element-ui";
import store from "@/store";
import router, { ignore } from "@/router";
import storage from "@/utils/storage";


// 解决相同路径报错问题
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error => error);
};

const changeTitle = function(title) {
	document.title = store.getters.app.name;
	if (title) {
		document.title = store.getters.app.name + " - " + title;
	}
};

export default function() {
	router.$plugin = {
		addViews: (list, options) => {
			if (!options) {
				options = {};
			}

			// Parse route config
			list.map(e => {
				if (!e.component) {
					let url = e.viewPath;

					if (url) {
						if (
							/^(http[s]?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i.test(
								url
							)
						) {
							e.meta.iframeUrl = url;
							e.component = () =>
								import(`@/cool/modules/base/pages/iframe/index.vue`);
						} else {
							e.component = () => import(`@/${url}`);
						}
					} else {
						e.redirect = "/404";
					}
				}
			});

			// Batch add route
			list.forEach(e => {
				router.addRoute("index", e);
			});

			// Add 404 rule
			if (!options.ignore404) {
				router.addRoute({
					path: "*",
					redirect: "/404"
				});
			}
		},

		to: url => {
			if (router.path != url) {
				router.push(url);
			}
		}
	};

	router.beforeEach((to, from, next) => {
		const { token, browser } = store.getters;
		//切换名称
		changeTitle(to.name)

		if (token) {
			if (to.path.indexOf("/login") === 0) {
				// 登录成功且 token 未过期，回到首页
				if (!storage.isExpired("token")) {
					return next("/");
				}
			} else {
				// 添加路由进程
				store.commit("ADD_PROCESS", {
					label: (to.meta && to.meta.label) || to.name,
					value: to.fullPath
				});
			}
		} else {
			if (!ignore.token.some(e => to.path.indexOf(e) === 0)) {
				return next("/login");
			}
		}

		// H5 下关闭左侧菜单
		if (browser.isMobile) {
			store.commit("COLLAPSE_MENU", true);
		}

		next();
	});

	let lock = false;

	router.onError(err => {
		if (!lock) {
			lock = true;

			if (err.code == "MODULE_NOT_FOUND") {
				console.error(err.message.replace("Cannot find module ", ""), "路由组件不存在");

				Message.error(`路由组件路径错误`);
			} else {
				console.error(err);
			}

			setTimeout(() => {
				lock = false;
			}, 0);
		}
	});
}
