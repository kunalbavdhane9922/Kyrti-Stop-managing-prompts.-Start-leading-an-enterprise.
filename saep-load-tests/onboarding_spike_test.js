import { createAndInitializeCompany } from './common.js';
import { sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
    stages: [
        { duration: '10s', target: 10 },   // Baseline
        { duration: '0s', target: 500 },   // SPIKE
        { duration: '30s', target: 500 },   // Hold Spike
        { duration: '0s', target: 10 },    // Drop to Baseline
        { duration: '30s', target: 10 },    // Recovery period
        { duration: '10s', target: 0 },    // End
    ],
    thresholds: {
        // Thresholds might be breached during the spike, 
        // the primary goal is measuring RECOVERY.
        http_req_failed: ['rate<0.1'], 
    },
};

export default function () {
    const success = createAndInitializeCompany(exec.vu.idInTest, exec.vu.iterationInInstance);
    if (!success) {
        sleep(1);
    }
    sleep(1);
}
