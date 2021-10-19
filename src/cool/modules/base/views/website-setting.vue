<template>
	<el-card header="站点设置">
		<div style="width:60%;">
			<el-form :model="form" label-width="300px">
				<el-form-item label="网站名称">
					<el-input size="mini" v-model="form.name"></el-input>
				</el-form-item>

				<el-form-item label="LOGO">
					<cl-direct-upload type="image" v-model="form.logo" />
				</el-form-item>

				<el-form-item label="网站图标">
					<cl-direct-upload type="image" v-model="form.icon" />
				</el-form-item>

				<el-form-item label="备案号">
					<el-input size="mini" v-model="form.bei_an"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
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
			form: {
				name:'',
				logo:'',
				icon:'',
				bei_an:''
			}
		};
	},
	created() {
		this.$http.post("setting/get", { key: "website" })
			.then(data => {
				this.form = data;
			})
			.catch(error => {
				this.$message.error(error);
			});
	},
	methods: {
		onSubmit() {
			this.$http.post("setting/set", {
				key: "website",
				value: this.form
			}).then(() => {
				this.$store.dispatch('updateApp')
				this.$message.success("保存成功");
			}).catch(error => {
				this.$message.error(error);
			});
		}
	}
};
</script>

<style scoped>

</style>
