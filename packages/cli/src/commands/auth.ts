import * as readline from 'readline';
import { readStoredConfig, saveStoredConfig, verifyRemoteLicense } from '../utils/auth.js';

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

export async function authCommand(keyArgument?: string, options: { status?: boolean; logout?: boolean } = {}) {
  const config = readStoredConfig();

  if (options.logout) {
    saveStoredConfig({});
    console.log('\x1b[32m✔ Logged out successfully. Stored NexoreUI Pro license removed.\x1b[0m');
    return;
  }

  if (options.status || keyArgument === '--status') {
    if (!config.licenseKey) {
      console.log('\x1b[33mNo NexoreUI Pro license found on this machine.\x1b[0m');
      console.log('Authenticate by running: \x1b[36mnpx nexoreui auth <your-license-key>\x1b[0m');
      console.log('Get a license at: \x1b[36mhttps://nexoreui.site/pricing\x1b[0m\n');
      return;
    }

    console.log('\n\x1b[34m\x1b[1m=== NexoreUI Pro License Status ===\x1b[0m');
    console.log(`\x1b[32mLicense Key:\x1b[0m    ${config.licenseKey}`);
    if (config.ownerEmail) {
      console.log(`\x1b[32mOwner Email:\x1b[0m    ${config.ownerEmail}`);
    }
    if (config.authenticatedAt) {
      console.log(`\x1b[32mLast Verified:\x1b[0m  ${new Date(config.authenticatedAt).toLocaleString()}`);
    }
    console.log('\x1b[32mStatus:\x1b[0m         Active and verified\n');
    return;
  }

  let key = keyArgument?.trim();

  if (!key && config.licenseKey) {
    console.log(`\n\x1b[32m✔ Currently authenticated with key:\x1b[0m ${config.licenseKey}`);
    if (config.ownerEmail) {
      console.log(`\x1b[90mRegistered to: ${config.ownerEmail}\x1b[0m`);
    }
    const answer = await askQuestion('\nWould you like to replace your current license key? (y/N): ');
    if (answer.trim().toLowerCase() !== 'y' && answer.trim().toLowerCase() !== 'yes') {
      console.log('\x1b[90mKeeping existing license.\x1b[0m\n');
      return;
    }
  }

  if (!key) {
    const input = await askQuestion('\nEnter your NexoreUI Pro license key (NX-PRO-XXXXXX-XXXXXX-XXXXXX): ');
    key = input.trim();
  }

  if (!key) {
    console.error('\n\x1b[31mError: License key cannot be empty.\x1b[0m');
    console.log('You can purchase a NexoreUI Pro license at: \x1b[36mhttps://nexoreui.site/pricing\x1b[0m\n');
    return;
  }

  console.log('\n\x1b[33mVerifying license key...\x1b[0m');
  const result = await verifyRemoteLicense(key);

  if (!result.valid) {
    console.error(`\n\x1b[31m✖ License verification failed:\x1b[0m ${result.error || 'Invalid license key.'}`);
    console.log('Please ensure your key matches the format NX-PRO-XXXXXX-XXXXXX-XXXXXX.');
    console.log('Need assistance? Contact support at: \x1b[36mnexoreuiteam@mail.ru\x1b[0m\n');
    return;
  }

  const cleanKey = key.toUpperCase();
  saveStoredConfig({
    licenseKey: cleanKey,
    ownerEmail: result.owner,
    authenticatedAt: Date.now(),
  });

  console.log('\n\x1b[32m\x1b[1m✔ NexoreUI Pro license activated successfully!\x1b[0m');
  if (result.owner) {
    console.log(`\x1b[34mOwner:\x1b[0m   ${result.owner}`);
  }
  console.log(`\x1b[34mTier:\x1b[0m    ${result.tier || 'NexoreUI Pro Lifetime'}`);
  if (result.activationsCount !== undefined && result.maxDevices !== undefined) {
    console.log(`\x1b[34mDevices:\x1b[0m ${result.activationsCount}/${result.maxDevices} active machine slots used`);
  }
  console.log('\x1b[90mAll Pro templates and assets are now unlocked in the CLI.\x1b[0m\n');
}
