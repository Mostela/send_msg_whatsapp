const amqp = require("amqplib/callback_api");
const { Client, LocalAuth, Buttons, List} = require('whatsapp-web.js');


const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-features=AudioServiceOutOfProcess',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]}
});


client.initialize();

amqp.connect(`amqp://${process.env.HOST_MQ}${process.env.VIRTUAL_MQ}`, function(error0, connection) {
    if (error0) {
        throw error0;
    }

    const channel = connection.createChannel()
    const queue = process.env.QUEUE;
    channel.prefetch(3);

    client.on('qr', (qr) => {
        console.log('QR Code number to generator', qr);
    });

    client.on('ready', () => {
        console.info('Client is ready!');

        channel.consume(queue, function(msg) {
            const {text, mobile} = JSON.parse(msg.content.toString());
            client.sendMessage(`${mobile}@c.us`, text).then(r => {});

            // let sections = [{title:'sectionTitle',rows:[{title:'ListItem1', description: 'desc'},{title:'ListItem2'}]}];
            // let list = new List('List body','btnText',sections,'Title','footer');
            // client.sendMessage(`${mobile}@c.us`, list);

            console.info({mobile, text})
            channel.ack(msg);
        });
    });
});
