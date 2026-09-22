/**
 * Checks Supabase env vars and a live workshops read (no secrets printed).
 * Usage: npm run verify:supabase   (from clubcraft/)
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(root, '.env.local');

function loadEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const fileEnv = loadEnvFile(envPath);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || fileEnv.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fileEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY || fileEnv.SUPABASE_SERVICE_ROLE_KEY;

const missing = [];
if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
if (!anon) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
if (!service) missing.push('SUPABASE_SERVICE_ROLE_KEY');

if (missing.length) {
  console.error('Missing in .env.local:', missing.join(', '));
  console.error('See docs/SECRETS.md — then run migration.sql in the Supabase SQL Editor.');
  process.exit(1);
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await admin
  .from('workshops')
  .select('id, title')
  .limit(3);

if (error) {
  console.error('Supabase query failed:', error.message);
  if (/relation.*does not exist/i.test(error.message)) {
    console.error('Run supabase/migration.sql in Supabase → SQL Editor.');
  }
  process.exit(1);
}

console.log('Supabase OK — workshops reachable:', data?.length ?? 0, 'row(s) sampled.');
process.exit(0);
