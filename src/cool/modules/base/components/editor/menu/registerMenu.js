import E from "wangeditor";
const {  BtnMenu } = E;

export function registerUploadImage(editor, cb) {
	const key = 'uploadImage'
	class UploadImage extends BtnMenu {
		constructor(editor) {
			// data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
			const $elem = E.$(
				`<div class="w-e-menu" data-title="上传图片">
                <i class="w-e-icon-image"></i>
            </div>`
			);
			super($elem, editor);
		}

		// 菜单点击事件
		clickHandler() {
			cb()
		}

		tryChangeActive() {
		}
	}
	editor.menus.extend(key, UploadImage)
}



export function registerUploadVideo(editor, cb) {
	const key = 'uploadVideo'
	class UploadVideo extends BtnMenu {
		constructor(editor) {
			// data-title属性表示当鼠标悬停在该按钮上时提示该按钮的功能简述
			const $elem = E.$(
				`<div class="w-e-menu" data-title="上传视频">
                <i class="w-e-icon-play"></i>
            </div>`
			);
			super($elem, editor);
		}

		// 菜单点击事件
		clickHandler() {
			cb()
		}

		tryChangeActive() {
		}
	}
	editor.menus.extend(key, UploadVideo)
}
