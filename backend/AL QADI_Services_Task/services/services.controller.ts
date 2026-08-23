import { Controller, Post, Get, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ServicesService } from './services.service';
import { multerOptions } from './multer.config';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  createService(@Body() body: any, @UploadedFile() file: any) {
    return this.servicesService.createService(body, file);
  }
  @Get()
  getAllServices() {
    return this.servicesService.getAllServices();
  }

  @Delete(':id')
  deleteService(@Param('id') id: string) {
    return this.servicesService.deleteService(id);
  }
}