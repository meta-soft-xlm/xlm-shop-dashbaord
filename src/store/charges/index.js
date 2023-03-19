import create from "zustand";
import axios from "axios";
import produce from "immer";
import Parse from "parse";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_CHARGES_STATE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: [],
    },
    failure: {
      error: false,
      message: "",
    },
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
    },
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
    },
  },
};

const useChargesStore = create((set, get) => ({
  chargesState: INITIAL_CHARGES_STATE,
  getCharges: async ({ shop = window.lookbook.shop } = {}) => {
    set(
      produce((state) => ({
        ...state,
        chargesState: {
          ...state.chargesState,
          get: {
            ...INITIAL_CHARGES_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      // Parse.Cloud.run('get_views', {
      // 	shop, id
      // })

      const { data } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_charges?shop=${shop}`
      );
      set(
        produce((state) => ({
          ...state,
          chargesState: {
            ...state.chargesState,
            get: {
              ...INITIAL_CHARGES_STATE.get,
              success: {
                ok: true,
                data: data,
              },
            },
          },
        }))
      );

      return data;
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          chargesState: {
            ...state.chargesState,
            get: {
              ...INITIAL_CHARGES_STATE.get,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
    }
  },
  postCharges: async ({ shop = window.lookbook.shop, returnURL }) => {
    set(
      produce((state) => ({
        ...state,
        chargesState: {
          ...state.chargesState,
          post: {
            ...INITIAL_CHARGES_STATE.post,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_charges`,
        {
          shop,
          returnURL,
        }
      );
      set(
        produce((state) => ({
          ...state,
          chargesState: {
            ...state.chargesState,
            post: {
              ...INITIAL_CHARGES_STATE.post,
              success: {
                ok: true,
                data,
              },
            },
          },
        }))
      );
      return data;
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          chargesState: {
            ...state.chargesState,
            post: {
              ...INITIAL_CHARGES_STATE.post,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
      throw e;
    }
  },
  destroyCharges: async ({ shop = window.lookbook.shop, chargeId }) => {
    set(
      produce((state) => ({
        ...state,
        chargesState: {
          ...state.chargesState,
          destroy: {
            ...INITIAL_CHARGES_STATE.destroy,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/delete_charges`,
        {
          shop,
          chargeId,
        }
      );
      set(
        produce((state) => ({
          ...state,
          chargesState: {
            ...state.chargesState,
            destroy: {
              ...INITIAL_CHARGES_STATE.destroy,
              success: {
                ok: true,
                data,
              },
            },
          },
        }))
      );
      return data;
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          chargesState: {
            ...state.chargesState,
            destroy: {
              ...INITIAL_CHARGES_STATE.destroy,
              failure: {
                error: true,
                message: e.message || INTERNAL_SERVER_ERROR,
              },
            },
          },
        }))
      );
      throw e;
    }
  },
}));

export default useChargesStore;
