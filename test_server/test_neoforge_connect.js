'use strict'

const mineflayer = require('./mineflayer')
const { neoForgeHandshake } = require('./node-minecraft-protocol-forge')

console.log('Connecting NeoForgeBot with neoForgeHandshake plugin to port 25575...')

const bot = mineflayer.createBot({
  host: '127.0.0.1',
  port: 25575,
  username: 'NeoBot',
  version: '1.21.1'
})

bot._client.on('state', (state) => {
  console.log('[BOT STATE] State changed to:', state)
})

bot._client.on('custom_payload', (packet) => {
  console.log('[BOT CUSTOM_PAYLOAD] Received channel:', packet.channel, 'data length:', packet.data ? packet.data.length : 0)
})

bot._client.on('neoforge_negotiated', (setup) => {
  console.log('[BOT NEOFORGE] Negotiated setup successfully!')
  for (const s of setup.channels) {
    console.log(`  Protocol: ${s.protocol}, Channels: ${s.channels.map(c => c.key + '@' + c.value.chosenVersion).join(', ')}`)
  }
})

neoForgeHandshake(bot._client, {
  autoNegotiate: true
})

bot.on('login', () => {
  console.log('[BOT EVENT] Bot login event fired!')
})

bot.on('spawn', () => {
  console.log('[BOT EVENT] Bot spawned successfully in the game world!')
  setTimeout(() => {
    console.log('Test successful! Disconnecting bot cleanly.')
    bot.quit()
    process.exit(0)
  }, 2000)
})

bot.on('kicked', (reason) => {
  console.error('[BOT KICKED] Reason:', JSON.stringify(reason))
})

bot.on('error', (err) => {
  console.error('[BOT ERROR]:', err)
})

setTimeout(() => {
  console.error('[TEST TIMEOUT] 15s elapsed without spawning')
  process.exit(1)
}, 15000)
