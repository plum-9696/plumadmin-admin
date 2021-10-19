<template>
		<el-cascader
			placeholder="请选择权限"
			:options="options"
			separator="@"
			clearable
			filterable
			v-model="newValue"
			@change="handleChange"
		></el-cascader>
</template>

<script>

import { isString } from "@/utils";

export default {
	name: "cl-menu-perms",

	props: {
		value: [String, Number, Array]
	},

	data() {
		return {
			options: [],
			newValue: []
		};
	},

	mounted() {
		this.getPerms();
	},

	watch: {
		value:{
			immediate:true,
			handler(val){
				if (isString(val) && val.split('@').length===2) {
					this.newValue = val.split('@')
				}else{
					this.newValue = []
				}
			}

		},

	},

	methods: {
		getPerms() {
			this.$http.post("common/perms")
				.then(res => {
					this.options = res;
				});
		},
		handleChange(e){
			this.$emit('input',e.join('@'))
		}
	}
};
</script>
