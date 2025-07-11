import { cloudflareAccess } from '@hono/cloudflare-access';

// TODO: Get the team name from environment variables
const teamName = 'arnabbhowmik';

export const authMiddleware = cloudflareAccess(teamName);
