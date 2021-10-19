<template>
	<cl-dialog :visible.sync="visible" title="预览" @close="close">
		<div style="display: flex;justify-content: center">
			<el-image v-if="type==='image'" style="width:100%;" :src="url"></el-image>
			<video
				v-else-if="type==='video'"
				controls
				:src="url"
				:style="{
						width: '100%'
					}"
			></video>
			<p v-else-if="type==='file'">{{ url }}</p>
		</div>
	</cl-dialog>
</template>

<script>
export default {
	data() {
		return {
			visible: false,
			url: "",
			type:''
		};
	},
	methods: {
		open(file) {
			if (file.status && file.status === "success") {
				this.visible = true;
				this.url = file.url;
				this.type = file.file_type
			}else{
				this.$message.warning('文件已删除,无法预览')
			}
		},
		close(){
			this.url = ''
		}
	}
};
</script>

<style scoped lang="scss">

</style>
