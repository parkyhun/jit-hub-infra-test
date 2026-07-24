import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * KEDA + Karpenter 연계 부하 테스트: traffic-service
 *
 * 실행 (클러스터 내부에서 — port-forward 병목 회피):
 *   kubectl run k6-traffic --rm -i --image=grafana/k6 --restart=Never -n jit-hub \
 *     -- run - < traffic-service.js
 *
 * threshold: 50 RPS (Pod당)
 */
export let options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '3m',  target: 50 },
    { duration: '30s', target: 0  },
  ],
};

export default function () {
  const res = http.get('http://traffic-service:8003/health', { timeout: '5s' });
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(0.1);
}
