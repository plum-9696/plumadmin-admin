<template>
	<cl-crud @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />
			<cl-add-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-search-key />
		</el-row>

		<el-row>
			<cl-table v-bind="table"> </cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1 />
			<cl-pagination />
		</el-row>

		<cl-upsert v-model="form" v-bind="upsert"></cl-upsert>
	</cl-crud>
</template>

<script>
export default {
	data() {
		return {
			form: {
				relevance: 1
			},
			upsert: {
				props: {
					width: "800px"
				},
				items: [
					{
						prop: "name",
						label: "名称",
						span: 12,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写名称"
							}
						},
						rules: {
							required: true,
							message: "名称不能为空"
						}
					},
					{
						prop: "remark",
						label: "备注",
						span: 24,
						component: {
							name: "el-input",
							props: {
								type: "textarea",
								rows: 4
							},
							attrs: {
								placeholder: "请填写备注"
							}
						}
					},
					{
						label: "功能权限",
						prop: "rule_ids",
						value: [],
						component: {
							name: "cl-role-perms"
						}
					},
					{
						label: "数据权限",
						prop: "dept_ids",
						value: [],
						component: {
							name: "cl-dept-check"
						}
					}
				]
			},
			table: {
				props: {
					"default-sort": {
						prop: "createTime",
						order: "descending"
					}
				},
				columns: [
					{
						type: "selection",
						align: "center",
						width: "60"
					},
					{
						prop: "name",
						label: "名称",
						align: "center",
						"min-width": 150
					},
					{
						prop: "remark",
						label: "备注",
						align: "center",
						"show-overflow-tooltips": true,
						"min-width": 150
					},
					{
						prop: "create_time",
						label: "创建时间",
						align: "center",
						sortable: "custom",
						"min-width": 150
					},
					{
						prop: "update_time",
						label: "更新时间",
						align: "center",
						sortable: "custom",
						"min-width": 150
					},
					{
						label: "操作",
						align: "center",
						type: "op"
					}
				]
			}
		};
	},

	methods: {
		onLoad({ ctx, app }) {
			ctx.service(this.$http.resource('role'))
				.permission('role')
				.done();
			app.refresh();
		}
	}
};
</script>
