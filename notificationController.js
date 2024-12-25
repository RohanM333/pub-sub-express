const amqp = require('amqplib/callback_api');

exports.consumePosts = () => {
    amqp.connect('amqp://localhost', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }
            const exchange = 'posts_exchange';

            channel.assertExchange(exchange, 'fanout', { durable: false });
            channel.assertQueue('', { exclusive: true }, (error2, q) => {
                if (error2) {
                    throw error2;
                }
                console.log(` [*] Waiting for posts in queue ${q.queue}`);

                channel.bindQueue(q.queue, exchange, '');

                channel.consume(q.queue, (msg) => {
                    if (msg.content) {
                        const post = JSON.parse(msg.content.toString());
                        console.log(' [x] Received post:', post);
                        sendNotification(post);
                    }
                }, { noAck: true });
            });
        });
    });
};

const sendNotification = (post) => {
    console.log(' [x] Sending notification for post:', post);
    // Logic to send notification (e.g., email, SMS)
};
