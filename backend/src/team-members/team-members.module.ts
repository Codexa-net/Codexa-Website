import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TeamMembersService } from './team-members.service';
import { TeamMembersController } from './team-members.controller';
import { AuthModule } from '../auth/auth.module';
import { AdminUsersModule } from '../admin-users/admin-users.module';

@Module({
  imports: [
    JwtModule.register({}),
    AuthModule,
    AdminUsersModule,
  ],
  controllers: [TeamMembersController],
  providers: [TeamMembersService],
  exports: [TeamMembersService],
})
export class TeamMembersModule {}