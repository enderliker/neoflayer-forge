# NeoFlayer Forge (Minecraft 1.21.1 NeoForge Support)

Handshake and mod negotiation support for **Minecraft 1.21.1 NeoForge** in [Mineflayer](https://github.com/PrismarineJS/mineflayer) and [node-minecraft-protocol](https://github.com/PrismarineJS/node-minecraft-protocol) via [node-minecraft-protocol-forge](https://github.com/enderliker/node-minecraft-protocol-forge).

---

## Overview

Minecraft 1.21.1 NeoForge introduces a modernized network configuration architecture:
- **Configuration Phase Lifecycle:** Negotiation takes place before entering the `play` state, including `packet_ping` / `packet_pong` synchronization.
- **Common Network Specification:** Channels and capabilities are negotiated via `c:version` and `c:register` (`CommonRegisterPayload`).
- **NeoForge Internal Negotiation:** Handshakes for modded queries (`neoforge:register` / `neoforge:network`), extensible enums (`neoforge:extensible_enum_data` -> `neoforge:extensible_enum_ack`), and feature flags (`neoforge:feature_flag_data` -> `neoforge:feature_flag_acknowledge`).
- **Strict Channel Verification:** The server strictly checks registered client channels via `NetworkRegistry.checkPacket(...)`, requiring client registration for mod channels such as `jade:server_ping_v1`.

---

## Workspace Layout

```
.
├── node-minecraft-protocol-forge/  # Core plugin implementing neoForgeHandshake (forked)
├── mineflayer/                     # Upstream Mineflayer test environment
├── node-minecraft-protocol/        # Upstream NMP test environment
├── docs/                           # Architecture and design intent documentation
├── tasks/                          # Task breakdown and implementation plan
└── test_server/                    # Auto-hosted NeoForge 1.21.1 server harness with Jade & Chunky
```

---

## Core Library Repository

The core implementation is published in the fork:
👉 **[enderliker/node-minecraft-protocol-forge](https://github.com/enderliker/node-minecraft-protocol-forge)**

### Quick Usage

```javascript
const mc = require('minecraft-protocol')
const { neoForgeHandshake } = require('minecraft-protocol-forge')

const client = mc.createClient({
  host: 'localhost',
  port: 25565,
  username: 'NeoBot',
  version: '1.21.1'
})

// Attach NeoForge 1.21.1 handshake handler
neoForgeHandshake(client, {
  autoNegotiate: true,
  channels: {
    // Optional channel overrides:
    // 'jade:server_ping_v1': '1'
  }
})

client.on('login', () => {
  console.log('Logged into NeoForge world!')
})
```

---

## Testing Against Local Server

1. **Start the local NeoForge test server:**
   ```bash
   cd test_server
   bash run.sh nogui
   ```

2. **Run the integration client:**
   ```bash
   node node-minecraft-protocol-forge/examples/neoforge_nmp_client.js 127.0.0.1 25575
   ```

3. **Run unit tests:**
   ```bash
   cd node-minecraft-protocol-forge
   npm test
   npm run lint
   ```
