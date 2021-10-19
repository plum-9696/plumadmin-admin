<template>
	<div class="cl-upload-space__wrap">
		<slot>
			<el-button v-if="showButton" size="mini" @click="open">点击上传</el-button>
		</slot>

		<!--转移-->
		<move @success="refresh" ref="groupMove" />

		<!-- 弹框 -->
		<cl-dialog
			title="文件空间"
			height="665px"
			width="1000px"
			keep-alive
			@close="close"
			:visible.sync="visible"
			:props="{
				'close-on-click-modal': false,
				'append-to-body': true,
				customClass: 'dialog-upload-space'
			}"
			:controls="['slot-expand', 'cl-flex1', 'fullscreen', 'close']"
		>
			<div class="cl-upload-space">
				<!-- 类目 -->
				<category v-model="category.id" @change="refresh()" />

				<!-- 内容 -->
				<div class="cl-upload-space__content">
					<!-- 操作栏 -->
					<div class="cl-upload-space__header scroller1">
						<el-button size="mini" @click="refresh()">刷新</el-button>

						<el-upload
							style="margin: 0 10px"
							action=""
							:accept="accept"
							:show-file-list="false"
							:http-request="customRequest"
						>
							<el-button size="mini" type="primary" :loading="uploadLoading">点击上传</el-button>
						</el-upload>

						<el-button
							type="success"
							size="mini"
							:disabled="!isSelected"
							@click="confirm()"
						>
							使用选中文件
						</el-button>

						<el-button
							type="danger"
							size="mini"
							:disabled="!isSelected"
							@click="remove()"
						>
							删除选中文件
						</el-button>


						<el-button
							type="warning"
							size="mini"
							:disabled="!isSelected"
							@click="move()"
						>
							转移
						</el-button>
					</div>

					<div class="cl-upload-space__search">
						<el-input size="mini" v-model="keyword" style="width: 300px" placeholder="请输入文件名称">
							<el-button @click="refresh({keyword})" slot="append" icon="el-icon-search"></el-button>
						</el-input>
					</div>

					<!-- 文件区域 -->
					<div
						class="cl-upload-space__file scroller1"

						v-loading="loading"
						element-loading-text="拼命加载中"
					>
						<!-- 文件列表 -->
						<template v-if="list.length > 0">
							<div class="cl-upload-space__file-list">
								<file-item
									v-for="item in list"
									:key="item.id"
									:value="item"
									@select="select"
									@remove="remove"
								></file-item>
							</div>
						</template>

						<!-- 空态 -->
						<el-empty style="margin-top: 100px" description="无文件" v-else></el-empty>
					</div>

					<!-- 分页 -->
					<div class="cl-upload-space__footer">
						<el-pagination
							background
							:page-size="pagination.size"
							:current-page="pagination.page"
							:total="pagination.total"
							@current-change="
								page => {
									refresh({ page });
								}
							"
						></el-pagination>
					</div>
				</div>
			</div>

			<!-- 展开按钮 -->
			<template #slot-expand>
				<button>
					<i
						class="el-icon-notebook-2"
						v-if="category.visible"
						@click="category.visible = false"
					></i>
					<i class="el-icon-arrow-left" v-else @click="category.visible = true"></i>
				</button>
			</template>
		</cl-dialog>
	</div>
</template>

<script>
import { isEmpty } from "cl-admin/utils";
import Category from "./group";
import Move from "./move";
import FileItem from "./fileItem";
import { mapGetters } from "vuex";
import Vue from "vue";
import { Empty } from "element-ui";
import { clone } from "@/utils";

