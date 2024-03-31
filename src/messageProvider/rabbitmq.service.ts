import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { IMessageProvider } from './messageProvider.interface';
import { Message, MessageExchange, MessageRoute } from './types';



@Injectable()
export class RabbitMQService implements IMessageProvider {
  private readonly rabbitUrl = process.env.RABBITMQ_URL; 

  async sendMessage<T extends MessageRoute>(exchange: MessageExchange, routingKey: T, message: Message<T>): Promise<void> {
    try {
      const connection = await amqp.connect(this.rabbitUrl);
      const channel = await connection.createChannel();
      await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
      await channel.close();
      await connection.close();
    } catch(error) {
      console.log(error)
    }
  }
}
