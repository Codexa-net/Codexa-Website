import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminMessagesController } from './admin-messages.controller';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';

@Module({
  imports: [AuthModule],
  controllers: [ContactController, AdminMessagesController],
  providers: [ContactService],
})
export class ContactModule {}