Vue.use(Empty);
export default {
	name: "cl-space-upload",
	props: {
		// 上传的文件类型
		type: String,
		multiple: {
			type: Boolean,
			default: false
		},
		showButton:{
			type: Boolean,
			default: false
		},
	},
	components: {
		Category,
		FileItem,
		Move
	},
	provide() {
		return {
			space: this
		};
	},
	data() {
		return {
			keyword: "",
			uploadLoading: false,
			visible: false,
			loading: false,
			category: {
				id: null,
				visible: true
			},
			selection: [],
			list: [],
			pagination: {
				page: 1,
				size: 12,
				total: 0
			}
		};
	},
	computed: {
		...mapGetters(["browser"]),
		isSelected() {
			return !isEmpty(this.selection);
		},
		accept() {
			switch (this.type) {
				case "image":
					return "image/*";
				case "video":
					return "video/*";
				default:
					return "";
			}
		}
	},
	watch: {
		"browser.isMini": {
			immediate: true,
			handler(val) {
				this.category.visible = val ? false : true;
			}
		}
	},
	methods: {
		open() {
			this.visible = true;
		},
		close() {
			this.visible = false;
			this.clear();
		},
		clear() {
			this.selection = [];
		},
		// 刷新资源文件
		refresh(params) {
			// 清空选择
			this.clear();
			this.loading = true;
			this.$http.post("file/page", {
				...this.pagination,
				...params,
				group_id: this.category.id,
				file_type: this.type
			})
				.then(res => {
					this.pagination = res.pagination;
					this.list = res.list;
				})
				.done(() => {
					this.loading = false;
				});
		},
		// 确认选中
		confirm() {
			//添加状态
			const files = clone(this.selection).map(item=>{
				item['status'] = 'success';
				return item
			})
			this.$emit("confirm",files );
			this.close();
		},
		// 选择
		select(item) {
			const index = this.selection.findIndex(e => e.id === item.id);
			if (index >= 0) {
				this.selection.splice(index, 1);
			} else {
				if (this.multiple) {
					//多倍
					this.selection.push(item);
				} else {
					this.selection = [item];
				}
			}
		},
		move() {
			const ids = this.selection.map(e => e.id);
			this.$refs.groupMove.toMove(ids);
		},
		// 删除选中
		remove(...selection) {
			if (isEmpty(selection)) {
				selection = this.selection;
			}
			// 已选文件 id
			const ids = selection.map(e => e.id);
			this.$confirm("此操作将删除文件, 是否继续?", "提示", {
				type: "warning"
			})
				.then(() => {
					// 删除请求
					this.$http.post("file/delete", { ids })
						.then(() => {
							this.$message.success("删除成功");
							this.refresh();
						})
						.catch(err => {
							this.$message.error(err);
						});
				})
				.catch(() => null);
		},
		customRequest(e) {
			//上传
			let form = new FormData();
			form.append("file", e.file);
			form.append("group_id", this.category.id ? this.category.id : 0);
			this.uploadLoading = true;
			this.$http.post("file/upload", form)
				.then(res => {
					this.refresh();
				})
				.catch(error => {
					this.$message.error(error);
				})
				.finally(() => {
					this.uploadLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
.dialog-upload-space {
	.el-dialog {
		&__body {
			padding: 0 !important;
		}
	}
}
</style>

<style lang="scss" scoped>
.cl-upload-space {
	display: flex;
	height: 100%;
	box-sizing: border-box;
	background-color: #f7f7f7;
	padding: 5px;

	&__search {
		height: 35px;
	}

	&__content {
		flex: 1;
		max-width: 100%;
		padding: 0 10px;
		box-sizing: border-box;
		background-color: #fff;
		border-radius: 5px;
	}

	&__header {
		display: flex;
		align-items: center;
		height: 50px;
		overflow: auto hidden;
	}

	&__file {
		height: calc(100% - 135px);
		position: relative;

		&-list {
			display: flex;
			flex-wrap: wrap;
		}

		&-empty {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: calc(50% - 90px);
			left: calc(50% - 160px);

			/deep/ .cl-upload {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-radius: 6px;
				cursor: pointer;

				.el-upload-dragger {
					height: 180px;
					width: 320px;
				}

				i {
					font-size: 67px;
					color: #c0c4cc;
				}
			}
		}
	}

	&__footer {
		padding: 9px 0;
	}
}
</style>
