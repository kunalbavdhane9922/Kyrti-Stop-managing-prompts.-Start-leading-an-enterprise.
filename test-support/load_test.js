const http = require('http');

const numRequests = parseInt(process.argv[2], 10);
if (!numRequests || isNaN(numRequests)) {
  console.error('Usage: node load_test.js <num_requests>');
  process.exit(1);
}

const CONCURRENCY_LIMIT = 50; // keep it manageable so we don't drop HTTP requests

const options1 = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/v1/companies',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const options2 = {
  hostname: 'localhost',
  port: 8081,
  path: '/api/v1/companies',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

let completed = 0;
let errors = 0;
let latencies = [];

const startTime = Date.now();

function sendRequest(id) {
  return new Promise((resolve) => {
    const reqStartTime = Date.now();
    const data = JSON.stringify({
      name: `Load Test Company ${id}`,
      domain: `load${id}.test`,
      tenantId: `tenant-load-${id % 10}` // Spread across 10 tenants
    });

    const req = http.request(id % 2 === 0 ? options1 : options2, (res) => {
      res.on('data', () => {}); // Consume data
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const latency = Date.now() - reqStartTime;
          latencies.push(latency);
          completed++;
        } else {
          errors++;
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      errors++;
      resolve();
    });

    req.write(data);
    req.end();
  });
}

async function run() {
  console.log(`Starting ${numRequests} requests...`);
  
  for (let i = 0; i < numRequests; i += CONCURRENCY_LIMIT) {
    const chunk = Math.min(CONCURRENCY_LIMIT, numRequests - i);
    const promises = [];
    for (let j = 0; j < chunk; j++) {
      promises.push(sendRequest(i + j));
    }
    await Promise.all(promises);
    process.stdout.write(`\rProgress: ${Math.min(i + chunk, numRequests)} / ${numRequests}`);
  }

  const totalTime = Date.now() - startTime;
  console.log(`\n\n--- Results ---`);
  console.log(`Total Time: ${totalTime} ms`);
  console.log(`Completed: ${completed}`);
  console.log(`Errors: ${errors}`);
  
  if (latencies.length > 0) {
    latencies.sort((a, b) => a - b);
    const avg = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    const p95 = latencies[Math.floor(latencies.length * 0.95)];
    const max = latencies[latencies.length - 1];
    
    console.log(`Avg HTTP Latency: ${avg} ms`);
    console.log(`P95 HTTP Latency: ${p95} ms`);
    console.log(`Max HTTP Latency: ${max} ms`);
  }
}

run();
