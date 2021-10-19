<template>
	<div>
		<div :id="editorId"></div>
		<cl-space-upload @confirm="confirmImage" ref="image" :multiple="true" type="image" />
		<cl-space-upload @confirm="confirmVideo" ref="video" :multiple="true" type="video" />
	</div>
</template>

<script>

import WangEditor from "wangeditor";
import { registerUploadVideo, registerUploadImage } from "./menu/registerMenu";
import editorMenuConfig from "./menu/config";
import { uniqueId } from "lodash";

export default {
	name: "cl-editor",
	props: {
		value: String,
		height: [Number]
	},
	data() {
		return {
			editorId: uniqueId("editor"),
			editor: null
		};
	},
	mounted() {
		this.editor = new WangEditor("#" + this.editorId);
		// 注册视频菜单
		registerUploadVideo(this.editor, () => {
			this.$refs.video.open();
		});
		// 注册图片菜单
		registerUploadImage(this.editor, () => {
			this.$refs.image.open();
		});
		// 配置 菜单
		this.editor.config.menus = editorMenuConfig;
		// 配置zIndex
		this.editor.config.zIndex = 500;
		// 配置编辑高度
		this.height && (this.editor.config.height = this.height);
		//监听内容
		this.editor.config.onchange = html => {
			this.onChange(html);
		};
		this.editor.create();
		//初始化内容
		this.editor.txt.html(this.value);
	},
	watch: {
		value: {
			immediate: true,
			handler(val) {
				if (this.editor && this.editor.txt.html() !== val) {
					this.editor.txt.html(val);
				}
			}
		}
	},
	methods: {
		confirmImage(e) {
			e.forEach(item => {
				this.editor.txt.append(this.insertImage(item));
			});
		},
		confirmVideo(e) {
			e.forEach(item => {
				this.editor.txt.append(this.insertVideo(item));
			});
		},
		insertVideo({ url }) {
			return `
				<video controls  src="${url}" data-href="${url}" style="max-width:100%"/>
			`;
		},
		insertImage({ url, file_name }) {
			return `
				<img src="${url}" alt="${file_name}" data-href="${url}" style="max-width:100%" contenteditable="false" />
			`;
		},
		onChange(html) {
			this.$emit("input", html);
		}
	},
	// 及时销毁 editor
	beforeDestroy() {
		// 销毁编辑器
		this.editor.destroy();
		this.editor = null;
	}
};
</script>

<style scoped>

</style>
