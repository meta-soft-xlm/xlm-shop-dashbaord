import create from "zustand";
import axios from "axios";
import produce from "immer";
import Parse from "parse";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_SCRIPTS_STATE = {
	get: {
		loading: false,
		success: {
			ok: false,
			data: [],
		},
		failure: {
			error: false,
			message: "",
		}
	},
	post: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	},
	patch: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	},
	destroy: {
		loading: false,
		success: {
			ok: false,
			data: null,
		},
		failure: {
			error: false,
			message: "",
		}
	}
};

const useScriptsStore = create((set, get) => ({
	scripts: INITIAL_SCRIPTS_STATE,
	getScripts: async (shop = window.lookbook.shop) => {
		set(produce(state => ({
			...state,
			scripts: {
				...state.scripts,
				get: {
					...INITIAL_SCRIPTS_STATE.get,
					loading: true,
				}
			}
		})))
	
		try {
			const { data } = await axios.get(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_scripts?shop=${shop}`);
			set(produce(state => ({
				...state,
				scripts: {
					...state.scripts,
					get: {
						...INITIAL_SCRIPTS_STATE.get,
						success: {
							ok: true,
							data
						},
					}
				}
			})))
			return data;
	
		} catch (e) {
			set(produce(state => ({
				...state,
				scripts: {
					...state.scripts,
					get: {
						...INITIAL_SCRIPTS_STATE.get,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	},
	postScripts: async (shop = window.lookbook.shop) => {
		set(produce(state => ({
			...state,
			scripts: {
				...state.scripts,
				post: {
					...INITIAL_SCRIPTS_STATE.post,
					loading: true,
				}
			}
		})))

		try {
			const { data } = await axios.post(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_scripts`, { shop });

			set(produce(state => ({
				...state,
				scripts: {
					...state.scripts,
					post: {
						...INITIAL_SCRIPTS_STATE.post,
						success: {
							ok: true,
							data
						},
					}
				}
			})))
			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				scripts: {
					...state.scripts,
					post: {
						...INITIAL_SCRIPTS_STATE.post,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	},
	destroyScripts: async (shop = window.lookbook.shop) => {
		set(produce(state => ({
			...state,
			scripts: {
				...state.scripts,
				destroy: {
					...INITIAL_SCRIPTS_STATE.destroy,
					loading: true,
				}
			}
		})))

		try {
			const { data } = await axios.delete(`${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/destroy_scripts?shop=${shop}`);

			set(produce(state => ({
				...state,
				scripts: {
					...state.scripts,
					destroy: {
						...INITIAL_SCRIPTS_STATE.destroy,
						success: {
							ok: true,
							data,
						},
					}
				}
			})))
			return data;

		} catch (e) {
			set(produce(state => ({
				...state,
				scripts: {
					...state.scripts,
					destroy: {
						...INITIAL_SCRIPTS_STATE.destroy,
						failure: {
							error: true,
							message: e.message || INTERNAL_SERVER_ERROR
						},
					}
				}
			})))
			throw e;
		}
	}
}));

export default useScriptsStore;
	
