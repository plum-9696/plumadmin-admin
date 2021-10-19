<template>
	<div>
		<el-image style="width: 100%;height: 100%" :src="file.url" v-if="file.file_type==='image'"></el-image>
		<div class="file" v-if="file.file_type==='video'">
			<video
				:src="file.url"
				:style="{
						'max-height': '100%',
						'max-width': '100%'
					}"
			></video>
		</div>
		<div class="file" v-if="file.file_type==='file'">
			<img src="@/assets/icon/file.png" />
			<span>{{ file.file_name }}</span>
		</div>
		<div class="error" v-else-if="file.status && file.status==='error'">
			文件已删除
		</div>
	</div>
</template>

<script>
export default {
	name: "fileItem",
	props: ["file"],
};
</script>

<style scoped lang="scss">
.file {
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
		width: 90%;
	}

	img {
		width: 70px;
		height: 70px;
	}
}
</style>
