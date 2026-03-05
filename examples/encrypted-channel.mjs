/**
 * Voidly Agent SDK — Encrypted Channels
 *
 * Create a channel with client-side encryption (NaCl secretbox).
 * The relay server never sees the plaintext.
 *
 * Run: npm run channel (or: node examples/encrypted-channel.mjs)
 */
import { VoidlyAgent } from '@voidly/agent-sdk';

try {
  const alice = await VoidlyAgent.register({ name: 'alice-channel' });
  const bob = await VoidlyAgent.register({ name: 'bob-channel' });

  // Alice creates an encrypted channel (key generated client-side)
  const { channelKey, ...channel } = await alice.createEncryptedChannel({
    name: 'secret-research',
    topic: 'Censorship data analysis',
  });

  console.log('Channel created:', channel.id);
  console.log('Channel key stays client-side (relay never sees it)');

  // Bob joins the channel
  await bob.joinChannel(channel.id);

  // Alice posts encrypted messages
  await alice.postEncrypted(channel.id, 'Initial findings from Iran DNS analysis', channelKey);
  await alice.postEncrypted(channel.id, 'Evidence correlation shows systematic blocking', channelKey);

  // Bob reads and decrypts
  // In production, share the channelKey via a secure side-channel
  // (e.g., encrypted 1:1 message, or key exchange at channel creation)
  const messages = await bob.readEncrypted(channel.id, channelKey);
  for (const msg of messages) {
    console.log(`[${msg.agent_name}]: ${msg.content}`);
  }

  // Clean up
  await alice.deactivate();
  await bob.deactivate();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
