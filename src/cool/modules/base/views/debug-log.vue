<template>
	<cl-crud ref="crud" @load="onLoad">
		<cl-dialog :visible.sync="visible" title="跟踪信息">
			<el-row>
				<el-col :span="5" align="right">请求方法</el-col>
				<el-col :span="18" :offset="1">{{ trace.method }}</el-col>
			</el-row>
			<el-row style="margin-top: 30px">
				<el-col :span="5" align="right">请求头</el-col>
				<el-col :span="18" :offset="1">{{ trace.header }}</el-col>
			</el-row>
			<el-row style="margin-top: 30px">
				<el-col :span="5" align="right">参数</el-col>
				<el-col :span="18" :offset="1">{{ trace.param }}</el-col>
			</el-row>
			<el-row style="margin-top: 30px">
				<el-col :span="5" align="right">trace</el-col>
				<el-col :span="18" :offset="1">
					<p style="margin-bottom: 5px" v-for="(item,index) in traceArr" :key="index">{{ item }}</p>
				</el-col>
			</el-row>
		</cl-dialog>

		<el-row type="flex">
			<cl-refresh-btn />
			<cl-multi-delete-btn />
			<el-button v-permission="'log.debug@clear'" size="mini" type="primary" @click="clear">清空</el-button>
			<cl-flex1></cl-flex1>
			<cl-filter-group v-model="searchForm">
				<cl-filter label="记录时间">
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
				<template #column-file="{scope}">
					{{ scope.row.file }} 【{{ scope.row.line }}】
				</template>

				<template #slot-trace="{scope}">
					<el-button type="text" @click="handleTrace(scope.row)">跟踪信息</el-button>
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
						label: "错误信息",
						prop: "message",
						"min-width": 300,
						"show-overflow-tooltip": true
					},
					{
						label: "错误文件",
						prop: "file",
						"min-width": 200,
						"show-overflow-tooltip": true
					},
					{
						label: "请求方法",
						prop: "method",
						width: 100
					},
					{
						label: "记录时间",
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
			ctx.service(this.$http.resource("log.debug"))
				.permission("log.debug")
				.done();
			app.refresh();
		},
		handleTrace(e) {
			this.trace = e;

			this.visible = true;
		},
		clear() {
			this.$http.post("log.debug/clear")
				.then(() => {
					this.$refs.crud.refresh();
					this.$message.success("错误日志已清空");
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
