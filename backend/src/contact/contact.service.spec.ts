import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { ListContactMessagesQueryDto } from './dto/list-contact-messages-query.dto';

describe('ContactService', () => {
  let service: ContactService;

  const prismaMock = {
    contactMessage: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const contactMessage = {
    id: 'a15a899f-db30-47d4-a7ab-23de4b437b88',
    name: 'Seifullah Elsayed',
    email: 'seif@example.com',
    phone: null,
    subject: 'Website project',
    message: 'I would like to build a new company website.',
    isRead: false,
    readAt: null,
    createdAt: new Date('2026-07-31T20:00:00.000Z'),
    updatedAt: new Date('2026-07-31T20:00:00.000Z'),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and normalize a contact message', async () => {
    const dto: CreateContactMessageDto = {
      name: '  Seifullah Elsayed  ',
      email: '  SEIF@EXAMPLE.COM  ',
      phone: '  +201012345678  ',
      subject: '  Website project  ',
      message: '  I would like to build a new company website.  ',
    };

    prismaMock.contactMessage.create.mockResolvedValue(contactMessage);

    await expect(service.createMessage(dto)).resolves.toEqual(contactMessage);

    expect(prismaMock.contactMessage.create).toHaveBeenCalledWith({
      data: {
        name: 'Seifullah Elsayed',
        email: 'seif@example.com',
        phone: '+201012345678',
        subject: 'Website project',
        message: 'I would like to build a new company website.',
      },
    });
  });

  it('should return filtered and paginated messages', async () => {
    const query: ListContactMessagesQueryDto = {
      page: 2,
      limit: 5,
      search: ' Seif ',
      isRead: false,
    };

    prismaMock.contactMessage.findMany.mockResolvedValue([contactMessage]);
    prismaMock.contactMessage.count.mockResolvedValue(6);
    prismaMock.$transaction.mockResolvedValue([[contactMessage], 6]);

    await expect(service.findAll(query)).resolves.toEqual({
      data: [contactMessage],
      meta: {
        page: 2,
        limit: 5,
        total: 6,
        totalPages: 2,
        hasNextPage: false,
        hasPreviousPage: true,
      },
    });

    expect(prismaMock.contactMessage.findMany).toHaveBeenCalledWith({
      where: {
        isRead: false,
        OR: [
          {
            name: {
              contains: 'Seif',
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: 'Seif',
              mode: 'insensitive',
            },
          },
          {
            subject: {
              contains: 'Seif',
              mode: 'insensitive',
            },
          },
          {
            message: {
              contains: 'Seif',
              mode: 'insensitive',
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 5,
      take: 5,
    });
  });

  it('should return one contact message', async () => {
    prismaMock.contactMessage.findUnique.mockResolvedValue(contactMessage);

    await expect(service.findOne(contactMessage.id)).resolves.toEqual(
      contactMessage,
    );

    expect(prismaMock.contactMessage.findUnique).toHaveBeenCalledWith({
      where: {
        id: contactMessage.id,
      },
    });
  });

  it('should throw NotFoundException when the message does not exist', async () => {
    prismaMock.contactMessage.findUnique.mockResolvedValue(null);

    await expect(
      service.findOne('702aec6c-f82f-4dfe-a1fb-e94f742d6844'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should mark an unread message as read', async () => {
    const readAt = new Date('2026-07-31T21:00:00.000Z');

    jest.useFakeTimers();
    jest.setSystemTime(readAt);

    const readMessage = {
      ...contactMessage,
      isRead: true,
      readAt,
    };

    prismaMock.contactMessage.findUnique.mockResolvedValue(contactMessage);
    prismaMock.contactMessage.update.mockResolvedValue(readMessage);

    await expect(service.markAsRead(contactMessage.id)).resolves.toEqual(
      readMessage,
    );

    expect(prismaMock.contactMessage.update).toHaveBeenCalledWith({
      where: {
        id: contactMessage.id,
      },
      data: {
        isRead: true,
        readAt,
      },
    });
  });

  it('should not update a message that is already read', async () => {
    const alreadyReadMessage = {
      ...contactMessage,
      isRead: true,
      readAt: new Date('2026-07-31T21:00:00.000Z'),
    };

    prismaMock.contactMessage.findUnique.mockResolvedValue(alreadyReadMessage);

    await expect(service.markAsRead(contactMessage.id)).resolves.toEqual(
      alreadyReadMessage,
    );

    expect(prismaMock.contactMessage.update).not.toHaveBeenCalled();
  });

  it('should delete a contact message', async () => {
    prismaMock.contactMessage.findUnique.mockResolvedValue(contactMessage);
    prismaMock.contactMessage.delete.mockResolvedValue(contactMessage);

    await expect(service.remove(contactMessage.id)).resolves.toEqual({
      message: 'Contact message deleted successfully.',
      data: {
        id: contactMessage.id,
      },
    });

    expect(prismaMock.contactMessage.delete).toHaveBeenCalledWith({
      where: {
        id: contactMessage.id,
      },
    });
  });
});
