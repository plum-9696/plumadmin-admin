<template>
	<el-card header="清理缓存">
		<div style="width:60%;">
			<el-form label-width="300px">
				<el-form-item label="缓存项目">
					<el-checkbox-group size="mini" v-model="tags">
						<el-checkbox v-for="(item,index) in list" :key="index" :label="item.key">{{ item.name }}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="onSubmit">清除</el-button>
				</el-form-item>
			</el-form>
		</div>
	</el-card>
</template>

<script>
export default {
	name: "upload-setting",
	data() {
		return {
			list: [],
			tags: []
		};
	},
	created() {
		this.$http.post("common/cacheTag")
			.then(data => {
				this.list = data;
				this.tags = data.map(e => e.key);
			})
			.catch(error => {
				this.$message.error(error);
			});
	},
	methods: {
		onSubmit() {
			this.$http.post("common/clearCache", {
				tags:this.tags,
			}).then(() => {
				this.$message.success("已清除缓存!");
			}).catch(error => {
				this.$message.error(error);
			});
		}
	}
};
</script>

<style scoped>

</style>
