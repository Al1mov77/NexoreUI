import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as crypto from 'crypto';

export interface CliConfig {
  licenseKey?: string;
  ownerEmail?: string;
  authenticatedAt?: number;
}

function getConfigPath(): string {
  const homeDir = os.homedir();
  const configDir = path.join(homeDir, '.nexoreui');
  if (!fs.existsSync(configDir)) {
    try {
      fs.mkdirSync(configDir, { recursive: true });
    } catch {
      // Ignore directory creation failure
    }
  }
  return path.join(configDir, 'config.json');
}

export function getOrCreateDeviceId(): { deviceId: string; deviceName: string } {
  const homeDir = os.homedir();
  const configDir = path.join(homeDir, '.nexoreui');
  const idPath = path.join(configDir, 'device_id');
  const hostName = os.hostname() || 'developer-machine';
  const username = os.userInfo?.()?.username || 'user';
  const deviceName = `${hostName} (${username})`;

  try {
    if (fs.existsSync(idPath)) {
      const existing = fs.readFileSync(idPath, 'utf8').trim();
      if (existing) return { deviceId: existing, deviceName };
    }
  } catch {
    // Ignore read failure
  }

  const rawSeed = `${hostName}::${username}::${os.platform()}::${os.arch()}::${crypto.randomBytes(8).toString('hex')}`;
  const deviceId = `dev_${crypto.createHash('sha256').update(rawSeed).digest('hex').slice(0, 24)}`;

  try {
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    fs.writeFileSync(idPath, deviceId, 'utf8');
  } catch {
    // Ignore write failure
  }

  return { deviceId, deviceName };
}

export function readStoredConfig(): CliConfig {
  const envKey = process.env.NEXOREUI_LICENSE_KEY?.trim();
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(content) as CliConfig;
      if (envKey && !parsed.licenseKey) {
        parsed.licenseKey = envKey;
      }
      return parsed;
    }
  } catch {
  }
  return envKey ? { licenseKey: envKey } : {};
}

export function saveStoredConfig(config: CliConfig): void {
  try {
    const configPath = getConfigPath();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch {
  }
}

export async function verifyRemoteLicense(key: string): Promise<{
  valid: boolean;
  owner?: string;
  tier?: string;
  error?: string;
  activationsCount?: number;
  maxDevices?: number;
}> {
  const cleanKey = key.trim().toUpperCase();
  const { deviceId, deviceName } = getOrCreateDeviceId();
  const apiUrls = [
    process.env.NEXOREUI_API_URL,
    'https://www.nexoreui.site',
    'https://nexoreui.site',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3001',
  ].filter(Boolean) as string[];

  for (const baseUrl of apiUrls) {
    try {
      const url = `${baseUrl}/api/licenses/verify?key=${encodeURIComponent(cleanKey)}&device_id=${encodeURIComponent(deviceId)}&device_name=${encodeURIComponent(deviceName)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'nexoreui-cli/2.0.2',
        },
        signal: AbortSignal.timeout(3500),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.valid) {
          return {
            valid: true,
            owner: json.owner,
            tier: json.tier,
            activationsCount: json.activationsCount,
            maxDevices: json.maxDevices,
          };
        } else {
          return {
            valid: false,
            error: json.error || 'License verification failed',
            activationsCount: json.activationsCount,
            maxDevices: json.maxDevices,
          };
        }
      } else {
        const json = await res.json().catch(() => ({}));
        if (json.error) {
          return {
            valid: false,
            error: json.error,
          };
        }
      }
    } catch {
      // Try next endpoint
    }
  }

  return {
    valid: false,
    error: 'License verification service unreachable or key is invalid.',
  };
}

export async function fetchRemoteTemplate(
  name: string,
  key: string
): Promise<{
  valid: boolean;
  name?: string;
  slug?: string;
  fileName?: string;
  content?: string;
  dependencies?: string[];
  assets?: string[];
  error?: string;
}> {
  const { deviceId, deviceName } = getOrCreateDeviceId();
  const apiUrls = [
    process.env.NEXOREUI_API_URL,
    'https://www.nexoreui.site',
    'https://nexoreui.site',
    'http://127.0.0.1:3000',
    'http://localhost:3000',
  ].filter(Boolean) as string[];

  for (const baseUrl of apiUrls) {
    try {
      const url = `${baseUrl}/api/registry/pro?name=${encodeURIComponent(name)}&key=${encodeURIComponent(key)}&device_id=${encodeURIComponent(deviceId)}&device_name=${encodeURIComponent(deviceName)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'nexoreui-cli/2.0.2',
        },
        signal: AbortSignal.timeout(8000),
      });

      const json = await res.json();
      if (res.ok && json.valid) {
        return json;
      } else if (json.error) {
        return { valid: false, error: json.error };
      }
    } catch {
      // try next endpoint
    }
  }

  return {
    valid: false,
    error: 'Failed to connect to NexoreUI Pro registry server.',
  };
}
