import create from "zustand";
import axios from "axios";
import produce from "immer";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";
import StellarSdk from "stellar-sdk";

const INITIAL_TRANSACTION_STATE = {
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

const useTransactionStore = create((set) => ({
  transactionState: INITIAL_TRANSACTION_STATE,
  getTransactionState: async (shop, stellarHorizonAPI) => {
    set(
      produce((state) => ({
        ...state,
        walletState: {
          ...state.transactionState,
          get: {
            ...INITIAL_TRANSACTION_STATE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const server = new StellarSdk.Server(stellarHorizonAPI);
      const { data: { walletAddress = "" } = {} } = await axios.get(
        `${process.env.REACT_APP_API_SHOPLOOKS_SERVER_URL}/api/get_shop?shop=${shop}`
      );
      const payments = server.payments().forAccount(walletAddress);
      const paymentRecords = await payments.call();
      set(
        produce((state) => ({
          ...state,
          transactionState: {
            ...state.transactionState,
            get: {
              ...INITIAL_TRANSACTION_STATE.get,
              success: {
                ok: true,
                data: paymentRecords,
              },
            },
          },
        }))
      );
      return paymentRecords;
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          transactionState: {
            ...state.transactionState,
            get: {
              ...INITIAL_TRANSACTION_STATE.get,
              success: {
                ok: false,
                data: null,
              },
              failure: {
                error: true,
                message: e.message || "Something went wrong. Please try again",
              },
            },
          },
        }))
      );
    }
  },
}));

export default useTransactionStore;
