import assert from 'assert';
import { CompanyDto } from './src/dto/CompanyDto.js';
import { AuthDto } from './src/dto/AuthDto.js';
import { ProfessionalDto } from './src/dto/ProfessionalDto.js';
import { AgentDto } from './src/dto/AgentDto.js';

console.log('Running DTO Contract Tests...');

try {
  // --- CompanyDto Tests ---
  console.log('Testing CompanyDto...');
  
  // Test 1: Map from legalName
  let c1 = CompanyDto.fromApi({ id: '1', legalName: 'Acme Corp' });
  assert.strictEqual(c1.name, 'Acme Corp');

  // Test 2: Map from registeredName
  let c2 = CompanyDto.fromApi({ id: '2', registeredName: 'Beta Inc' });
  assert.strictEqual(c2.name, 'Beta Inc');

  // Test 3: Map from companyId
  let c3 = CompanyDto.fromApi({ companyId: '3', name: 'Gamma LLC' });
  assert.strictEqual(c3.id, '3');

  // Test 4: Missing Payload
  assert.throws(() => CompanyDto.fromApi(null), /Company payload missing/);

  // Test 5: Missing Identifier
  assert.throws(() => CompanyDto.fromApi({ name: 'Delta' }), /CRITICAL: Company identifier/);

  console.log('  ✔ CompanyDto passed.');

  // --- AuthDto Tests ---
  console.log('Testing AuthDto...');
  let a1 = AuthDto.fromApi({ accessToken: 'xyz', user: { principalId: 'u123', email: 'a@b.com' } });
  assert.strictEqual(a1.token, 'xyz');
  assert.strictEqual(a1.user.id, 'u123');

  assert.throws(() => AuthDto.fromApi({ user: { id: 'u1' } }), /CRITICAL: Authentication token/);
  assert.throws(() => AuthDto.fromApi({ token: 'abc', user: {} }), /CRITICAL: User identifier/);
  
  console.log('  ✔ AuthDto passed.');

  // --- ProfessionalDto Tests ---
  console.log('Testing ProfessionalDto...');
  let p1 = ProfessionalDto.fromApi({ workerId: 'w1', name: 'John' });
  assert.strictEqual(p1.id, 'w1');

  let p2 = ProfessionalDto.fromApi({ digitalProfessionalId: 'dp1', title: 'Dev' });
  assert.strictEqual(p2.id, 'dp1');

  assert.throws(() => ProfessionalDto.fromApi({ name: 'Jane' }), /CRITICAL: Professional identifier/);
  
  console.log('  ✔ ProfessionalDto passed.');

  // --- AgentDto Tests ---
  console.log('Testing AgentDto...');
  let ag1 = AgentDto.fromApi({ workerTemplateId: 'wt1', agentName: 'Support Bot' });
  assert.strictEqual(ag1.id, 'wt1');
  assert.strictEqual(ag1.name, 'Support Bot');
  assert.strictEqual(ag1.profession, 'Support Bot');

  let ag2 = AgentDto.fromApi({ professionId: 'prof1', professionName: 'Dev Bot' });
  assert.strictEqual(ag2.id, 'prof1');
  assert.strictEqual(ag2.name, 'Dev Bot');

  console.log('  ✔ AgentDto passed.');

  console.log('ALL TESTS PASSED SUCCESSFULLY!');
} catch (e) {
  console.error('TEST FAILED:', e);
  process.exit(1);
}
