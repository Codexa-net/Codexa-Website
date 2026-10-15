import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TeamMembersService } from './team-members.service';
import { CreateTeamMemberDto } from './create-team-member.dto';
import { UpdateTeamMemberDto } from './update-team-member.dto';

@ApiTags('Team Members')
@Controller('team-members')
export class TeamMembersController {
  constructor(private readonly teamMembersService: TeamMembersService) {}

  @Get()
  @ApiOperation({ summary: 'List all team members' })
  @ApiOkResponse({ description: 'Team members returned successfully.' })
  findAll() {
    return this.teamMembersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single team member by ID' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teamMembersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new team member' })
  @ApiCreatedResponse({ description: 'Member created successfully.' })
  create(@Body() dto: CreateTeamMemberDto) {
    return this.teamMembersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a team member' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTeamMemberDto,
  ) {
    return this.teamMembersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a team member' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.teamMembersService.remove(id);
  }
}