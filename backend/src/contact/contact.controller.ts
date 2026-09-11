import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
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
