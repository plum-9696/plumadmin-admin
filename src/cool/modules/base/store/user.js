import { storage, href } from "@/utils";

// 用户信息
let info = storage.get("userInfo") || {};
// 授权标识
let token = storage.get("token") || null;

export default {
	state: {
		token,
		info
	},
	getters: {
		userInfo: state => state.info,
		token: state => state.token
	},
	actions: {
		// 用户登录
		userLogin({ commit }, form) {
			return this.$http.post("admin/login", form)
				.then(res => {
					commit("SET_TOKEN", res);
					return res;
				});
		},

		// 用户退出
		userLogout({ dispatch }) {
			return new Promise(resolve => {
				this.$http.post('admin/logout')
					.done(()=>{
						dispatch("userRemove").then(() => {
							resolve();
						});
					})
			});
		},

		// 用户信息
		userInfo({ commit }) {
			return this.$http.post("admin/userinfo")
				.then(res => {
					commit("SET_USERINFO", res);
					return res;
				});
		},

		// 用户移除
		userRemove({ commit }) {
			commit("CLEAR_USER");
			commit("CLEAR_TOKEN");
			commit("RESET_PROCESS");
			commit("SET_MENU_GROUP", []);
			commit("SET_VIEW_ROUTES", []);
			commit("SET_MENU_LIST", 0);
		},

		// 刷新token
		refreshToken({ commit, dispatch }) {
			return new Promise((resolve, reject) => {
				this.$http.post('admin/refreshToken',{refresn_token:storage.get("refreshToken")})
					.then(res=>{
						commit("SET_TOKEN", res);
						resolve(res.token);
					})
					.catch(err => {
						dispatch("userRemove");
						href("/login");
						reject(err);
					});
			});
		}
	},
	mutations: {
		// 设置用户信息
		SET_USERINFO(state, val) {
			state.info = val;
			storage.set("userInfo", val);
		},

		// 设置授权标识
		SET_TOKEN(state, { token, expire, refresh_token, refresh_expire }) {
			// 请求的唯一标识
			state.token = token;
			storage.set("token", token, expire);

			// 刷新 token 的唯一标识
			storage.set("refreshToken", refresh_token, refresh_expire);
		},

		// 移除授权标识
		CLEAR_TOKEN(state) {
			state.token = null;
			storage.remove("token");
			storage.remove("refreshToken");
		},

		// 移除用户信息
		CLEAR_USER(state) {
			state.info = {};
			storage.remove("userInfo");
		}
	}
};
