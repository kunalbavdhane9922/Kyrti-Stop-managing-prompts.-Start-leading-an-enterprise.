import http from 'k6/http';
import { check } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const BASE_URL = __ENV.BASE_URL || 'http://host.docker.internal:8080';
export const TOKEN = __ENV.TOKEN || 'no-token-provided';

export function createAndInitializeCompany(vuId, iterId) {
    const tenantId = `t-${vuId}-${iterId}-${uuidv4()}`;
    const payload = JSON.stringify({
        name: `PerfTestCompany_${vuId}_${iterId}`,
        domain: `perftest${vuId}${iterId}.com`,
        tenantId: tenantId
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TOKEN}`,
        },
    };

    // 1. Create Company
    const createRes = http.post(`${BASE_URL}/api/v1/companies`, payload, params);
    
    const isCreateSuccess = check(createRes, {
        'company created successfully': (r) => r.status === 200 || r.status === 201,
    });

    if (!isCreateSuccess) {
        return false;
    }

    const companyId = createRes.json('id');
    if (!companyId) return false;

    // 2. Initialize Company
    const initPayload = JSON.stringify({});
    const initRes = http.post(`${BASE_URL}/api/v1/companies/${companyId}/initialize`, initPayload, params);

    return check(initRes, {
        'company initialization accepted': (r) => r.status === 200 || r.status === 202,
    });
}
