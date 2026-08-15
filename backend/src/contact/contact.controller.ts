import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit a contact message',
  })
  @ApiCreatedResponse({
    description: 'The contact message was submitted successfully.',
  })
  @ApiBadRequestResponse({
    description: 'The submitted contact data is invalid.',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Too many contact messages were submitted. Please try again later.',
  })
  async createMessage(
    @Body() createContactMessageDto: CreateContactMessageDto,
  ) {
    const contactMessage = await this.contactService.createMessage(
      createContactMessageDto,
    );

    return {
      message: 'Contact message submitted successfully.',
      data: contactMessage,
    };
  }
}
