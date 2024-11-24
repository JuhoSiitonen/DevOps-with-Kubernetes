const NATS = require('nats');
const fetch = require('node-fetch'); 
const natsCodec = NATS.StringCodec();
const webHook = process.env.WEBHOOK;
const natsURL = process.env.NATS_URL || 'nats://my-nats:4222';

NATS.connect({ servers: natsURL })
  .then(async (conn) => {
    const sub = conn.subscribe('todo-data', { queue: 'broadcaster.workers' });
    for await (const message of sub) {
      let messageDecoded = natsCodec.decode(message.data);
      console.log(`Sending message: ${messageDecoded}`);
      try {
        await fetch(webHook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: messageDecoded }),
        });
      } catch (error) {
        console.error('Error in broadcaster:', error);
      }
    }
  })
  .catch((err) => {
    console.error('Error connecting to NATS:', err);
  });
