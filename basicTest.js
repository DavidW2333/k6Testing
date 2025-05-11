import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  scenarios: {
    ramping_users: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 50 },
        //{ duration: '2m', target: 50 },
        //{ duration: '30s', target: 0 },
      ],
      exec: 'runCompleteTest', 
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export function runCompleteTest() {
  const res = http.get('https://jsonplaceholder.typicode.com/posts');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is not empty': (r) => r.body && r.body.length > 0,
  });

  sleep(1);
}
