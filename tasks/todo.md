# Task Breakdown: NeoForge 1.21.1 Handshake Support

## Task 1: Define ProtoDef schemas for NeoForge 1.21.1 negotiation packets

**Description:** Define the declarative ProtoDef JSON schema for NeoForge 1.21.1 network negotiation payloads (`neoforge:modded_network_query`, `neoforge:modded_network`, and `neoforge:modded_network_setup_failed`) under `src/client/data/neoforge.json`. Ensure the protocol parser properly encodes and decodes ResourceLocations, versions, flows, and channel setups.

**Acceptance criteria:**
- [x] `src/client/data/neoforge.json` contains type definitions for `neoforge:modded_network_query` (mapping protocol to query components).
- [x] Type definitions for `neoforge:modded_network` (network setup containing configuration and play components) are fully defined.
- [x] Unit test in `test/neoforgeProtoTest.js` verifies round-trip serialization of both payloads.

**Verification:**
- [x] Tests pass: `cd node-minecraft-protocol-forge && npx mocha test/neoforgeProtoTest.js`
- [x] Build succeeds: `cd node-minecraft-protocol-forge && npm run lint`
- [x] Manual check: verify buffer byte structure matches expected varint/string layout.

**Dependencies:** None

**Files likely touched:**
- `node-minecraft-protocol-forge/src/client/data/neoforge.json`
- `node-minecraft-protocol-forge/test/neoforgeProtoTest.js`

**Estimated scope:** Small (2 files)

---

## Checkpoint: Foundation
- [x] ProtoDef schema round-trip tests pass.
- [x] Existing tests in `node-minecraft-protocol-forge` pass.

---

## Task 2: Implement `neoForgeHandshake` module

**Description:** Implement `src/client/neoForgeHandshake.js` to handle client-side NeoForge negotiation during the `configuration` state. The handler will listen for incoming `custom_payload` packets on channel `neoforge:modded_network_query`, resolve the required channels and versions (either by reflecting the query or using options provided by the user), and reply with `neoforge:modded_network`.

**Acceptance criteria:**
- [x] `neoForgeHandshake(client, options)` registers listener for `custom_payload` during configuration state.
- [x] Correctly parses `neoforge:modded_network_query`.
- [x] Encodes and sends `neoforge:modded_network` with agreed components.
- [x] Supports optional custom channel and mod overrides via `options.channels` / `options.mods`.

**Verification:**
- [x] Tests pass: Unit test mocking incoming query packet and asserting outgoing response.
- [x] Build succeeds: `cd node-minecraft-protocol-forge && npm run lint`

**Dependencies:** Task 1

**Files likely touched:**
- `node-minecraft-protocol-forge/src/client/neoForgeHandshake.js`

**Estimated scope:** Small (1 file)

---

## Task 3: Integrate with index exports and auto-versioning

**Description:** Expose `neoForgeHandshake` from `node-minecraft-protocol-forge/index.js` and add an auto-detection hook in `src/client/autoVersionForge.js` so clients connecting with `version: false` or automated mod detection can automatically attach the NeoForge handler if the server advertises NeoForge in ping metadata.

**Acceptance criteria:**
- [x] `index.js` exports `neoForgeHandshake`.
- [x] `autoVersionForge.js` detects NeoForge servers from ping responses (or options) and initializes `neoForgeHandshake`.
- [x] Export definitions verified via `require('minecraft-protocol-forge')`.

**Verification:**
- [x] Tests pass: `cd node-minecraft-protocol-forge && npx mocha test/basicTest.js`
- [x] Build succeeds: `cd node-minecraft-protocol-forge && npm run lint`

**Dependencies:** Task 2

**Files likely touched:**
- `node-minecraft-protocol-forge/index.js`
- `node-minecraft-protocol-forge/src/client/autoVersionForge.js`

**Estimated scope:** Small (2 files)

---

## Checkpoint: Core Features
- [x] `neoForgeHandshake` is exported and hookable via `autoVersionForge`.
- [x] Core negotiation module functions cleanly in isolation.

---

## Task 4: Automated mock tests for NeoForge 1.21.1 Handshake

**Description:** Implement integration unit tests in `test/neoForgeHandshakeTest.js` using an EventEmitter / mock NMP client to simulate the full negotiation cycle: entering configuration state, receiving `neoforge:modded_network_query`, verifying the outgoing `neoforge:modded_network` custom payload, and completing configuration.

**Acceptance criteria:**
- [x] Mock test validates full handshake with default auto-negotiation.
- [x] Mock test validates custom user-specified mod overrides.
- [x] All assertions on packet channels and payload byte contents succeed.

**Verification:**
- [x] Tests pass: `cd node-minecraft-protocol-forge && npm test`
- [x] Build succeeds: `cd node-minecraft-protocol-forge && npm run lint`

**Dependencies:** Task 2, Task 3

**Files likely touched:**
- `node-minecraft-protocol-forge/test/neoForgeHandshakeTest.js`

**Estimated scope:** Small (1 file)

---

## Task 5: Mineflayer usage example and documentation

**Description:** Provide a working example script in `examples/neoforge_bot.js` demonstrating how to connect a Mineflayer bot to a NeoForge 1.21.1 server using `neoForgeHandshake`. Update `README.md` with documentation and instructions on connecting to modern NeoForge servers.

**Acceptance criteria:**
- [x] `examples/neoforge_bot.js` provides a clear, runnable Mineflayer example using the plugin.
- [x] `README.md` documents `neoForgeHandshake`, supported options (`mods`, `channels`), and 1.21.1 compatibility.

**Verification:**
- [x] Manual check: verify code syntax in example and documentation accuracy.
- [x] Build succeeds: `cd node-minecraft-protocol-forge && npm run lint`

**Dependencies:** Task 3, Task 4

**Files likely touched:**
- `node-minecraft-protocol-forge/examples/neoforge_bot.js`
- `node-minecraft-protocol-forge/README.md`

**Estimated scope:** Small (2 files)

---

## Task 6: Live NeoForge 1.21.1 Server Hosting & Mod Verification

**Description:** Auto-host a local NeoForge 1.21.1 server (21.1.265) with a "both" mod (Jade 15.10.6) and a "server-only" mod (Chunky 1.4.23), and connect a bot using `neoForgeHandshake` to verify full login, payload handling, and world interaction without kicks or exceptions.

**Acceptance criteria:**
- [x] Local NeoForge 1.21.1 server installed and started with Chunky & Jade mods.
- [x] Server configuration phase negotiation (`ping/pong`, `c:version`, `c:register`, `neoforge:register`, `neoforge:extensible_enum_ack`, `neoforge:feature_flag_ack`) succeeds.
- [x] Dynamic channel advertisement via `minecraft:register` registers `jade:*` channels so the server does not throw `Payload jade:server_ping_v1 may not be sent to the client!`.
- [x] Bot transitions successfully to `play` state, receives chunk batches, entities, and Jade HUD payload (`jade:server_ping_v1`), remaining in-world without being kicked.

**Verification:**
- [x] Integration test verified against live server: bot logged into PLAY state with entity id, joined the game, received world packets, and cleanly exited.
- [x] All 14 unit tests pass (`npm test`).
- [x] Linter passes (`npm run lint`).

**Dependencies:** Task 1, 2, 3, 4, 5

---

## Checkpoint: Complete
- [x] All test suites in `npm test` pass without error.
- [x] Linter passes (`npm run lint`).
- [x] Live NeoForge server test completed successfully.
- [x] Full plan execution reviewed and ready for merge.
