import upload from './components/index'
import directUpload from './components/direct'
import spaceUpload from './components/space/index'
export default {
	components:{
		'cl-upload':upload,
		'cl-space-upload':spaceUpload,
		'cl-direct-upload':directUpload,
	}
}
