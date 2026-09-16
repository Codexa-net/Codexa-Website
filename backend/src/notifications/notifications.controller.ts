import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendNotificationDto } from './dto/send-notification.dto';
import { SendPortalLinkDto } from './dto/send-portal-link.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications & Email')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send general email notification (Admin only)' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationsService.sendEmail(dto);
  }

  @Post('send-portal-link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send Client Portal access link via email (Admin only)' })
  @ApiResponse({ status: 200, description: 'Portal link email sent successfully' })
  sendPortalLink(@Body() dto: SendPortalLinkDto) {
    const portalUrl =
      dto.portalUrl || `https://codexa.net/portal?token=${dto.portalToken || ''}`;
    return this.notificationsService.sendPortalLink(
      dto.email,
      dto.clientName,
      portalUrl,
    );
  }
}
