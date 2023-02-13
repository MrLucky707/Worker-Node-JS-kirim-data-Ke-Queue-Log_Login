const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const amqp = require('amqplib/callback_api');

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { 
    id_user: 112233, 
    nama: 'John Wick', 
    time: new Date() } });
} else {
  amqp.connect({
    protocol: 'amqp',
    hostname: 'iwkrmq.pptik.id',
    port: 5672,
    username: 'trainerkit',
    password: '12345678',
    vhost: '/trainerkit'
  }, (error0, connection) => {
    if (error0) {
      throw error0;
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const queue = 'Log_Login';
      channel.assertQueue(queue, {
        durable: false
      });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify({ 
        id_user: workerData.id_user, 
        nama: workerData.nama, time: 
        workerData.time })));
      console.log(" [x] Data Terkirim %s", JSON.stringify({ 
        id_user: workerData.id_user, 
        nama: workerData.nama, 
        time: workerData.time }));
    });
    setTimeout(() => {
      connection.close();
      process.exit(0)
    }, 500);
  });
}
