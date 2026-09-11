import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [ClientsController],
  providers: [ClientsService, RolesGuard],
  exports: [ClientsService],
})
export class ClientsModule {}
