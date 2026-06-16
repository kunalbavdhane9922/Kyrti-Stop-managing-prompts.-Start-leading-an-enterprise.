const http = require('http');

const PORT = 3000; // API Gateway
const TOKEN = process.argv[2];

if (!TOKEN) {
  console.error('Usage: node sprint_1_5_load_test.js <valid_jwt_token>');
  console.error('Please login through the UI to grab a valid JWT token for testing.');
  process.exit(1);
}

const NUM_COMPANIES = 100;
const CONCURRENCY = 10;

async function createCompany(index) {
  const payload = JSON.stringify({
    name: `LoadTestCompany_${index}`,
    domain: `loadtest${index}.com`,
    tenantId: `t-load-${index}`
  });

  const options = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/v1/companies',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${TOKEN}`
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runLoadTest() {
  console.log(`Starting RBAC Foundation Load Test: ${NUM_COMPANIES} companies`);
  console.log(`Targeting Gateway on port ${PORT} with Authorization token`);
  
  let successes = 0;
  let failures = 0;

  for (let i = 0; i < NUM_COMPANIES; i += CONCURRENCY) {
    const batch = [];
    for (let j = 0; j < CONCURRENCY && (i + j) < NUM_COMPANIES; j++) {
      batch.push(createCompany(i + j)
        .then(() => { successes++; process.stdout.write('.'); })
        .catch(e => { failures++; console.error(`\nFailed at ${i+j}:`, e.message); })
      );
    }
    await Promise.all(batch);
  }

  console.log(`\n\nLoad Test Complete.`);
  console.log(`Successes: ${successes}`);
  console.log(`Failures: ${failures}`);

  if (failures === 0) {
    console.log(`\nNow run your SQL verification queries on the saep_db:`);
    console.log(`1. SELECT COUNT(*) FROM roles;`);
    console.log(`2. SELECT COUNT(*) FROM membership_roles;`);
    console.log(`3. SELECT tenant_id,name,COUNT(*) FROM roles GROUP BY tenant_id,name HAVING COUNT(*) > 1;`);
    console.log(`4. SELECT event_type, COUNT(*) FROM outbox_events GROUP BY event_type;`);
    console.log(`5. SELECT tenant_id, COUNT(*) FROM roles GROUP BY tenant_id HAVING COUNT(*) <> 4; (Should be 0)`);
    console.log(`6. SELECT tenant_id, COUNT(*) FROM membership_roles mr JOIN roles r ON mr.role_id = r.id WHERE r.name='Owner' GROUP BY tenant_id HAVING COUNT(*) <> 1; (Should be 0)`);
  }
}

runLoadTest();
