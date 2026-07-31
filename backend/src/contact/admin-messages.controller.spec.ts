import { Test, TestingModule } from '@nestjs/testing';
import { AdminMessagesController } from './admin-messages.controller';
import { ContactService } from './contact.service';
import { ListContactMessagesQueryDto } from './dto/list-contact-messages-query.dto';

describe('AdminMessagesController', () => {
  let controller: AdminMessagesController;

  const contactServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    markAsRead: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminMessagesController],
      providers: [
        {
          provide: ContactService,
          useValue: contactServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AdminMessagesController>(AdminMessagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return paginated contact messages', async () => {
    const query: ListContactMessagesQueryDto = {
      page: 1,
      limit: 10,
    };

    const result = {
      data: [
        {
          id: 'a15a899f-db30-47d4-a7ab-23de4b437b88',
          name: 'Seifullah Elsayed',
          email: 'seif@example.com',
          message: 'Test contact message.',
          isRead: false,
        },
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

    contactServiceMock.findAll.mockResolvedValue(result);

    await expect(controller.findAll(query)).resolves.toEqual(result);
    expect(contactServiceMock.findAll).toHaveBeenCalledWith(query);
  });

  it('should return one contact message', async () => {
    const id = 'a15a899f-db30-47d4-a7ab-23de4b437b88';
    const result = {
      id,
      name: 'Seifullah Elsayed',
      isRead: false,
    };

    contactServiceMock.findOne.mockResolvedValue(result);

    await expect(controller.findOne(id)).resolves.toEqual(result);
    expect(contactServiceMock.findOne).toHaveBeenCalledWith(id);
  });

  it('should mark a contact message as read', async () => {
    const id = 'a15a899f-db30-47d4-a7ab-23de4b437b88';
    const result = {
      id,
      isRead: true,
      readAt: new Date(),
    };

    contactServiceMock.markAsRead.mockResolvedValue(result);

    await expect(controller.markAsRead(id)).resolves.toEqual(result);
    expect(contactServiceMock.markAsRead).toHaveBeenCalledWith(id);
  });

  it('should delete a contact message', async () => {
    const id = 'a15a899f-db30-47d4-a7ab-23de4b437b88';
    const result = {
      message: 'Contact message deleted successfully.',
      data: {
        id,
      },
    };

    contactServiceMock.remove.mockResolvedValue(result);

    await expect(controller.remove(id)).resolves.toEqual(result);
    expect(contactServiceMock.remove).toHaveBeenCalledWith(id);
  });
});
