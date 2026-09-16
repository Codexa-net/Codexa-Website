import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ClientPortalController } from './client-portal.controller';
import { ClientPortalService } from './client-portal.service';
import { ClientJwtAuthGuard } from './guards/client-jwt-auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [ClientPortalController],
  providers: [ClientPortalService, ClientJwtAuthGuard],
  exports: [ClientPortalService, ClientJwtAuthGuard],
})
export class ClientPortalModule {}
