import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.TARGET_URL || 'http://azastest.shop';
const ENDPOINT = __ENV.ENDPOINT || '/tourist/health';   // ← tourist 실제 경로로 수정 필요

export const options = {
  scenarios: {
    big_load: {
      executor: 'ramping-arrival-rate',
      startRate: 100,                    // 강한 부하라 시작 RPS도 조금 높게
      timeUnit: '1s',
      preAllocatedVUs: 200,
      maxVUs: 1500,                      // 1000 RPS 대응 위해 상한 넉넉히
      stages: [
        { target: 1000, duration: '30s' }, // 30초 만에 1000 RPS로 급증 (재부하 = 피크 재현)
        { target: 1000, duration: '3m' },  // 3분간 1000 RPS 유지 (pod 10개=max 확장 관찰)
        { target: 0,    duration: '10s' }, // 종료
      ],
    },
  },
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINT}`, { timeout: '10s' });
  check(res, { 'status 200': (r) => r.status === 200 });
}

export function setup() {
  console.log('[2번-강한부하] 1000 RPS 목표 → pod 10개(max) 예상 (임계값 100)');
  console.log(`대상: ${BASE_URL}${ENDPOINT}`);
}