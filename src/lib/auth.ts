// Auth stub — real auth deferred until backend is wired up
// This file exists so TypeScript doesn't complain about missing imports elsewhere.

export async function auth() {
  return null
}

export const handlers = {
  GET: async () => new Response('Auth not configured', { status: 503 }),
  POST: async () => new Response('Auth not configured', { status: 503 }),
}

export async function signIn() {}
export async function signOut() {}
