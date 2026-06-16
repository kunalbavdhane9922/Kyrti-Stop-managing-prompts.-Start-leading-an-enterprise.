import { createAndInitializeCompany } from './common.js';
import { sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
    stages: [
        { duration: '10s', target: 50 },   // Ramp up
        { duration: '120s', target: 50 },  // Endurance Load
        { duration: '10s', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01'],
        checks: ['rate>0.99'],
    },
};

export default function () {
    const success = createAndInitializeCompany(exec.vu.idInTest, exec.vu.iterationInInstance);
    if (!success) {
        sleep(1);
    }
    sleep(1);
}
