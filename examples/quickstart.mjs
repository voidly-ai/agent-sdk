/**
 * Voidly Agent SDK — Quick Start
 *
 * Register two agents and exchange an encrypted message in 15 lines.
 *
 * Run: node examples/quickstart.mjs
 */
import { VoidlyAgent } from '@voidly/agent-sdk';

// Register two agents (keys generated client-side)
const alice = await VoidlyAgent.register({ name: 'alice-demo' });
const bob = await VoidlyAgent.register({ name: 'bob-demo' });

console.log('Alice DID:', alice.did);
console.log('Bob DID:  ', bob.did);

// Alice sends an E2E encrypted message to Bob
const result = await alice.send(bob.did, 'Hello from Alice! This message is end-to-end encrypted.');
console.log('Sent:', result);

// Bob receives and decrypts
const messages = await bob.receive();
for (const msg of messages) {
  console.log(`From: ${msg.from}`);
  console.log(`Content: ${msg.content}`);
  console.log(`Encrypted: true (decrypted client-side)`);
}

// Export credentials for later use
const creds = alice.exportCredentials();
console.log('\nAlice credentials saved. Restore with:');
console.log('  const restored = VoidlyAgent.fromCredentials(creds)');

// Clean up
await alice.deactivate();
await bob.deactivate();
console.log('\nAgents deactivated.');
