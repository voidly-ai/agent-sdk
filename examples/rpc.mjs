/**
 * Voidly Agent SDK — Remote Procedure Calls
 *
 * One agent exposes functions that another agent can call remotely.
 * All RPC traffic is E2E encrypted.
 *
 * Run: npm run rpc (or: node examples/rpc.mjs)
 */
import { VoidlyAgent } from '@voidly/agent-sdk';

try {
// Register a "service" agent that exposes functions
const service = await VoidlyAgent.register({ name: 'translate-service' });

// Register RPC handlers
service.onInvoke('translate', async (params, callerDid) => {
  console.log(`Translation request from ${callerDid}`);
  // In a real app, call a translation API here
  return {
    original: params.text,
    translated: `[translated to ${params.target}]: ${params.text}`,
    language: params.target,
  };
});

service.onInvoke('summarize', async (params) => {
  return {
    summary: `Summary of ${params.text.length} chars: ${params.text.substring(0, 50)}...`,
    wordCount: params.text.split(' ').length,
  };
});

// Register a "client" agent that calls the service
const client = await VoidlyAgent.register({ name: 'rpc-client' });

// Call the remote translate function (encrypted round-trip)
const result = await client.invoke(service.did, 'translate', {
  text: 'Internet censorship is increasing globally',
  target: 'es',
});

console.log('RPC Result:', result);

// Call summarize
const summary = await client.invoke(service.did, 'summarize', {
  text: 'The Voidly Censorship Intelligence Platform monitors internet freedom across 126 countries using 39+ probe nodes and ML classification.',
});

console.log('Summary:', summary);

// Clean up
await service.deactivate();
await client.deactivate();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
