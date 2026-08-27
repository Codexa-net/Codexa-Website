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
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ServicesService } from './services.service';

import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ListServicesQueryDto } from './dto/list-services-query.dto';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // ============================================================
  // Categories
  //
  // Declared before the ':id' routes so that '/services/categories'
  // is not captured as a service id.
  // ============================================================

  @Get('categories')
  @ApiOperation({
    summary: 'Get service categories',
    description: 'Each category includes a count of the services inside it.',
  })
  @ApiOkResponse({
    description: 'Service categories returned successfully.',
  })
  findAllCategories() {
    return this.servicesService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({
    summary: 'Get one service category',
    description: 'Includes the services that belong to the category.',
  })
  @ApiOkResponse({
    description: 'Service category returned successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Service category not found.',
  })
  findCategoryById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.findCategoryById(id);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a service category',
    description: 'The slug is generated from the name.',
  })
  @ApiCreatedResponse({
    description: 'Service category created successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiConflictResponse({
    description: 'A service category with the same name or slug already exists.',
  })
  createCategory(@Body() dto: CreateServiceCategoryDto) {
    return this.servicesService.createCategory(dto);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a service category',
  })
  @ApiOkResponse({
    description: 'Service category updated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Service category not found.',
  })
  @ApiConflictResponse({
    description: 'A service category with the same name or slug already exists.',
  })
  updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateServiceCategoryDto,
  ) {
    return this.servicesService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a service category',
    description: 'A category that still contains services cannot be deleted.',
  })
  @ApiOkResponse({
    description: 'Service category deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Service category not found.',
  })
  @ApiConflictResponse({
    description: 'Cannot delete a category that contains services.',
  })
  removeCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.removeCategory(id);
  }

  // ============================================================
  // Services
  // ============================================================

  @Get()
  @ApiOperation({
    summary: 'Get services',
    description:
      'Get services with search, category filter, featured filter, active filter, and pagination. Featured services come first, then displayOrder.',
  })
  @ApiOkResponse({
    description: 'Services returned successfully.',
  })
  findAllServices(@Query() query: ListServicesQueryDto) {
    return this.servicesService.findAllServices(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get one service',
  })
  @ApiOkResponse({
    description: 'Service returned successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Service not found.',
  })
  findServiceById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.findServiceById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a service',
    description:
      'Upload the image through POST /uploads/image first, then send the url it returns as imageUrl.',
  })
  @ApiCreatedResponse({
    description: 'Service created successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Service category not found.',
  })
  @ApiConflictResponse({
    description: 'A service with the same slug already exists.',
  })
  createService(@Body() dto: CreateServiceDto) {
    return this.servicesService.createService(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a service',
    description: 'Partial update. Send only the fields that changed.',
  })
  @ApiOkResponse({
    description: 'Service updated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Service or service category not found.',
  })
  @ApiConflictResponse({
    description: 'A service with the same slug already exists.',
  })
  updateService(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.updateService(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a service',
  })
  @ApiOkResponse({
    description: 'Service deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Service not found.',
  })
  removeService(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.servicesService.removeService(id);
  }
}
