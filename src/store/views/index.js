import create from "zustand";
import axios from "axios";
import produce from "immer";
import Parse from "parse";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_VIEWS_STATE = {
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
};

const useViewsStore = create((set, get) => ({
  viewsState: INITIAL_VIEWS_STATE,
  getViews: async ({ shop = window.lookbook.shop } = {}) => {
    console.log("ererereerer");
    set(
      produce((state) => ({
        ...state,
        viewsState: {
          ...state.viewsState,
          get: {
            ...INITIAL_VIEWS_STATE.get,
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
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_views?shop=${shop}`
      );
      console.log(data);

      set(
        produce((state) => ({
          ...state,
          viewsState: {
            ...state.viewsState,
            get: {
              ...INITIAL_VIEWS_STATE.get,
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
          viewsState: {
            ...state.viewsState,
            get: {
              ...INITIAL_VIEWS_STATE.get,
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
  postViews: async ({ shop = window.lookbook.shop, subscribed } = {}) => {
    set(
      produce((state) => ({
        ...state,
        viewsState: {
          ...state.viewsState,
          post: {
            ...INITIAL_VIEWS_STATE.post,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/post_views?shop=${shop}&subscribed=${subscribed}`
      );
      set(
        produce((state) => ({
          ...state,
          viewsState: {
            ...state.viewsState,
            post: {
              ...INITIAL_VIEWS_STATE.post,
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
          viewsState: {
            ...state.viewsState,
            post: {
              ...INITIAL_VIEWS_STATE.post,
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
}));

export default useViewsStore;
