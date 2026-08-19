import http from 'k6/http';
import { check } from 'k6';

// 환경변수로 대상 주소 받음 (실행 시 지정)
const BASE_URL = __ENV.TARGET_URL || 'http://azastest.shop';   // EKS ingress 주소
const ENDPOINT = __ENV.ENDPOINT || '/tourist/health';          // ← tourist 실제 경로로 수정 필요

export const options = {
  scenarios: {
    small_load: {
      executor: 'ramping-arrival-rate',  // RPS를 stages로 제어하는 실행기
      startRate: 50,                     // 초당 50요청부터 시작
      timeUnit: '1s',                    // rate 단위 = 초당
      preAllocatedVUs: 100,              // 미리 확보할 가상유저 수
      maxVUs: 800,                       // 가상유저 상한 (k6 폭주 방지)
      stages: [
        { target: 500, duration: '1m' },  // 1분에 걸쳐 500 RPS까지 상승
        { target: 500, duration: '3m' },  // 3분간 500 RPS 유지 (pod 5개 확장 관찰)
        { target: 0,   duration: '10s' }, // 부하 종료
      ],
    },
  },
};

export default function () {
  const res = http.get(`${BASE_URL}${ENDPOINT}`, { timeout: '10s' });
  check(res, { 'status 200': (r) => r.status === 200 });  // 응답 정상 확인
}

export function setup() {
  console.log('[1번-작은부하] 500 RPS 목표 → pod 5개 예상 (임계값 100)');
  console.log(`대상: ${BASE_URL}${ENDPOINT}`);
}


