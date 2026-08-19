import http from 'k6/http';
import { check } from 'k6';

const TOURIST = 'http://localhost:18004/health';
const TRAFFIC = 'http://localhost:18003/health';
const WEATHER = 'http://localhost:18002/health';

const mk = (exec) => ({
  executor: 'ramping-arrival-rate', startRate: 200, timeUnit: '1s',
  preAllocatedVUs: 500, maxVUs: 3000, exec,
  stages: [
    { target: 2000, duration: '30s' },  // 각 서비스 2000 RPS → pod 20개(새 max)
    { target: 2000, duration: '3m' },
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

export function setup(){ console.log('[2번-강한부하] 각 2000 RPS → 각 20개(max) 예상'); }