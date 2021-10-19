<template>
	<div>
		<!--多文件-->
		<vuedraggable  animation="300"   v-model="files" filter="disabled-sort" @sort="output" class="file-list" v-if="multiple">
			<div class="file-item preview" v-for="(item,index) in files" :key="index">
				<div class="file-item-mask">
					<i class="icon el-icon-zoom-in" @click.stop="previewFile(item)"></i>
					<i class="icon el-icon-delete" @click.stop="deleteFile(index)"></i>
				</div>
				<file-item :file="item"></file-item>
			</div>
			<cl-space-upload class="disabled-sort" ref="spaceUpload" @confirm="insertFile" :multiple="multiple"
							 v-if="!limit || files.length<limit"  :type="type">
				<div class="file-item button" @click="$refs.spaceUpload.open()">
					<div class="upload-tips">
						<i class="el-icon-upload"></i>
						<span>{{ uploadButtonText }}</span>
					</div>
					<div v-if="multiple && limit">{{ limitTips }}</div>
				</div>
			</cl-space-upload>
		</vuedraggable>

		<!--单文件-->
		<div class="file-list" v-else>
			<div class="file-item preview" v-for="(item,index) in files" :key="index" @click="$refs.spaceUpload.open()">
				<div class="file-item-mask">
					<i class="icon el-icon-zoom-in" @click.stop="previewFile(item)"></i>
					<i class="icon el-icon-delete" @click.stop="deleteFile(index)"></i>
				</div>
				<file-item :file="item"></file-item>
			</div>
			<cl-space-upload ref="spaceUpload" @confirm="insertFile" :multiple="multiple" :type="type" >
				<div v-if="files.length===0" class="file-item button" @click="$refs.spaceUpload.open()">
					<div class="upload-tips">
						<i class="el-icon-upload"></i>
						<span>{{ uploadButtonText }}</span>
					</div>
					<div v-if="multiple && limit">{{ limitTips }}</div>
				</div>
			</cl-space-upload>
		</div>


		<preview ref="preview"></preview>
	</div>
</template>

<script>

import * as vuedraggable from "vuedraggable";
import fileItem from "./fileItem";
import clSpaceUpload from "./space/index";
import { isArray, clone } from "@/utils";
import preview from "./preview";

export default {
	name: "cl-upload",
	components: { vuedraggable, fileItem, clSpaceUpload, preview },
	props: {
		value: [Array, String, Number],
		type: {
			type: String,
			default: "file",
			validator(val) {
				return ["file", "image", "video"].includes(val);
			}
		},
		limit: [String, Number],
		multiple: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			files: []
		};
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.entry(val);
			}
		}
	},
	computed: {
		uploadButtonText() {
			switch (this.type) {
				case "image":
					return "上传图片";
				case "video":
					return "上传视频";
				case "file":
					return "上传文件";
			}
		},
		limitTips() {
			return `(${this.files.length}/${this.limit})`;
		}
	},
	methods: {
		output() {
			if (this.multiple) {
				const ids = this.files.map(e => e.id);
				this.$emit("input", ids);
			} else {
				const id = this.files.length === 0 ? undefined : this.files[0].id;
				this.$emit("input", id);
			}
		},
		//构建数组
		builder(val) {
			//默认转换成数组类型
			if (!isArray(val)) {
				return val ? [val] : [];
			}
			return val;
		},
		//是否有改动
		isChange(val) {
			val = clone(val);
			return val.sort().join() !== this.files.map(e => e.id).sort().join();
		},
		//插入
		entry(val) {
			//构建成数组
			let value = this.builder(val);
			//有变动,获取服务器数据,插入渲染
			if (this.isChange(value)) {
				//获取服务器的数据
				this.getData(value)
					.then(data => {
						//进行渲染
						this.files = data;
					})
					.catch(error => {
						this.$message.error(error);
					});
			}
		},
		async getData(ids) {
			return await this.$http.post("file/listByIds", { ids });
		},
		previewFile(file) {
			this.$refs.preview.open(file);
		},
		deleteFile(index) {
			this.files.splice(index, 1);
			this.output();
		},
		insertFile(file) {
			if (this.multiple) {
				if (this.limit) {
					//限制数量
					let length = this.limit - this.files.length;
					if (length < 0) {
						length = 0;
					}
					this.files.push(...file.slice(0, length));
				} else {
					//无限制数量
					this.files.push(...file);
				}
			} else {
				//直接替换,单文件
				this.files = file;
			}
			this.output();
		}
	}
};
</script>

<style scoped lang="scss">
.file-item {
	width: 148px;
	height: 148px;
	border-radius: 6px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-size: 14px;

	&.button {
		border: 1px dashed #d9d9d9;
		color: #8C939D;

		.upload-tips {
			display: flex;
			justify-content: center;
			align-items: center;

			.el-icon-upload {
				font-size: 28px;
			}
		}

		&:hover {
			border-color: #4165d7;
			color: #4165d7;
		}
	}

	&.preview {
		border: 1px solid #d9d9d9;
		color: #8C939D;
		overflow: hidden;
		position: relative;

		&:hover .file-item-mask {
			display: flex;
		}

		.file-item-mask {
			position: absolute;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, .4);
			z-index: 10;
			display: none;
			justify-content: center;
			align-items: center;
			color: #ffffff;
			font-size: 22px;

			.icon {
				margin: 0 5px;
				cursor: pointer;
			}
		}
	}

	&:not(:last-child) {
		margin-right: 10px;
	}

}

.file-list {
	display: flex;
	flex-wrap: wrap;
	cursor: default;
	user-select: none;
}
</style>
