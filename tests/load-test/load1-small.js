import http from 'k6/http';
import { check } from 'k6';

const TOURIST = 'http://localhost:18004/health';
const TRAFFIC = 'http://localhost:18003/health';
const WEATHER = 'http://localhost:18002/health';

const mk = (exec) => ({
  executor: 'ramping-arrival-rate', startRate: 100, timeUnit: '1s',
  preAllocatedVUs: 300, maxVUs: 2000, exec,
  stages: [
    { target: 1000, duration: '1m' },   // 각 서비스 1000 RPS → pod 10개
    { target: 1000, duration: '3m' },
    { target: 0,    duration: '10s' },
  ],
});

export const options = {
  scenarios: {
    tourist: mk('hitTourist'),
    traffic: mk('hitTraffic'),
    weather: mk('hitWeather'),
  },
};

export function hitTourist() { check(http.get(TOURIST,{timeout:'10s'}), {'200':r=>r.status===200}); }
export function hitTraffic() { check(http.get(TRAFFIC,{timeout:'10s'}), {'200':r=>r.status===200}); }
export function hitWeather() { check(http.get(WEATHER,{timeout:'10s'}), {'200':r=>r.status===200}); }

export function setup(){ console.log('[1번-약한부하] 각 1000 RPS → 각 10개 예상'); }