import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminMessagesController } from './admin-messages.controller';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [ContactController, AdminMessagesController],
  providers: [ContactService, RolesGuard],
})
export class ContactModule {}
