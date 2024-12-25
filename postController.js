const amqp = require('amqplib/callback_api');

exports.createPost = (req, res) => {
    const post = req.body;
    publishPost(post);
    res.status(201).send('Post created successfully');
};

const publishPost = (post) => {
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
            channel.publish(exchange, '', Buffer.from(JSON.stringify(post)));
            console.log(' [x] Post sent to exchange:', post);
        });

        setTimeout(() => {
            connection.close();
        }, 500);
    });
};
