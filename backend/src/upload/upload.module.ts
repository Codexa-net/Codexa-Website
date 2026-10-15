import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UploadController } from './upload.controller';
import { AuthModule } from '../auth/auth.module';
import { AdminUsersModule } from '../admin-users/admin-users.module';

@Module({
  imports: [JwtModule.register({}), AuthModule, AdminUsersModule],
  controllers: [UploadController],
})
export class UploadModule {}