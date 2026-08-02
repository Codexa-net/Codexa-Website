import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { ListContactMessagesQueryDto } from './dto/list-contact-messages-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin - Contact Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/messages')
export class AdminMessagesController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contact messages' })
  @ApiOkResponse({
    description: 'Contact messages returned successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  findAll(@Query() query: ListContactMessagesQueryDto) {
    return this.contactService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one contact message' })
  @ApiOkResponse({
    description: 'Contact message returned successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Contact message not found.',
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a contact message as read' })
  @ApiOkResponse({
    description: 'Contact message marked as read successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Contact message not found.',
  })
  markAsRead(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contactService.markAsRead(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a contact message' })
  @ApiOkResponse({
    description: 'Contact message deleted successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Contact message not found.',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.contactService.remove(id);
  }
}
