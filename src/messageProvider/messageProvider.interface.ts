import { Message, MessageExchange, MessageRoute } from "./types";

export interface IMessageProvider {
  sendMessage: <T extends MessageRoute>  (exchange: MessageExchange, routingKey: T, message: Message<T>) => Promise<void>
}