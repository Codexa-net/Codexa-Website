import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}
  
  async createService(data: any, file?: any) {
    const imageUrl = file ? `/uploads/services/${file.filename}` : null;
    
    return this.prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        imageUrl: imageUrl,
        isActive: data.isActive === 'true' || data.isActive === true,
      },
    });
  }

  async getAllServices() {
    return this.prisma.service.findMany({
      include: { category: true }
    });
  }

  async deleteService(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) throw new NotFoundException('Service not found');

    if (service.imageUrl) {
      const filePath = path.join(process.cwd(), service.imageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return this.prisma.service.delete({ where: { id } });
  }
}