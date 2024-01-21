export enum BlockSanitaryEntity {
  ROOM_A = 'room_a',
  ROOM_B = 'room_b',
  KITCHEN = 'kitchen',
  BATHROOM = 'bathroom'
}

export const allBlockSanitaryEntity = [BlockSanitaryEntity.ROOM_A, BlockSanitaryEntity.ROOM_B, BlockSanitaryEntity.KITCHEN, BlockSanitaryEntity.BATHROOM];

export const blockSanitaryEntityToNameMap: Record<BlockSanitaryEntity, string> = {
  [BlockSanitaryEntity.ROOM_A]: 'Комната А',
  [BlockSanitaryEntity.ROOM_B]: 'Комната B',
  [BlockSanitaryEntity.KITCHEN]: 'Кухня',
  [BlockSanitaryEntity.BATHROOM]: 'Сан узел',
}