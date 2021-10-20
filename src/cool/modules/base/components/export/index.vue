<template>
	<el-button type="primary" size="mini" @click="handleExport">
		<slot>
			EXCEL导出
		</slot>
	</el-button>
</template>

<script>
import {host} from "@/config/env";

export default {
	name: "cl-export",
	props:{
		field:{
			required:true,
			type:String
		}
	},
	methods:{
		handleExport(){
			window.open(`${host}/${this.field}/export`, '_blank')
		}
	}
};
</script>

<style scoped>

</style>
