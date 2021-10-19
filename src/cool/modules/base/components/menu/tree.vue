<template>
	<div class="cl-menu-tree">
		<el-popover
			v-model="popoverVisible"
			ref="popover"
			placement="bottom-start"
			trigger="click"
			popper-class="popper-menu-tree"
		>
			<el-input size="small" v-model="filterValue">
				<i slot="prefix" class="el-input__icon el-icon-search"></i>
			</el-input>

			<el-tree
				ref="tree"
				node-key="menuId"
				:data="list"
				:props="props"
				:highlight-current="true"
				:expand-on-click-node="false"
				:default-expanded-keys="expandedKeys"
				:filter-node-method="filterNode"
				@current-change="currentChange"
			>
			</el-tree>
		</el-popover>
		<el-input v-model="name" v-popover:popover readonly placeholder="请选择"></el-input>
	</div>
</template>

<script>
import { treeToArray } from "@/utils";

export default {
	name: "cl-menu-tree",

	props: {
		value: [Number, String]
	},

	data() {
		return {
			filterValue: "",
			list: [],
			props: {
				label: "name",
				children: "children"
			},
			expandedKeys: [],
			popoverVisible:false
		};
	},

	watch: {
		filterValue(val) {
			this.$refs.tree.filter(val);
		}
	},

	computed: {
		name() {
			const item = treeToArray(this.list).find(e => e.id == this.value);
			return item ? item.name : "一级菜单";
		}
	},

	mounted() {
		this.menuList();
	},

	methods: {
		currentChange({ id }) {
			this.$emit("input", id);
			this.popoverVisible = false
		},

		menuList() {
			this.$http.post("rule/tree", { type: [0, 1] }).then(data => {
				data.unshift({
					name: "一级菜单",
					id: null
				});
				this.list = data;
			});
		},

		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		}
	}
};
</script>

<style lang="scss">
.popper-menu-tree {
	width: 480px;
	box-sizing: border-box;

	.el-input {
		margin-bottom: 10px;
	}
}
</style>
