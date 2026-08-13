const amqp = require('amqplib');

let channel, connection;

const notifyRabbitMQ = async () => {
  try {
    connection = await amqp.connect('amqp://rabbitmq');
    channel = await connection.createChannel();

    await channel.assertQueue('task_created');
    console.log('Notification service is listening for task_created events...');

    channel.consume('task_created', (msg) => {
      const taskData = JSON.parse(msg.content.toString());
      console.log('Received task_created event:', taskData);
      channel.ack(msg);
    });
  } catch (error) {
    console.error('RabbitMQ connection failed: ', error.message);
  }
};

notifyRabbitMQ();
