import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(payload) {
  const paramsSerializer = params => stringify(params, { indices: false });
  const queryParams = paramsSerializer(payload);
  const url = `/apiv2/records?${queryParams}`;
  return request(url);
}

export async function queryEvent() {
  const url = '/apiv2/events';
  return request(url);
}

export async function addEvent(params) {
  const url = '/apiv2/events';
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export async function delEvent(params) {
  const url = '/apiv2/events';
  return request(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export async function addRecord(params) {
  const url = '/apiv2/records';
  return request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}
