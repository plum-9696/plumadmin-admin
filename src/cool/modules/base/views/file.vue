<template>
	<cl-crud @load="onLoad">
		<el-row type="flex">
			<cl-refresh-btn />
			<cl-multi-delete-btn />
			<cl-flex1 />
			<cl-filter-group v-model="searchForm">
				<cl-filter label="文件分组">
					<cl-file-group-tree v-model="searchForm.group_id" placeholder="请选择文件分组" />
				</cl-filter>
				<cl-filter label="文件类型">
					<el-select size="mini" v-model="searchForm.file_type" placeholder="请选择文件类型">
						<el-option label="图片" value="image"></el-option>
						<el-option label="视频" value="video"></el-option>
						<el-option label="文件" value="file"></el-option>
					</el-select>
				</cl-filter>
				<cl-filter label="文件名">
					<el-input size="mini" placeholder="请输入文件名" v-model="searchForm.keyword"></el-input>
				</cl-filter>
			</cl-filter-group>
		</el-row>
		<el-row>
			<cl-table v-bind="table">
				<template #column-preview="{scope}">
					<el-image v-if="typeEnum[scope.row.file_type]==='image'" :preview-src-list="[scope.row.url]"
							  style="width: 60px;height:60px"
							  :src="scope.row.url"></el-image>
					<video v-if="typeEnum[scope.row.file_type]==='video'" style="width: 60px;height:60px"
						   :src="scope.row.url"></video>
					<img src="@/assets/icon/file.png" style="width: 60px;height:60px"
						 v-if="typeEnum[scope.row.file_type]==='file'" />
				</template>

				<template #slot-cat="{scope}">
					<el-button size="mini" type="text" @click="catLink(scope.row.url)">查看链接</el-button>
				</template>
			</cl-table>
		</el-row>
		<el-row type="flex">
			<cl-flex1></cl-flex1>
			<cl-pagination></cl-pagination>
		</el-row>
	</cl-crud>
</template>

<script>
import ClFileGroupTree from "@/cool/modules/base/components/file-group/tree";
export default {
	name: "file",
	components: { ClFileGroupTree },
	data() {
		return {
			searchForm: {
				file_type: undefined,
				keyword: undefined,
				group_id: undefined
			},
			typeEnum: ["", "image", "video", "file"],
			table: {
				"context-menu": ["refresh", "delete", "check"],
				columns: [
					{
						type: "selection",
						align: "center",
						width: 60
					}
					, {
						prop: "id",
						label: "文件ID",
						"min-width": 80
					},
					{
						prop: "preview",
						label: "文件预览",
						"min-width": 150
					},
					{
						prop: "file_name",
						label: "文件名称",
						"min-width": 150,
						"show-overflow-tooltip": true
					},
					{
						prop: "storage",
						label: "存储方式",
						dict: [
							{
								label: "本地",
								value: "local"
							},
							{
								label: "阿里云",
								value: "aliyun"
							},
							{
								label: "七牛云",
								value: "qiniu"
							},
							{
								label: "腾讯云",
								value: "qcloud"
							}
						]
					},
					{
						prop: "file_type",
						label: "文件类型",
						"min-width": 150,
						dict: [
							{
								label: "图片",
								value: 1
							},
							{
								label: "视频",
								value: 2
							},
							{
								label: "文件",
								value: 3
							}
						]
					},
					{
						prop: "file_size",
						label: "文件大小",
						sortable: true,
						"min-width": 150
					},
					{
						prop: "file_ext",
						label: "文件后缀",
						"min-width": 150
					},
					{
						prop: "create_time",
						label: "上传时间",
						sortable: true,
						"min-width": 150
					},
					{
						type: "op",
						buttons: ["slot-cat", "delete"]
					}
				]
			}
		};
	},
	methods: {
		onLoad({ ctx, app }) {
			ctx.service(this.$http.resource("file"))
				.permission('file')
				.done();
			app.refresh();
		},
		catLink(link) {
			this.$alert(`<p style="word-break:break-word;">${link}</p>`, "查看链接", {
				dangerouslyUseHTMLString: true
			});
		}
	}
};
</script>


<style scoped>

</style>
