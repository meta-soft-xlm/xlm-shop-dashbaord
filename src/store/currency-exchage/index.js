import create from "zustand";
import produce from "immer";
import axios from "axios";
import { INTERNAL_SERVER_ERROR } from "../../constants/strings";

const INITIAL_CURRENCY_EXCHANGE_SATAE = {
  get: {
    loading: false,
    success: {
      ok: false,
      data: {},
    },
    failure: {
      error: false,
      message: "",
    },
  },
};

const useCurrencyExchangeStore = create((set) => ({
  currencyExchangeState: INITIAL_CURRENCY_EXCHANGE_SATAE,
  getCurrencyExchangeState: async () => {
    set(
      produce((state) => ({
        ...state,
        currencyExchangeState: {
          ...state.currencyExchangeState,
          get: {
            ...INITIAL_CURRENCY_EXCHANGE_SATAE.get,
            loading: true,
          },
        },
      }))
    );

    try {
      const { data = {} } = await axios.get(
        "https://api.coinconvert.net/convert/usd/xlm?amount=1"
      );
      if (data.status === "success") {
        set(
          produce((state) => ({
            ...state,
            currencyExchangeState: {
              ...state.currencyExchangeState,
              get: {
                ...INITIAL_CURRENCY_EXCHANGE_SATAE.get,
                success: {
                  ok: true,
                  data: data.XLM,
                },
              },
            },
          }))
        );
        return data.XLM;
      } else {
        throw new Error("Please try again");
      }
    } catch (e) {
      set(
        produce((state) => ({
          ...state,
          currencyExchangeState: {
            ...state.currencyExchangeState,
            get: {
              ...INITIAL_CURRENCY_EXCHANGE_SATAE.get,
              failure: {
                error: true,
                message: e.message,
              },
            },
          },
        }))
      );
    }
  },
}));

export default useCurrencyExchangeStore;
