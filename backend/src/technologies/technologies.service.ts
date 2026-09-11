import { Injectable } from '@nestjs/common';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class TechnologiesService {
  constructor(private prisma: PrismaService) {}

  create(createTechnologyDto: CreateTechnologyDto) {
    return this.prisma.technology.create({
      data: {
        name: createTechnologyDto.name,
        category: createTechnologyDto.category,
      },
    });
  }

  findAll() {
    return this.prisma.technology.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: string) {
    return this.prisma.technology.findUnique({
      where: { id },
    });
  }

  update(id: string, updateTechnologyDto: UpdateTechnologyDto) {
    return this.prisma.technology.update({
      where: { id },
      data: updateTechnologyDto,
    });
  }

  remove(id: string) {
    return this.prisma.technology.delete({
      where: { id },
    });
  }
}