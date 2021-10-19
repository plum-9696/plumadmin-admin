<template>
	<div
		class="cl-upload-space-category"
		:class="{
			'is-position': browser.isMini,
			'is-show': space.category.visible
		}"
	>
		<div class="cl-upload-space-category__search">
			<el-button type="primary" size="mini" @click="edit()">添加分类</el-button>

			<el-input v-model="keyword" placeholder="输入关键字过滤" size="mini"></el-input>
		</div>
		<div class="cl-upload-space-category__list">
			<ul class="scroller1">
				<el-tree
					ref="tree"
					default-expand-all
					highlight-current
					node-key="id"
					:expand-on-click-node="false"
					:data="list"
					:props="{label:'name'}"
					filter-node-method="filterNode"
					:filterNodeMethod="filterNode"
					@node-contextmenu="openContextMenu"
					@node-click="select"
				></el-tree>
			</ul>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { isEmpty } from "cl-admin/utils";

export default {
	name: "cl-upload-space-category",

	props: {
		value: [Number]
	},

	inject: ["space"],

	data() {
		return {
			list: [],
			current: undefined,
			keyword: ""
		};
	},

	computed: {
		...mapGetters(["browser"]),
	},

	watch: {
		current: {
			handler(id) {
				this.$emit("input", id);
				this.$emit("change", id);
			}
		},
		keyword:{
			handler(val){
				this.$refs.tree.filter(val)
			}
		}
	},

	created() {
		this.refresh();
	},

	methods: {
		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},
		// 刷新分类
		refresh() {
			return this.$http.post("file.group/tree").then(res => {
				res.unshift({
					name: "全部文件",
					id: null
				});

				this.list = res;

				if (!isEmpty(res)) {
					if (!this.current) {
						this.current = res[0].id;
					}
				}
			});
		},

		// 编辑分类
		edit(item = {}) {
			this.$crud.openForm({
				title: "添加分类",
				width: "400px",
				items: [
					{
						label: "分类名称",
						prop: "name",
						value: item.name,
						component: {
							name: "el-input",
							attrs: {
								placeholder: "请填写分类名称"
							}
						},
						rules: {
							required: true,
							message: "分类名称不能为空"
						}
					}
				],
				on: {
					submit: (data, { done, close }) => {
						let next = null;
						if (!item.id) {
							next = this.$http.post("file.group/create", {
								...data,
								parent_id: item.parent_id || 0
							});
						} else {
							next = this.$http.post("file.group/update", {
								...data,
								id: item.id
							});
						}

						next.then(() => {
							this.refresh();
							close();
						}).catch(err => {
							this.$message.error(err);
							done();
						});
					}
				}
			});
		},

		// 选择类目
		select(data) {
			this.current = data.id;

			// 小屏幕下收起左侧类目
			if (this.browser.isMini) {
				this.space.category.visible = false;
			}
		},

		// 打开类目列表右键菜单
		openContextMenu(e,data,node) {
			if (!data.id) {
				return false;
			}
			this.$crud.openContextMenu(e, {
				list: [
					{
						label: "刷新",
						"suffix-icon": "el-icon-refresh",
						callback: (_, done) => {
							this.refresh();
							done();
						}
					},
					{
						label: "新增",
						"suffix-icon": "el-icon-plus",
						callback: (item, done) => {
							this.edit({ parent_id: data.id });
							done();
						}
					},
					{
						label: "编辑",
						"suffix-icon": "el-icon-edit",
						callback: (_, done) => {
							this.edit({ id:data.id, name:data.name });
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (_, done) => {
							this.$confirm(`此操作将删除【${data.name}】下的文件, 是否继续?`, "提示", {
								type: "warning"
							})
								.then(() => {
									this.$http.post("file.group/delete", {
										ids: [data.id]
									}).then(() => {
										this.$message.success("删除成功");
										this.refresh();
									}).catch(err => {
											this.$message.error(err);
										});
								})
								.catch(() => null);

							done();
						}
					}
				]
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.cl-upload-space-category {
	height: 100%;
	width: 0;
	background-color: #fff;
	overflow: hidden;
	transition: width 0.2s ease-in-out;
	border-radius: 5px;

	&.is-show {
		width: 250px;
		margin-right: 5px;
	}

	&.is-position {
		position: absolute;
		left: 5px;
		top: 51px;
		height: calc(100% - 56px);
		z-index: 3000;

		&.is-show {
			width: calc(100% - 10px);
		}
	}

	&__search {
		display: flex;
		align-items: center;
		padding: 10px;

		.el-button {
			margin-right: 10px;
		}
	}

	&__list {
		height: calc(100% - 48px);
		padding: 0 10px;

		ul {
			height: 100%;

			li {
				list-style: none;
				font-size: 14px;
				height: 40px;
				line-height: 40px;
				border-bottom: 1px dashed #eee;
				padding: 0 10px;
				cursor: pointer;

				&.is-active {
					color: $color-primary;
				}

				&:hover {
					background-color: #f7f7f7;
				}
			}
		}
	}
}
</style>
