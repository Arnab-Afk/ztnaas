import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		reporters: ['verbose'],
	},
	poolOptions: {
		workers: {
			wranglerConfig: 'wrangler.jsonc',
			compatibilityDate: '2025-07-09',
			compatibilityFlags: ['export_commonjs_default'],
		},
	},
});
