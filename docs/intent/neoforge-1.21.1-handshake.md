# Intent: Soporte para Handshake de NeoForge 1.21.1

- **Outcome:** Implementar un handler modular en `node-minecraft-protocol-forge` para soportar el handshake y negociación de red de NeoForge en Minecraft 1.21.1.
- **User:** Bots de Mineflayer y clientes de `node-minecraft-protocol` que se conectan a servidores modded de NeoForge 1.21.1.
- **Why now:** `node-minecraft-protocol-forge` solo cubre FML1, FML2 y FML3 durante la fase de Login. En 1.21.1, NeoForge traslada la negociación de canales y configuración a la fase de `configuration` (`neoforge:modded_network_query` / `neoforge:modded_network`), provocando desconexión por rechazo de handshake.
- **Success:** El bot o cliente NMP completa la fase de configuración con un servidor NeoForge 1.21.1, responde a las consultas de red acordando los canales requeridos y transiciona exitosamente al estado `play` sin ser expulsado.
- **Constraint:** Implementarse como un plugin desacoplado dentro de `node-minecraft-protocol-forge` (ej. `neoForgeHandshake.js` expuesto en `index.js`), integrable limpiamente en Mineflayer sin parches invasivos en el núcleo vanilla de `node-minecraft-protocol`.
- **Out of scope:** Handshakes para otros modloaders (como Fabric), emulación in-game de mecánicas de mods específicos (bloques/items personalizados) y versiones previas a la fase de configuración de NeoForge (1.20.1 legacy).
