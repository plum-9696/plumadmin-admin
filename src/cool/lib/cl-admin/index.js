import { SET_ROUTER, SET_MODULE} from "./set";
import "./common";

async function bootstrap(options = {}) {
	const { modules } = options;
	SET_ROUTER();
	SET_MODULE({ events: modules });
}

export { bootstrap };
