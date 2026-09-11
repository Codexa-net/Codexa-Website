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
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'List clients' })
  @ApiOkResponse({ description: 'Clients returned successfully.' })
  findAll(@Query() query: ListClientsQueryDto) {
    return this.clientsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one client with projects' })
  @ApiOkResponse({ description: 'Client returned successfully.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'SALES')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a client' })
  @ApiCreatedResponse({ description: 'Client created successfully.' })
  @ApiUnauthorizedResponse({ description: 'Authentication is required.' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'SALES')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a client' })
  @ApiOkResponse({ description: 'Client updated successfully.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  @ApiUnauthorizedResponse({ description: 'Authentication is required.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'SALES')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a client and detach its projects' })
  @ApiOkResponse({ description: 'Client deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Client not found.' })
  @ApiUnauthorizedResponse({ description: 'Authentication is required.' })
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.clientsService.remove(id);
  }
}
