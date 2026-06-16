const http = require('http');

const GATEWAY_PORT = 3000;

function request(path, method, payload = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: GATEWAY_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (payload) {
      options.headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`Status ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
          else reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runGoldenPath() {
  try {
    console.log("1. Registering user...");
    const regPayload = JSON.stringify({ email: "golden@test.com", password: "Password123!", name: "Golden Test" });
    const regRes = await request('/api/v1/auth/register', 'POST', regPayload);
    console.log("User registered:", regRes.data.userId);

    console.log("2. Logging in...");
    const loginPayload = JSON.stringify({ email: "golden@test.com", password: "Password123!" });
    const loginRes = await request('/api/v1/auth/login', 'POST', loginPayload);
    
    let token = '';
    if (loginRes.data && loginRes.data.accessToken) {
      token = loginRes.data.accessToken;
      console.log("Login successful. Got L2 token.");
    } else if (loginRes.data && loginRes.data.requiresTenantSelection) {
      const partialToken = loginRes.data.tenantSelectionToken;
      console.log("Requires tenant selection, this means we logged in! But wait, no tenants yet.");
      // We don't have a full token. How does a user create a company if they don't have a tenant?
      // Usually, they get an L2 token if they have no tenants?
      // Let's print out what happened
      console.log("Login response:", JSON.stringify(loginRes.data));
      token = partialToken; // Wait, can we create a company with a partial token?
    } else {
       console.log("Login unexpected response:", JSON.stringify(loginRes.data));
       return;
    }

    console.log("3. Creating Company...");
    const companyPayload = JSON.stringify({
      name: "GoldenPathCorp",
      domain: "goldenpath.com",
      tenantId: "t-golden-1"
    });
    const compRes = await request('/api/v1/companies', 'POST', companyPayload, token);
    console.log("Company created:", JSON.stringify(compRes));

    console.log("Golden Path complete!");
  } catch (error) {
    console.error("Test Failed:", error.message);
  }
}

runGoldenPath();
