import { CryptoService } from './frontend/src/security/CryptoService.js';

async function test() {
  const wizardData = { company: { name: "Test Corp" } };
  const userId = "12345-67890-12345";
  
  try {
    const encrypted = await CryptoService.encryptData(wizardData, userId);
    console.log("Encrypted:", encrypted);
    
    const stringified = JSON.stringify(encrypted);
    console.log("Stringified length:", stringified.length);
    
    const parsed = JSON.parse(stringified);
    const decrypted = await CryptoService.decryptData(parsed, userId);
    console.log("Decrypted:", decrypted);
    
  } catch(e) {
    console.error("ERROR:", e);
  }
}

test();
