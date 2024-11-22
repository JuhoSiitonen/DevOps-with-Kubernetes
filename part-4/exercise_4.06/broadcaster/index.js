const NATS = require('nats')
const natsSC = NATS.StringCodec()
const botKey = process.env.BROADCASTER_KEY

NATS.connect({servers: process.env.NATS_URL ?? 'nats://nats:4222'})
    .then(async (conn) => {
        const sub = conn.subscribe('todo-data', { queue: 'broadcaster.workers' }) 
        for await (const message of sub) {
            console.log(`Sending message: ${natsSC.decode(message.data)}`)
            await fetch(`https://api.telegram.org/bot${botKey}/sendMessage?chat_id=1761737461&text=${natsSC.decode(message.data)}`)
        }
    })