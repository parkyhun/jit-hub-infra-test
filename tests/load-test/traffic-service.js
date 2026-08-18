import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const resTime = new Trend('res_time');
const errRate = new Rate('errors');

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:8003';
const ENDPOINT = __ENV.ENDPOINT   || '/health';

// 650~660 사이를 1 단위로 초정밀 측정
export const options = {
  scenarios: {
    rps650: { executor:'constant-arrival-rate', rate:650, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:650, maxVUs:1300, startTime:'0m',     exec:'load', tags:{rps:'650'} },
    rps651: { executor:'constant-arrival-rate', rate:651, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:651, maxVUs:1302, startTime:'1m30s',  exec:'load', tags:{rps:'651'} },
    rps652: { executor:'constant-arrival-rate', rate:652, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:652, maxVUs:1304, startTime:'3m',     exec:'load', tags:{rps:'652'} },
    rps653: { executor:'constant-arrival-rate', rate:653, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:653, maxVUs:1306, startTime:'4m30s',  exec:'load', tags:{rps:'653'} },
    rps654: { executor:'constant-arrival-rate', rate:654, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:654, maxVUs:1308, startTime:'6m',     exec:'load', tags:{rps:'654'} },
    rps655: { executor:'constant-arrival-rate', rate:655, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:655, maxVUs:1310, startTime:'7m30s',  exec:'load', tags:{rps:'655'} },
    rps656: { executor:'constant-arrival-rate', rate:656, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:656, maxVUs:1312, startTime:'9m',     exec:'load', tags:{rps:'656'} },
    rps657: { executor:'constant-arrival-rate', rate:657, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:657, maxVUs:1314, startTime:'10m30s', exec:'load', tags:{rps:'657'} },
    rps658: { executor:'constant-arrival-rate', rate:658, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:658, maxVUs:1316, startTime:'12m',    exec:'load', tags:{rps:'658'} },
    rps659: { executor:'constant-arrival-rate', rate:659, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:659, maxVUs:1318, startTime:'13m30s', exec:'load', tags:{rps:'659'} },
    rps660: { executor:'constant-arrival-rate', rate:660, timeUnit:'1s', duration:'1m30s', preAllocatedVUs:660, maxVUs:1320, startTime:'15m',    exec:'load', tags:{rps:'660'} },
  },
  thresholds: {
    'http_req_duration{rps:650}': ['p(95)<500'],
    'http_req_duration{rps:651}': ['p(95)<500'],
    'http_req_duration{rps:652}': ['p(95)<500'],
    'http_req_duration{rps:653}': ['p(95)<500'],
    'http_req_duration{rps:654}': ['p(95)<500'],
    'http_req_duration{rps:655}': ['p(95)<500'],
    'http_req_duration{rps:656}': ['p(95)<500'],
    'http_req_duration{rps:657}': ['p(95)<500'],
    'http_req_duration{rps:658}': ['p(95)<500'],
    'http_req_duration{rps:659}': ['p(95)<500'],
    'http_req_duration{rps:660}': ['p(95)<500'],
  },
};

export function load() {
  const res = http.get(`${BASE_URL}${ENDPOINT}`, {
    timeout: '10s',
    tags: { name: 'limit-test4' },
  });
  const ok = check(res, { 'status 200': (r) => r.status === 200 });
  errRate.add(!ok);
  resTime.add(res.timings.duration);
}

export function setup() {
  console.log('[초정밀 한계 측정] RPS 650 to 660 (1 단위, 총 16분30초)');
  console.log(`대상: ${BASE_URL}${ENDPOINT}`);
  console.log('어느 RPS에서 p95>500ms 넘는지 1단위로 관찰');
}