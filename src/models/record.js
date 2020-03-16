import { query, queryEvent, addEvent, delEvent, addRecord } from '@/services/record';

const RecordModel = {
  namespace: 'record',
  state: {
    records: [],
    events: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'saveRecord',
        payload: response,
      });
    },
    *fetchEvent(_, { call, put }) {
      const response = yield call(queryEvent);
      yield put({
        type: 'saveEvent',
        payload: response,
      });
    },
    *postEvent({ payload }, { call }) {
      const response = yield call(addEvent, payload);
    },
    *deleteEvent({ payload }, { call }) {
      const response = yield call(delEvent, payload);
    },
    *postRecord({ payload }, { call }) {
      const response = yield call(addRecord, payload);
    },
  },
  reducers: {
    saveRecord(state, { payload }) {
      return { ...state, records: payload.data || [] };
    },
    saveEvent(state, { payload }) {
      return { ...state, events: payload.data || [] };
    },
  },
};

export default RecordModel;
