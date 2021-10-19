<template>
	<el-card header="上传设置">
		<div style="width:60%;">
			<el-form :model="form" label-width="300px">
				<!--图片-->
				<el-form-item label="上传图片">
					<el-switch v-model="form.rule.image.status"></el-switch>
				</el-form-item>

				<el-form-item label="图片大小(字节)" v-if="form.rule.image.status">
					<el-input-number size="mini" style="width: 240px" v-model="form.rule.image.size"
									 :min="0"></el-input-number>
					<span style="font-size: 12px;color: #909399;padding-left: 20px">0为不限制大小</span>
				</el-form-item>

				<el-form-item label="图片类型" v-if="form.rule.image.status">
					<el-select allow-create :filterable="true" size="mini" style="width: 100%"
							   v-model="form.rule.image.extension" multiple>
						<el-option v-for="(item,index) in form.rule.image.options" :label="item"
								   :value="item" :key="index" />
					</el-select>
				</el-form-item>


				<!--视频-->
				<el-form-item label="上传视频">
					<el-switch v-model="form.rule.video.status"></el-switch>
				</el-form-item>

				<el-form-item label="视频大小(字节)" v-if="form.rule.video.status">
					<el-input-number size="mini" style="width: 240px" v-model="form.rule.video.size"
									 :min="0"></el-input-number>
					<span style="font-size: 12px;color: #909399;padding-left: 20px">0为不限制大小</span>
				</el-form-item>

				<el-form-item label="视频类型" v-if="form.rule.video.status">
					<el-select allow-create :filterable="true" size="mini" style="width: 100%"
							   v-model="form.rule.video.extension" multiple>
						<el-option v-for="(item,index) in form.rule.video.options" :label="item"
								   :value="item" :key="index" />
					</el-select>
				</el-form-item>


				<!--文件-->
				<el-form-item label="上传文件">
					<el-switch v-model="form.rule.file.status"></el-switch>
				</el-form-item>

				<el-form-item label="文件大小(字节)" v-if="form.rule.file.status">
					<el-input-number size="mini" style="width: 240px" v-model="form.rule.file.size"
									 :min="0"></el-input-number>
					<span style="font-size: 12px;color: #909399;padding-left: 20px">0为不限制大小</span>
				</el-form-item>

				<el-form-item label="文件类型" v-if="form.rule.file.status">
					<el-select allow-create :filterable="true" size="mini" style="width: 100%"
							   v-model="form.rule.file.extension" multiple>
						<el-option v-for="(item,index) in form.rule.file.options" :label="item"
								   :value="item" :key="index" />
					</el-select>
				</el-form-item>

				<el-form-item label="默认上传方式">
					<el-radio-group v-model="form.default">
						<el-radio label="local">本地</el-radio>
						<el-radio label="qiniu">七牛云</el-radio>
						<el-radio label="qcloud">腾讯云</el-radio>
						<el-radio label="aliyun">阿里云</el-radio>
					</el-radio-group>
				</el-form-item>

				<!--阿里云-->
				<template v-if="form.default === 'aliyun'">
					<el-form-item label="存储空间名称 Bucket">
						<el-input size="mini" v-model="form.disk.aliyun.bucket"></el-input>
					</el-form-item>
					<el-form-item label="AccessKeyId">
						<el-input size="mini" v-model="form.disk.aliyun.accessId"></el-input>
					</el-form-item>
					<el-form-item label="AccessKeySecret">
						<el-input size="mini" v-model="form.disk.aliyun.accessSecret"></el-input>
					</el-form-item>
					<el-form-item label="空间域名 Domain">
						<el-input size="mini" v-model="form.disk.aliyun.endpoint"></el-input>
					</el-form-item>
				</template>

				<!--七牛云-->
				<template v-if="form.default === 'qiniu'">
					<el-form-item label="存储空间名称 Bucket">
						<el-input size="mini" v-model="form.disk.qiniu.bucket"></el-input>
					</el-form-item>
					<el-form-item label="ACCESS_KEY AK">
						<el-input size="mini" v-model="form.disk.qiniu.accessKey"></el-input>
					</el-form-item>
					<el-form-item label="SECRET_KEY SK">
						<el-input size="mini" v-model="form.disk.qiniu.secretKey"></el-input>
					</el-form-item>
					<el-form-item label="空间域名 Domain">
						<el-input size="mini" v-model="form.disk.qiniu.url"></el-input>
					</el-form-item>
				</template>

				<!--腾讯云-->
				<template v-if="form.default === 'qcloud'">
					<el-form-item label="存储空间名称 Bucket">
						<el-input size="mini" v-model="form.disk.qcloud.bucket"></el-input>
					</el-form-item>
					<el-form-item label="所属地域 Region">
						<el-input size="mini" v-model="form.disk.qcloud.region"></el-input>
					</el-form-item>
					<el-form-item label="appId">
						<el-input size="mini" v-model="form.disk.qcloud.appId"></el-input>
					</el-form-item>
					<el-form-item label="SecretId">
						<el-input size="mini" v-model="form.disk.qcloud.secretId"></el-input>
					</el-form-item>
					<el-form-item label="SecretKey">
						<el-input size="mini" v-model="form.disk.qcloud.secretKey"></el-input>
					</el-form-item>
					<el-form-item label="空间域名 Domain">
						<el-input size="mini" v-model="form.disk.qcloud.cdn"></el-input>
					</el-form-item>
					<el-form-item label="地址域名">
						<el-input size="mini" v-model="form.disk.qcloud.url"></el-input>
					</el-form-item>
				</template>

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
				default: undefined,
				disk: {
					aliyun: {
						bucket: "",
						accessId: "",
						accessSecret: "",
						endpoint: "",
						url: ""
					},
					qiniu: {
						accessKey: "",
						secretKey: "",
						bucket: "",
						url: ""
					},
					qcloud: {
						region: "",
						appId: "",
						secretId: "",
						secretKey: "",
						bucket: "",
						cdn: ""
					}
				},
				rule: {
					//图片
					image: {
						status: true,
						extension: [],
						size: 0,
						options: []
					},
					//视频
					video: {
						status: true,
						extension: [],
						size: 0,
						options: []
					},
					//文件
					file: {
						status: true,
						extension: [],
						size: 0,
						options: []
					}
				}

			}
		};
	},
	created() {
		this.$http.post("setting/get", { key: "storage" })
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
				key: "storage",
				value: this.form
			}).then(() => {
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
