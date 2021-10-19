import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import { host } from "@/config/env";
import { href, storage } from "@/utils";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

axios.defaults.timeout = 30000;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = host;


NProgress.configure({
	showSpinner: false
});

// 忽略规则
const ignore = {
	NProgress: [],
	token: ["/login", "/captcha"]
};

// 请求队列
let requests = [];

// Token 是否刷新中
let isRefreshing = false;

// Request
axios.interceptors.request.use(
	config => {
		const token = store.getters.token || "";

		if (config.url) {
			if (!ignore.token.some(e => config.url.includes(e))) {
				config.headers["Authorization"] = "bearer " + token;
			}

			if (!ignore.NProgress.some(e => config.url.includes(e))) {
				NProgress.start();
			}
		}

		// 验证 token
		if (token) {
			if (config.url.includes("refreshToken")) {
				return config;
			}

			// 判断 token 是否过期
			if (storage.isExpired("token")) {
				// 判断 refreshToken 是否过期
				if (storage.isExpired("refreshToken")) {
					store.dispatch("userRemove");
					return href("/login");
				}

				// 是否在刷新中
				if (!isRefreshing) {
					isRefreshing = true;
					store.dispatch("refreshToken").then(token => {
						requests.forEach(cb => cb(token));
						requests = [];
						isRefreshing = false;
					});
				}
				return new Promise(resolve => {
					// 继续请求
					requests.push(token => {
						// 重新设置 token
						config.headers["Authorization"] = "bearer " + token;
						resolve(config);
					});
				});
			}
		}

		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// Response
axios.interceptors.response.use(
	async res => {
		NProgress.done();
		const { code, data, message } = res.data;
		if (typeof res.data === "string") {
			return Promise.reject(" 服务异常");
		}
		if (code === 10000) {
			return data;
		} else if (code === 10401) {
			//token失效
			await store.dispatch("userRemove");
			href("/login");
		}else if(code === 10403){
			//无权限
			href("/403");
		}else if(code === 10001){
			//账户被禁用
			Message.error(message);
			await store.dispatch("userRemove");
			href("/login");
		}else if(code === 10500){
			//服务器500
			href("/500");
		}
		return Promise.reject(message);
	},
	async error => {
		NProgress.done();
		href("/500");
		return Promise.reject(error.message);
	}
);

export default axios;
