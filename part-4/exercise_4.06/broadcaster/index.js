const NATS = require('nats')
const natsCodec = NATS.StringCodec()
const botKey = process.env.BROADCASTER_KEY

const natsURL = process.env.NATS_URL || 'nats://nats:4222'

NATS.connect({servers: natsURL})
    .then(async (conn) => {
        const sub = conn.subscribe('todo-data', { queue: 'broadcaster.workers' }) 
        for await (const message of sub) {
            console.log(`Sending message: ${natsCodec.decode(message.data)}`)
            await fetch(`https://api.telegram.org/bot${botKey}/sendMessage?chat_id=1761737461&text=${natsSC.decode(message.data)}`)
        }
    })