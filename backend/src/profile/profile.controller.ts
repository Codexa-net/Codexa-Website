import { Controller, Get, Patch, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

/**
 * Controller for logged-in Admin Profile management and password updates.
 */
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  private extractUserId(headers: Record<string, string | string[] | undefined>): string {
    const userId = headers['x-user-id'] as string;
    if (!userId) {
      throw new UnauthorizedException('User ID required in headers (x-user-id)');
    }
    return userId;
  }

  /**
   * Get logged-in admin's profile information.
   */
  @Get('me')
  getProfile(@Headers() headers: Record<string, string | string[] | undefined>) {
    const userId = this.extractUserId(headers);
    return this.profileService.getProfile(userId);
  }

  /**
   * Update logged-in admin's profile information (Name, Email, Avatar).
   */
  @Patch('me')
  updateProfile(
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = this.extractUserId(headers);
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  /**
   * Change logged-in admin's password after validating current password.
   */
  @Patch('change-password')
  changePassword(
    @Headers() headers: Record<string, string | string[] | undefined>,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = this.extractUserId(headers);
    return this.profileService.changePassword(userId, changePasswordDto);
  }
}
