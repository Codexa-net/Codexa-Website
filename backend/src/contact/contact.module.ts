import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { AdminMessagesController } from './admin-messages.controller';

@Module({
  controllers: [ContactController, AdminMessagesController],
  providers: [ContactService],
})
export class ContactModule {}
