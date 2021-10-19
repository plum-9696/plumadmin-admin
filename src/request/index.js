import axios from "./request";
import Vue from "vue";
import store from "@/store";


const http = {
	...axios,
	resource(route) {
		return {
			page: (data) => {
				return this.request({
					url: `/${route}/page`,
					method: "POST",
					data
				});
			},

			info: (params) => {
				return this.request({
					url: `/${route}/info`,
					params
				});
			},

			update: (data) => {
				return this.request({
					url: `/${route}/update`,
					method: "POST",
					data
				});
			},

			delete: (data) => {
				return this.request({
					url: `/${route}/delete`,
					method: "POST",
					data
				});
			},

			add: (data) => {
				return this.request({
					url: `/${route}/create`,
					method: "POST",
					data
				});
			}
		};
	}
};

Vue.prototype.$http = store.$http = http;
