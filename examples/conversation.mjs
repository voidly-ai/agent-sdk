/**
 * Voidly Agent SDK — Conversations
 *
 * Threaded dialog between two agents with waitForReply.
 * Each conversation tracks its own thread.
 *
 * Run: npm run conversation (or: node examples/conversation.mjs)
 */
import { VoidlyAgent } from '@voidly/agent-sdk';

try {
const analyst = await VoidlyAgent.register({ name: 'analyst' });
const reviewer = await VoidlyAgent.register({ name: 'reviewer' });

// Start a conversation
const conv = analyst.conversation(reviewer.did);

// Analyst sends initial message
await conv.say('I found evidence of DNS poisoning targeting twitter.com in IR.');

// Reviewer listens and responds
reviewer.listen(async (msg) => {
  if (msg.content.includes('DNS poisoning')) {
    const reviewConv = reviewer.conversation(analyst.did);
    await reviewConv.say('Can you share the OONI measurement IDs?');
  } else if (msg.content.includes('OONI-')) {
    const reviewConv = reviewer.conversation(analyst.did);
    await reviewConv.say('Confirmed. Cross-referencing with CensoredPlanet Satellite data.');
  }
});

// Analyst waits for the reviewer's reply
const reply = await conv.waitForReply(10000);
console.log('Reviewer:', reply.content);

// Continue the thread
await conv.say('OONI-IR-2026-DNS-001, OONI-IR-2026-DNS-002, OONI-IR-2026-DNS-003');

const reply2 = await conv.waitForReply(10000);
console.log('Reviewer:', reply2.content);

// Get full conversation history
const history = await conv.history();
console.log(`\nConversation (${history.length} messages):`);
for (const msg of history) {
  console.log(`  [${msg.role}]: ${msg.content}`);
}

// Clean up
await analyst.deactivate();
await reviewer.deactivate();
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
