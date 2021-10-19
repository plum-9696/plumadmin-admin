<template>
	<div class="cl-dept-move"></div>
</template>

<script>

export default {
	methods: {
		async toMove(ids) {
			this.$crud.openForm({
				title: "分组转移",
				width: "600px",
				props: {
					"label-width": "80px"
				},
				items: [
					{
						label: "选择分组",
						prop: "dept",
						component: {
							name: "upload-group-move",

							data() {
								return {
									list: []
								};
							},

							async created() {
								this.list = await this.$http.post("file.group/tree");
							},

							methods: {
								selectRow(e) {
									this.$emit("input", e);
								}
							},

							render() {
								return (
									<div
										style={{
											border: "1px solid #eee",
											"border-radius": "3px",
											padding: "2px"
										}}>
										<el-tree
											data={this.list}
											{...{
												props: {
													props: {
														label: "name"
													}
												}
											}}
											default-expand-all
											node-key="id"
											highlight-current
											on-node-click={this.selectRow}></el-tree>
									</div>
								);
							}
						}
					}
				],
				on: {
					submit: (data, { done, close }) => {
						if (!data.dept) {
							this.$message.warning("请选择分组");
							return done();
						}

						const { name, id } = data.dept;

						this.$confirm(`是否将文件转移到分组 ${name} 下`, "提示", {
							type: "warning"
						})
							.then(() => {
								this.$http.post("file/moveGroup", {
									group_id: id,
									ids
								}).then(res => {
									this.$message.success("转移成功");
									this.$emit("success", res);
									close();
								})
									.catch(err => {
										this.$message.error(err);
										this.$emit("error", err);
										done();
									});
							})
							.catch(() => {
							});
					}
				}
			});
		}
	}
};
</script>
