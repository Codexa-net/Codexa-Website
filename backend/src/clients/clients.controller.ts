import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get clients',
    description:
      'Published clients only unless published=false is sent. Ordered by displayOrder, then name.',
  })
  @ApiOkResponse({ description: 'Clients returned successfully.' })
  findAll(@Query() query: ListClientsQueryDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':idOrSlug')
  @ApiOperation({
    summary: 'Get one client',
    description:
      'Backs the client details page. Accepts the uuid or the slug, and includes the projects delivered for this client.',
  })
  @ApiParam({
    name: 'idOrSlug',
    description: 'The client uuid, or its slug such as "ta7wila".',
    example: 'ta7wila',
  })
  @ApiOkResponse({ description: 'Client returned successfully.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.clientsService.findOne(idOrSlug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a client',
    description:
      'The slug is generated from the name when omitted. Upload the logo through POST /uploads/image first, then send the url it returns.',
  })
  @ApiCreatedResponse({ description: 'Client created successfully.' })
  @ApiUnauthorizedResponse({ description: 'Authentication is required.' })
  @ApiConflictResponse({
    description: 'A client with the same slug already exists.',
  })
  create(@Body() dto: CreateClientDto) {
    return this.clientsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a client',
    description: 'Partial update. Send only the fields that changed.',
  })
  @ApiOkResponse({ description: 'Client updated successfully.' })
  @ApiUnauthorizedResponse({ description: 'Authentication is required.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  @ApiConflictResponse({
    description: 'A client with the same slug already exists.',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a client',
    description:
      'Projects linked to this client are detached rather than deleted.',
  })
  @ApiOkResponse({ description: 'Client deleted successfully.' })
  @ApiUnauthorizedResponse({ description: 'Authentication is required.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.clientsService.remove(id);
  }
}
