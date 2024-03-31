import { Roles } from "src/roles/types";

export enum MessageExchange {
  DEFAULT = 'bds_exchange'
}

export enum MessageRoute {
  DORM_CREATE = 'dorm.created',
  DORM_UPDATE = 'dorm.updated',
  USER_CREATE = 'user.created',
  USER_UPDATE = 'user.updated',
  ROOM_CREATE = 'room.created',
  ROOM_UPDATE = 'room.updated',
}

type MessageBase <T extends MessageRoute> = {route: T}

export type MessageDormCreate = MessageBase<MessageRoute.DORM_CREATE> & {
  id: string,
  name: string,
  reputationBound: number,
}

export type MessageDormUpdate =  MessageBase<MessageRoute.DORM_UPDATE> & {
  id: string,
  name?: string,
  reputationBound?: number,
}

export type MessageUserUpdate =  MessageBase<MessageRoute.USER_UPDATE> & {
  id: string;
  role?: Roles;
}

export type MessageUserCreate =  MessageBase<MessageRoute.USER_CREATE> & {
  id: string;
  role: Roles;
}

export type MessageRoomUpdate =  MessageBase<MessageRoute.ROOM_UPDATE> & {
  id: string;
  blockId: string;
  dormId: string;
  number?: number;
  subNumber?: number;
  capacity?: number;
}

export type MessageRoomCreate =  MessageBase<MessageRoute.ROOM_CREATE> & {
  id: string;
  blockId: string;
  dormId: string;
  number: string;
  subNumber: string;
  capacity: number;
}

export type MessageWithRoute<T extends MessageRoute> =  MessageBase<T> & (MessageDormCreate | MessageDormUpdate | MessageUserUpdate | MessageUserCreate | MessageRoomUpdate | MessageRoomCreate)

export type Message<T extends MessageRoute> = Omit<MessageWithRoute<T>, 'route'>