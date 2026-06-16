import { createAndInitializeCompany } from './common.js';
import { sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
    vus: 10,
    duration: '1m',
    thresholds: {
        http_req_duration: ['p(95)<200'], // Gateway POST should be very fast
        http_req_failed: ['rate<0.01'], // Less than 1% failure
        checks: ['rate>0.99'],
    },
};

export default function () {
    const success = createAndInitializeCompany(exec.vu.idInTest, exec.vu.iterationInInstance);
    if (!success) {
        // If failed, pause briefly to prevent flood
        sleep(1);
    }
    sleep(1); // 1 second pacing
}
