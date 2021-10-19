import store from "store";

// Host
export const host = "http://plumadmin.test/admin";

// 阿里字体图标库 https://at.alicdn.com/t/**.css
export const iconfontUrl = ``;

export const isDev = process.env.NODE_ENV==='development'

// 程序配置参数
export const app = store.get("__app__") || {
	name: "",
	logo:'',
	icon:'',
	bei_an:'',
	conf: {
		showAMenu: false, // 是否显示一级菜单栏
		showRouteNav: true, // 是否显示路由导航栏
		showProcess: true, // 是否显示页面进程栏
		customMenu: false // 自定义菜单
	},

	theme: {
		color: "", // 主题色
		url: "" // 主题样式地址
	}
};
