import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { ClientsModule } from './clients/clients.module';
import { ProjectsModule } from './projects/projects.module';
import { SettingsModule } from './settings/settings.module';
import { TechnologiesModule } from './technologies/technologies.module';
import { UploadModule } from './upload/upload.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ClientPortalModule } from './client-portal/client-portal.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { ProjectStagesModule } from './project-stages/project-stages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule,
    ContactModule,
    AdminUsersModule,
    AuthModule,
    ServicesModule,
    ClientsModule,
    ProjectsModule,
    SettingsModule,
    TechnologiesModule,
    UploadModule,
    NotificationsModule,
    ClientPortalModule,
    TeamMembersModule,
    ProjectStagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}