import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ProjectStagesService } from './project-stages.service';
import { CreateProjectStageDto } from './dto/create-project-stage.dto';
import { UpdateProjectStageDto } from './dto/update-project-stage.dto';

@Controller('project-stages')
export class ProjectStagesController {
  constructor(private readonly projectStagesService: ProjectStagesService) {}

  @Post()
  create(@Body() createDto: CreateProjectStageDto) {
    return this.projectStagesService.create(createDto);
  }

  @Get('my-tasks')
  getMyTasks(@Query('userId') userId: string) {
    return this.projectStagesService.findMyTasks(userId);
  }

  @Get('project/:projectId')
  getByProject(@Param('projectId') projectId: string) {
    return this.projectStagesService.findByProject(projectId);
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Body('progress') progress: number,
    @Body('isCompleted') isCompleted?: boolean,
    @Body('reply') reply?: string,
    @Body('deliverableUrl') deliverableUrl?: string,
  ) {
    return this.projectStagesService.updateProgress(
      id,
      Number(progress),
      isCompleted,
      reply,
      deliverableUrl,
    );
  }

  // اعتماد فني من الليدر
  @Post(':id/lead-approve')
  leadApprove(@Param('id') id: string, @Req() req: any) {
    return this.projectStagesService.leadApprove(id, req?.user);
  }

  // صرف مالي واعتماد نهائي من السوبر أدمن
  @Post(':id/payout')
  adminPayout(@Param('id') id: string, @Req() req: any) {
    return this.projectStagesService.adminPayout(id, req?.user);
  }

  // إلغاء إسناد المهمة
  @Post(':id/unassign')
  unassignTask(@Param('id') id: string, @Req() req: any) {
    return this.projectStagesService.unassignTask(id, req?.user);
  }

  // أمر بدء مرحلة جديدة في تسلسل تسليم المشروع
  @Patch('project/:projectId/advance-stage')
  advanceStage(
    @Param('projectId') projectId: string,
    @Body('nextStage') nextStage: string,
    @Req() req: any,
  ) {
    return this.projectStagesService.advanceProjectStage(
      projectId,
      nextStage,
      req?.user,
    );
  }

  // راوتات التوافقية السابقة
  @Post(':id/approve')
  approveStagePost(@Param('id') id: string) {
    return this.projectStagesService.approveStage(id);
  }

  @Patch(':id/approve')
  approveStagePatch(@Param('id') id: string) {
    return this.projectStagesService.approveStage(id);
  }

  // طلب تعديلات وملاحظات وإعادتها للمنفذ
  @Post(':id/request-changes')
  requestChanges(
    @Param('id') id: string,
    @Body('feedback') feedback: string,
  ) {
    return this.projectStagesService.requestChanges(id, feedback);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateProjectStageDto) {
    return this.projectStagesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectStagesService.remove(id);
  }
}