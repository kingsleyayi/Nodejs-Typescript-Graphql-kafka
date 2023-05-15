import { Kafka, Partitioners, logLevel } from 'kafkajs';
import { kafkaBroker, kafkaClientId, kafkaPassword, kafkaUsername } from '../config';

const kafka = new Kafka({
  clientId: kafkaClientId,
  brokers: [kafkaBroker],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: kafkaUsername,
    password: kafkaPassword,
  },
  logLevel: logLevel.ERROR
});

export const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const consumer = kafka.consumer({ groupId: 'transactionViewer',maxWaitTimeInMs: 5000  });

export const initiateKafka = async () => {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'transaction', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value?.toString(),
      });
    },
  });
};