import Crud from "@/cool/lib/cl-admin-crud";

export default {
	modules: [
		// 基础模块
		"base",
		{
			name: "crud",
			value: Crud,
			options: {
				crud: {
					dict: {
						sort: {
							prop: "order",
							order: "sort"
						}
					},
					table: {
						"context-menu": false
					},
					search: {
						keyWord: "keyWord",
						query: "query"
					},
				}
			}
		},
		// 复制指令
		"copy",
		// 省市区选择
		"distpicker",
		// 主题切换
		'theme',
		'upload'
	]
};
