# Implementation Plan: NeoForge 1.21.1 Handshake Support

## Overview
Implement modular support for NeoForge 1.21.1 handshake and channel negotiation within `node-minecraft-protocol-forge`. Minecraft 1.21.1 and modern NeoForge handle mod negotiation during the native `configuration` protocol phase (via `neoforge:modded_network_query` and `neoforge:modded_network` custom payloads) rather than legacy login-wrapper packets. This plan provides packet schemas, a dedicated `neoForgeHandshake` client handler, auto-detection integration, and verification suites to allow Mineflayer bots and NMP clients to connect without being kicked.

## Architecture Decisions
- **Placement in `node-minecraft-protocol-forge`:** Implement as a standalone modular handler (`src/client/neoForgeHandshake.js`) alongside existing `forgeHandshake.js` (FML1), `forgeHandshake2.js` (FML2), and `forgeHandshake3.js` (FML3).
- **Configuration Phase Interception:** Hook directly into `node-minecraft-protocol` client lifecycle events during `configuration` state (listening for `custom_payload` packets matching `neoforge:modded_network_query` and `minecraft:register`).
- **ProtoDef Serialization:** Define a declarative ProtoDef JSON specification (`src/client/data/neoforge.json`) for encoding and decoding NeoForge 1.21.1 negotiation packets (`neoforge:modded_network_query`, `neoforge:modded_network`, and `neoforge:modded_network_setup_failed`).
- **Flexible Mod Resolution:** Support both automated reflection/agreement (mirroring queried channels with matched versions for maximum compatibility) and user-supplied explicit channel/mod lists.

## Task List

### Phase 1: Foundation & Protocol Schemas
- [x] **Task 1: Define ProtoDef schemas for NeoForge 1.21.1 negotiation packets**
  - Create `src/client/data/neoforge.json` containing serializers for `neoforge:modded_network_query` and `neoforge:modded_network`.
  - Add unit test verifying serialization/deserialization.

### Checkpoint: Foundation
- [x] Unit tests for ProtoDef packet definitions pass.
- [x] No regression in existing tests (`npm test`).

### Phase 2: Core Handshake Implementation
- [x] **Task 2: Implement `neoForgeHandshake` module**
  - Implement `src/client/neoForgeHandshake.js` to manage the configuration state handshake flow, listen for `modded_network_query`, and reply with `modded_network`.
- [x] **Task 3: Integrate with index exports and auto-versioning**
  - Export `neoForgeHandshake` in `index.js`.
  - Add auto-detection hook in `src/client/autoVersionForge.js`.

### Checkpoint: Core Features
- [x] `neoForgeHandshake` module can be imported and attached to a client.
- [x] End-to-end simulated handshake flow responds correctly to queries.

### Phase 3: Verification & Integration
- [x] **Task 4: Automated mock tests for NeoForge 1.21.1 Handshake**
  - Create `test/neoForgeHandshakeTest.js` simulating a 1.21.1 server configuration phase with NeoForge negotiation payloads.
- [x] **Task 5: Mineflayer usage example and documentation**
  - Create `examples/neoforge_bot.js` showcasing Mineflayer bot connection with `neoForgeHandshake`.
  - Update `README.md` with instructions and code snippets.

### Checkpoint: Complete
- [x] All test suites pass.
- [x] Code conforms to standard linter rules (`npm run lint`).
- [x] Ready for user review.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Differences between vanilla `configuration` finish timing and NeoForge config tasks | Medium | Listen for `neoforge:modded_network_query` as soon as client enters `configuration` state before acknowledging `finish_configuration`. |
| Server rejects mismatched mod versions | High | Default to auto-mirroring server-requested channels and versions unless explicit user overrides are provided. |
| Incompatible ProtoDef types for modern Minecraft data formats | Medium | Reuse tested native ProtoDef mappings (`pstring`, `varint`, containers) matching 1.21.1 wire specifications. |

## Open Questions
- *None at this stage; requirements and version target (1.21.1) confirmed during interview.*
