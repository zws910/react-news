import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(payload) {
  const paramsSerializer = params => stringify(params, { indices: false });
  const queryParams = paramsSerializer(payload);
  const url = `/api/newsflow?${queryParams}`;
  return request(url);
}
