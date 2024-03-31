import { Module } from '@nestjs/common';
import { MessageProviderService } from './messageProvider.service';

@Module({
  providers: [MessageProviderService],
  exports: [MessageProviderService],
})
export class MessageProviderModule {}
