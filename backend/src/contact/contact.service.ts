import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { ListContactMessagesQueryDto } from './dto/list-contact-messages-query.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(createContactMessageDto: CreateContactMessageDto) {
    return this.prisma.contactMessage.create({
      data: {
        name: createContactMessageDto.name.trim(),
        email: createContactMessageDto.email.trim().toLowerCase(),
        phone: createContactMessageDto.phone?.trim() || null,
        subject: createContactMessageDto.subject?.trim() || null,
        message: createContactMessageDto.message.trim(),
      },
    });
  }

  async findAll(query: ListContactMessagesQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const search = query.search?.trim();

    const where: Prisma.ContactMessageWhereInput = {};

    if (typeof query.isRead === 'boolean') {
      where.isRead = query.isRead;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          subject: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          message: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [messages, total] = await this.prisma.$transaction([
      this.prisma.contactMessage.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contactMessage.count({
        where,
      }),
    ]);

    return {
      data: messages,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const contactMessage = await this.prisma.contactMessage.findUnique({
      where: {
        id,
      },
    });

    if (!contactMessage) {
      throw new NotFoundException('Contact message not found.');
    }

    return contactMessage;
  }

  async markAsRead(id: string) {
    const contactMessage = await this.findOne(id);

    if (contactMessage.isRead) {
      return contactMessage;
    }

    return this.prisma.contactMessage.update({
      where: {
        id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const deletedContactMessage = await this.prisma.contactMessage.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Contact message deleted successfully.',
      data: {
        id: deletedContactMessage.id,
      },
    };
  }
}
