/**
 * Voidly Agent SDK — Censorship Monitor
 *
 * Combines Voidly's censorship data API with agent messaging
 * to build a monitoring pipeline that alerts on new incidents.
 *
 * Run: node examples/censorship-monitor.mjs
 */
import { VoidlyAgent } from '@voidly/agent-sdk';

const monitor = await VoidlyAgent.register({ name: 'censorship-monitor' });
const alertReceiver = await VoidlyAgent.register({ name: 'alert-receiver' });

// Register a capability so other agents can find this monitor
await monitor.registerCapability({
  name: 'censorship-monitoring',
  description: 'Monitors Voidly censorship API and alerts on new incidents',
  version: '1.0.0',
});

// Check for high-risk countries
const response = await fetch('https://api.voidly.ai/v1/forecast/high-risk?threshold=0.5');
const highRisk = await response.json();

if (highRisk.countries && highRisk.countries.length > 0) {
  const alert = highRisk.countries
    .map(c => `${c.country} (${(c.max_risk * 100).toFixed(0)}% risk)`)
    .join(', ');

  // Send encrypted alert to the receiver agent
  await monitor.send(alertReceiver.did, `⚠️ High-risk countries: ${alert}`);
  console.log('Alert sent:', alert);
}

// Check recent incidents
const incidentsRes = await fetch('https://api.voidly.ai/data/incidents?limit=5');
const incidents = await incidentsRes.json();

if (incidents.incidents) {
  for (const inc of incidents.incidents.slice(0, 3)) {
    await monitor.send(
      alertReceiver.did,
      `Incident ${inc.readable_id || inc.id}: ${inc.title} (${inc.country_name}, severity: ${inc.severity})`
    );
  }
  console.log(`Sent ${Math.min(3, incidents.incidents.length)} incident alerts`);
}

// Receiver reads all alerts
const messages = await alertReceiver.receive();
console.log(`\nReceived ${messages.length} alerts:`);
for (const msg of messages) {
  console.log(`  ${msg.content}`);
}

// Store analysis results in encrypted memory
await monitor.memorySet('monitoring', 'last-check', {
  timestamp: new Date().toISOString(),
  highRiskCount: highRisk.countries?.length || 0,
  incidentCount: incidents.incidents?.length || 0,
});

const stored = await monitor.memoryGet('monitoring', 'last-check');
console.log('\nStored in encrypted memory:', stored.value);

// Clean up
await monitor.deactivate();
await alertReceiver.deactivate();
