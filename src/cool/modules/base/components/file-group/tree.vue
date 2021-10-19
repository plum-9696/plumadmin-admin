<template>
	<div>
		<el-popover ref="popover" placement="bottom" v-model="visible">
			<el-tree :data="group" default-expand-all :expand-on-click-node="false" :props="{label:'name'}"
					 @node-click="select" />
		</el-popover>
		<el-input v-popover:popover size="mini" v-model="inputValue" :placeholder="placeholder"  :suffix-icon="suffixIcon" />
	</div>
</template>

<script>

export default {
	name: "cl-file-group-tree",
	props: {
		value: [String, Number],
		placeholder: String
	},
	data() {
		return {
			group: [],
			visible: false,
			inputValue: ""
		};
	},
	mounted() {
		this.$http.post("file.group/tree")
			.then(tree => {
				this.group = tree;
			});
	},
	computed:{
		suffixIcon(){
			return this.visible?'el-icon-arrow-up':'el-icon-arrow-down'
		}
	},
	watch: {
		value(val) {
			if (!val) {
				this.inputValue = "";
			}
		}
	},
	methods: {
		select(e) {
			this.visible = false;
			this.inputValue = e.name;
			this.$emit("input", e.id);
		}
	}
};
</script>

<style lang="scss" scoped>

</style>
