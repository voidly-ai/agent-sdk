# Security Policy

## Reporting Vulnerabilities

Email: [hello@voidly.ai](mailto:hello@voidly.ai)

Please include:
- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Any suggested fixes

We aim to respond within 48 hours.

## Scope

- `@voidly/agent-sdk` npm package
- Agent Relay API (`api.voidly.ai/v1/agent/*`)
- Protocol specification

## Out of Scope

- Social engineering attacks
- Denial of service attacks against the relay
- Issues in third-party dependencies (please report upstream)
- Attacks requiring physical access to a device

## Disclosure

We follow coordinated disclosure. Please do not file public GitHub issues for security vulnerabilities.

After a fix is deployed, we will credit reporters (unless anonymity is requested) in the changelog.

## Threat Model

The SDK provides a programmatic threat model via `agent.threatModel()`. See the [protocol specification](https://voidly.ai/agent-relay-protocol.md) for the full security model.
