// Trying out just to see how a fixture would look and work

import { test as base, expect, type APIRequestContext } from '@playwright/test';

async function seed(request: APIRequestContext, name: string): Promise<void> {
  const response = await request.post('/api/test/seed', { data: { name } });
  if (!response.ok()) {
    throw new Error(`seed "${name}" failed: ${response.status()} ${await response.text()}`);
  }
}

type Fixtures = {
  seed: (name: string) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  seed: async ({ request }, use) => {
    await use((name: string) => seed(request, name));
  }
});

export { expect };