import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { TechnologiesService } from './technologies.service';

@Controller('technologies')
export class TechnologiesController {
  constructor(
    private readonly technologiesService: TechnologiesService,
  ) {}

  @Post()
  create(@Body() createTechnologyDto: CreateTechnologyDto) {
    return this.technologiesService.create(createTechnologyDto);
  }

  @Get()
  findAll() {
    return this.technologiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.technologiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTechnologyDto: UpdateTechnologyDto,
  ) {
    return this.technologiesService.update(
      id,
      updateTechnologyDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.technologiesService.remove(id);
  }
}