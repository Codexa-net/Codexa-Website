import { Module } from '@nestjs/common';
import { ProjectStagesService } from './project-stages.service';
import { ProjectStagesController } from './project-stages.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [ProjectStagesController],
  providers: [ProjectStagesService],
  exports: [ProjectStagesService],
})
export class ProjectStagesModule {} 