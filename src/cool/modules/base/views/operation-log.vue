<template>
	<cl-crud ref="crud" @load="onLoad">
		<cl-dialog :visible.sync="visible" title="参数详情">
			<p>{{ trace.param }}</p>
		</cl-dialog>

		<el-row type="flex">
			<cl-refresh-btn />
			<cl-multi-delete-btn />
			<el-button v-permission="'log.operation@clear'" size="mini" type="primary" @click="clear">清空</el-button>
			<cl-flex1></cl-flex1>
			<cl-filter-group v-model="searchForm">
				<cl-filter label="操作时间">
					<el-date-picker
						size="mini"
						format="yyyy-MM-dd"
						value-format="yyyy-MM-dd"
						v-model="searchForm.time"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</cl-filter>
			</cl-filter-group>
		</el-row>

		<!--表格-->
		<el-row>
			<cl-table v-bind="table">
				<template #slot-trace="{scope}">
					<el-button type="text" @click="handleTrace(scope.row)">参数详情</el-button>
				</template>
			</cl-table>
		</el-row>

		<el-row type="flex">
			<cl-flex1></cl-flex1>
			<cl-pagination />
		</el-row>
	</cl-crud>
</template>

<script>
export default {
	name: "debug-log",
	data() {
		return {
			visible: false,
			searchForm: {
				message: "",
				time: []
			},
			trace: {},
			table: {
				"context-menu": ["refresh", "check", "delete"],
				columns: [
					{
						type: "selection"
					},
					{
						label: "操作行为",
						prop: "message",
						"min-width": 300,
						"show-overflow-tooltip": true
					},
					{
						label: "操作路由",
						prop: "route",
						"min-width": 200,
						"show-overflow-tooltip": true
					},
					{
						label: "IP地址",
						prop: "ip",
						width: 150
					},
					{
						label: "操作人员",
						prop: "operator",
						width: 150
					},
					{
						label: "操作时间",
						prop: "create_time",
						sortable: true,
						width: 240
					},
					{
						type: "op",
						label: "操作",
						buttons: ["slot-trace", "delete"]
					}
				]
			}
		};
	},
	computed: {
		traceArr() {
			if (this.trace.trace) {
				let trace = this.trace.trace.split("#");
				trace.shift();
				return trace;
			}
			return [];
		}
	},
	methods: {
		onLoad({ app, ctx }) {
			ctx.service(this.$http.resource("log.operation"))
				.permission('log.operation')
				.done();
			app.refresh();
		},
		handleTrace(e) {
			this.trace = e;

			this.visible = true;
		},
		clear() {
			this.$http.post("log.operation/clear")
				.then(() => {
					this.$refs.crud.refresh();
					this.$message.success("操作日志已清空");
				})
				.catch(error => {
					this.$message.error(error);
				});
		}
	}
};
</script>

<style scoped>

</style>
