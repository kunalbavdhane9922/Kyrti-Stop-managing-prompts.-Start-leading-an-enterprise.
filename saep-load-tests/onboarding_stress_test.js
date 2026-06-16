import { createAndInitializeCompany } from './common.js';
import { sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
    stages: [
        { duration: '10s', target: 200 },  // Ramp up
        { duration: '60s', target: 500 },  // Stress Load
        { duration: '10s', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'], 
        http_req_failed: ['rate<0.05'], // Expecting some failures during stress
        checks: ['rate>0.95'],
    },
};

export default function () {
    const success = createAndInitializeCompany(exec.vu.idInTest, exec.vu.iterationInInstance);
    if (!success) {
        sleep(1);
    }
    sleep(1);
}
