import create from "zustand";
import axios from "axios";
import produce from "immer";
import Parse from "parse";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import { getBase64 } from "../../utils/media";

const INITIAL_FILES_STATE = {
  get: {
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

const useFilesStore = create((set, get) => ({
  files: INITIAL_FILES_STATE,
  getFiles: async () => {
    set(
      produce((state) => ({
        ...state,
        files: {
          ...state.files,
          get: {
            ...INITIAL_FILES_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.get(``, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            "thinkificAccessToken"
          )}`,
          accept: "application/json",
        },
      });
      set(
        produce((state) => ({
          ...state,
          files: {
            ...state.files,
            get: {
              ...INITIAL_FILES_STATE.get,
              success: {
                ok: true,
                data: [],
              },
            },
          },
        }))
      );
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          files: {
            ...state.files,
            get: {
              ...INITIAL_FILES_STATE.get,
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
  postFiles: async (uploads) => {
    set(
      produce((state) => ({
        ...state,
        files: {
          ...state.files,
          post: {
            ...INITIAL_FILES_STATE.post,
            loading: true,
          },
        },
      }))
    );

    try {
      const base64s = await Promise.all(
        uploads.map(async (upload) => {
          return {
            data: await getBase64(upload),
            type: upload.type,
          };
        })
      );
      const savedFiles = await Promise.all(
        base64s.map(async (base64) => {
          const parseFile = new Parse.File(
            "looks",
            { base64: base64.data },
            base64.type
          );
          // const savedFile = await parseFile.save();
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/parse/files/looks`,
            {
              base64: parseFile?._source?.base64 || parseFile._data,
              _ApplicationId: Parse.applicationId,
              _ClientVersion: "js3.4.1",
              _ContentType: parseFile?._source?.type,
              _JavaScriptKey: Parse.javaScriptKey,
              fileData: { metadata: {}, tags: {} },
            },
            {
              headers: {
                "content-type": "text/plain",
              },
            }
          );
          return data;
        })
      );
      set(
        produce((state) => ({
          ...state,
          files: {
            ...state.files,
            post: {
              ...INITIAL_FILES_STATE.post,
              success: {
                ok: true,
                data: savedFiles,
              },
            },
          },
        }))
      );
      return savedFiles;
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          files: {
            ...state.files,
            post: {
              ...INITIAL_FILES_STATE.post,
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
  destroyFiles: async (id) => {
    set(
      produce((state) => ({
        ...state,
        files: {
          ...state.files,
          destroy: {
            ...INITIAL_FILES_STATE.destroy,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data } = await axios.delete(``, {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem(
            "thinkificAccessToken"
          )}`,
          accept: "*/*",
          "Access-Control-Allow-Origin": "*",
        },
      });

      set(
        produce((state) => ({
          ...state,
          files: {
            ...state.files,
            destroy: {
              ...INITIAL_FILES_STATE.destroy,
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
          files: {
            ...state.files,
            destroy: {
              ...INITIAL_FILES_STATE.destroy,
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

export default useFilesStore;
