'use strict'

const mc = require('./mineflayer/node_modules/minecraft-protocol')
const { neoForgeHandshake } = require('./node-minecraft-protocol-forge')

console.log('Testing pure node-minecraft-protocol with neoForgeHandshake...')

const client = mc.createClient({
  host: '127.0.0.1',
  port: 25575,
  username: 'NmpBot',
  version: '1.21.1'
})

neoForgeHandshake(client, {
  autoNegotiate: true
})

client.on('state', s => console.log('[NMP STATE]', s))
client.on('custom_payload', p => console.log('[NMP PAYLOAD]', p.channel))
client.on('login', packet => {
  console.log('[NMP LOGIN] Successfully logged into play state! Entity ID:', packet.entityId)
  setTimeout(() => {
    console.log('[NMP SUCCESS] Play state stable for 2 seconds!')
    client.end()
    process.exit(0)
  }, 2000)
})
client.on('kicked', r => console.log('[NMP KICKED]', JSON.stringify(r)))
client.on('error', e => console.error('[NMP ERROR]', e))

setTimeout(() => {
  console.error('[NMP TIMEOUT] 10s elapsed')
  process.exit(1)
}, 10000)
