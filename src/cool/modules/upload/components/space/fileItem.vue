<template>

	<div
		class="cl-upload-space-item"
		:class="[`is-${value.file_type}`]"
		@click.stop.prevent="select"
		@contextmenu.stop.prevent="openContextMenu"
	>
		<el-tooltip class="item" effect="dark" :content="value.file_name" placement="top">

			<!-- 图片 -->
			<template v-if="value.file_type === 'image'">
				<el-image style="width: 100%;height:100%" fit="cover" :src="value.url" lazy></el-image>
			</template>

			<!-- 视频 -->
			<template v-else-if="value.file_type === 'video'">
				<video
					controls
					:src="value.url"
					:style="{
						'max-height': '100%',
						'max-width': '100%'
					}"
				></video>
			</template>

			<!-- 文件 -->
			<template v-else>
				<div class="file-item">
					<img src="@/assets/icon/file.png" />
					<span>{{ value.file_name }}</span>
				</div>
			</template>
		</el-tooltip>


		<!-- 大小 -->
		<div class="cl-upload-space-item__size"></div>

		<!-- 遮罩层 -->
		<div class="cl-upload-space-item__mask" v-if="isSelected">
			<span>{{ index + 1 }}</span>
		</div>
	</div>

</template>

<script>
export default {
	name: "cl-upload-space-item",
	props: {
		value: Object
	},
	inject: ["space"],
	computed: {
		index() {
			return this.space.selection.findIndex(e => e.id === this.value.id);
		},
		isSelected() {
			return this.index >= 0;
		}
	},
	methods: {
		select() {
			this.$emit("select", this.value);
		},
		remove() {
			this.$emit("remove", this.value);
		},
		openContextMenu(e) {
			this.$crud.openContextMenu(e, {
				list: [
					{
						label: this.isSelected ? "取消选中" : "选中",
						"suffix-icon": this.isSelected ? "el-icon-close" : "el-icon-check",
						callback: (_, done) => {
							this.select();
							done();
						}
					},
					{
						label: "删除",
						"suffix-icon": "el-icon-delete",
						callback: (_, done) => {
							this.remove();
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
.cl-upload-space-item {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 160px;
	width: 160px;
	max-width: calc(50% - 10px);
	cursor: pointer;
	position: relative;
	border-radius: 3px;
	box-sizing: border-box;
	border: 1px solid #eee;
	margin: 5px 10px 5px 0;

	&.is-image {
		overflow: hidden;
	}

	&.is-video {
		video {
			max-height: 100%;
			width: 100%;
		}
	}

	&__size {
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.3);
	}

	&__error {
		padding: 10px;
		color: red;
	}

	&__mask {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.3);

		span {
			position: absolute;
			right: 10px;
			top: 10px;
			background-color: #67c23a;
			color: #fff;
			display: inline-block;
			height: 20px;
			width: 20px;
			text-align: center;
			line-height: 20px;
			border-radius: 20px;
		}
	}
}

.file-item {
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	span {
		margin-top: 20px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 80%;
	}

	img {
		width: 80px;
		height: 80px;
	}
}
</style>
