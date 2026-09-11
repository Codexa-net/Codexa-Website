import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { RolesGuard } from '../auth/guards/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [ServicesController],
  providers: [ServicesService, RolesGuard],
  exports: [ServicesService],
})
export class ServicesModule {}
