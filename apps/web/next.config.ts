import type { NextConfig } from 'next';
import { resolve } from 'path';
import { config } from 'dotenv';

/** @gitignore todo 22jan: add withNx and check babelRootMode: true -- but why -- stop don't do */
config({
  path: resolve(__dirname, '../../.env'),
});

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      '~/*': './src/*',
    },
  },
};

export default nextConfig;

/**
When using it is a mistake
  You have one Next app, small team, low churn.
  You don’t reuse code across apps.
  Your CI is simple and already fast.
  You’re optimizing prematurely.

In that case, Nx is friction, not leverage.

When it’s the right call
  Multiple Next apps or you know you’ll have them.
  Shared UI/design system.
  Growing team where consistency matters.
  CI time is becoming painful.
  You care about long-term maintainability more than day-1 simplicity.
 */
