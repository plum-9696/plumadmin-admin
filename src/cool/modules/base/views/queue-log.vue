<template>
	<cl-crud ref="crud" @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />
			<el-button  v-permission="'log.queue@clear'"  type="danger" size="mini" @click="clear">清空</el-button>
		</el-row>

		<el-row>
			<cl-table v-bind="table"/>
		</el-row>
		<el-row type="flex">
			<cl-flex1></cl-flex1>
			<cl-pagination />
		</el-row>
	</cl-crud>
</template>

<script>
export default {
	name: "queue-log",
	data() {
		return {
			table: {
				"context-menu": false,
				columns: [
					{
						label: "队列名称",
						prop: "queue",
						width: 200
					},
					{
						label: "尝试次数",
						prop: "attempts",
						width: 200
					},
					{
						label: "延时",
						prop: "delay",
						width: 200
					},
					{
						label: "队列参数",
						prop: "data",
						"show-overflow-tooltip": true,
						"min-width": 300
					},
					{
						label: "时间",
						prop: "time",
						sortable: true,
						width: 200
					}
				]
			}
		};
	},
	methods: {
		onLoad({ app, ctx }) {
			ctx.service(this.$http.resource("log.queue"))
				.permission('log.queue')
				.done();
			app.refresh();
		},
		clear() {
			this.$confirm('改操作会清空队列，是否清空队列且重新入队','提示',{
				confirmButtonText:'重新入队',
				cancelButtonText:'直接清空'
			}).then(()=>{
				this.$http.post("log.queue/clear",{send:true})
					.then(() => {
						this.$message.success("已清空");
						this.$refs.crud.refresh()
					})
					.catch(error => {
						this.$message.error(error);
					});
			}).catch(()=>{
				this.$http.post("log.queue/clear",{send:false})
					.then(() => {
						this.$message.success("已清空");
						this.$refs.crud.refresh()
					})
					.catch(error => {
						this.$message.error(error);
					});
			})

		}
	}
};
</script>

<style scoped>

</style>
