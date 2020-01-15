import { query } from '@/services/news';

const NewsModel = {
  namespace: 'news',
  state: {
    news: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'updateNews',
        payload: response,
      });
    },
  },
  reducers: {
    updateNews(state, { payload }) {
      return { ...state, news: payload };
    },
  },
};

export default NewsModel;
