import { app } from "@/config/env";
import { deepMerge, getBrowser } from "cl-admin/utils";
import store from "store";

const browser = getBrowser();

const changeIcon = function(icon){
	let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = icon;
	document.getElementsByTagName('head')[0].appendChild(link);
}

export default {
	state: {
		info: {
			...app
		},
		browser,
		collapse: browser.isMini ? true : false
	},
	getters: {
		// 应用配置
		app: state => state.info,
		// 浏览器信息
		browser: state => state.browser,
		// 左侧菜单是否收起
		menuCollapse: state => state.collapse
	},
	actions: {
		appLoad({ commit, getters, dispatch }) {
			//读取website数据
			dispatch('updateApp')
			if (getters.token) {
				// 读取菜单权限
				dispatch("permMenu");
				// 获取用户信息
				dispatch("userInfo");
			}
		},
		updateApp({commit,getters}){
			this.$http.post("common/website")
				.then(data => {
					commit("UPDATE_APP", data);
					changeIcon(getters.app.icon)
				});
		}
	},
	mutations: {
		// 设置浏览器信息
		SET_BROWSER(state) {
			state.browser = getBrowser();
		},

		// 收起左侧菜单
		COLLAPSE_MENU(state, val = false) {
			state.collapse = val;
		},

		// 更新应用配置
		UPDATE_APP(state, val) {
			deepMerge(state.info, val);
			store.set("__app__", state.info);
		}
	}
};
