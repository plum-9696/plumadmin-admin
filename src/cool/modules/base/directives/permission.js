import store from "@/store";

function change(el, binding) {
	el.style.display = checkPerm(binding.value) ? el.getAttribute("_display") : "none";
}

export default {
	inserted(el, binding) {
		el.setAttribute("_display", el.style.display || "");
		change(el, binding);
	},
	update: change
};

export const checkPerm = value => {
	return store.getters.permission.includes(value);
};
