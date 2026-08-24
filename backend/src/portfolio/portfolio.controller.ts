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
import { PortfolioService } from './portfolio.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { ListProjectsQueryDto } from './dto/list-projects-query.dto';

@ApiTags('Portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // ============================================================
  // Projects
  // ============================================================

  @Get('projects')
  @ApiOperation({
    summary: 'Get portfolio projects',
    description:
      'Get projects with search, category filter, technology filter, featured filter, and pagination.',
  })
  @ApiOkResponse({
    description: 'Projects returned successfully.',
  })
  findAllProjects(@Query() query: ListProjectsQueryDto) {
    return this.portfolioService.findAllProjects(query);
  }

  @Get('projects/:id')
  @ApiOperation({
    summary: 'Get one portfolio project',
  })
  @ApiOkResponse({
    description: 'Project returned successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  findProjectById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.portfolioService.findProjectById(id);
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a portfolio project',
  })
  @ApiCreatedResponse({
    description: 'Project created successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Category or technology not found.',
  })
  @ApiConflictResponse({
    description: 'A project with the same slug already exists.',
  })
  createProject(@Body() dto: CreateProjectDto) {
    return this.portfolioService.createProject(dto);
  }

  @Patch('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a portfolio project',
  })
  @ApiOkResponse({
    description: 'Project updated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Project, category, or technology not found.',
  })
  @ApiConflictResponse({
    description: 'A project with the same slug already exists.',
  })
  updateProject(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.portfolioService.updateProject(id, dto);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a portfolio project',
  })
  @ApiOkResponse({
    description: 'Project deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Project not found.',
  })
  removeProject(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.portfolioService.removeProject(id);
  }

  // ============================================================
  // Categories
  // ============================================================

  @Get('categories')
  @ApiOperation({
    summary: 'Get portfolio categories',
  })
  @ApiOkResponse({
    description: 'Categories returned successfully.',
  })
  findAllCategories() {
    return this.portfolioService.findAllCategories();
  }

  @Get('categories/:id')
  @ApiOperation({
    summary: 'Get one portfolio category',
  })
  @ApiOkResponse({
    description: 'Category returned successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  findCategoryById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.portfolioService.findCategoryById(id);
  }

  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a portfolio category',
  })
  @ApiCreatedResponse({
    description: 'Category created successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiConflictResponse({
    description: 'A category with the same name or slug already exists.',
  })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.portfolioService.createCategory(dto);
  }

  @Patch('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a portfolio category',
  })
  @ApiOkResponse({
    description: 'Category updated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  @ApiConflictResponse({
    description: 'A category with the same name or slug already exists.',
  })
  updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.portfolioService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a portfolio category',
  })
  @ApiOkResponse({
    description: 'Category deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found.',
  })
  removeCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.portfolioService.removeCategory(id);
  }

  // ============================================================
  // Technologies
  // ============================================================

  @Get('technologies')
  @ApiOperation({
    summary: 'Get portfolio technologies',
  })
  @ApiOkResponse({
    description: 'Technologies returned successfully.',
  })
  findAllTechnologies() {
    return this.portfolioService.findAllTechnologies();
  }

  @Get('technologies/:id')
  @ApiOperation({
    summary: 'Get one portfolio technology',
  })
  @ApiOkResponse({
    description: 'Technology returned successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Technology not found.',
  })
  findTechnologyById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.portfolioService.findTechnologyById(id);
  }

  @Post('technologies')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a portfolio technology',
  })
  @ApiCreatedResponse({
    description: 'Technology created successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiConflictResponse({
    description: 'A technology with the same name or slug already exists.',
  })
  createTechnology(@Body() dto: CreateTechnologyDto) {
    return this.portfolioService.createTechnology(dto);
  }

  @Patch('technologies/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a portfolio technology',
  })
  @ApiOkResponse({
    description: 'Technology updated successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Technology not found.',
  })
  @ApiConflictResponse({
    description: 'A technology with the same name or slug already exists.',
  })
  updateTechnology(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTechnologyDto,
  ) {
    return this.portfolioService.updateTechnology(id, dto);
  }

  @Delete('technologies/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a portfolio technology',
  })
  @ApiOkResponse({
    description: 'Technology deleted successfully.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  @ApiNotFoundResponse({
    description: 'Technology not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  removeTechnology(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.portfolioService.removeTechnology(id);
  }
}