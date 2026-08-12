import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';

import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser {
  user: {
    sub: string;
    id?: string;
  };
}

/**
 * Controller for logged-in Admin Profile management and password updates.
 */
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  private getUserId(req: RequestWithUser): string {
    const userId = req.user?.sub || req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User identity not found in token');
    }
    return userId;
  }

  /**
   * Get logged-in admin's profile information.
   */
  @Get('me')
  getProfile(@Request() req: RequestWithUser) {
    const userId = this.getUserId(req);
    return this.profileService.getProfile(userId);
  }

  /**
   * Update logged-in admin's profile information (Name, Email, Avatar).
   */
  @Patch('me')
  updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = this.getUserId(req);
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  /**
   * Change logged-in admin's password after validating current password.
   */
  @Patch('change-password')
  changePassword(
    @Request() req: RequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = this.getUserId(req);
    return this.profileService.changePassword(userId, changePasswordDto);
  }
}
