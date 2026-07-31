import { Test, TestingModule } from '@nestjs/testing';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

describe('ContactController', () => {
  let controller: ContactController;

  const contactServiceMock = {
    createMessage: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactController],
      providers: [
        {
          provide: ContactService,
          useValue: contactServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ContactController>(ContactController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a contact message', async () => {
    const dto: CreateContactMessageDto = {
      name: 'Seifullah Elsayed',
      email: 'seif@example.com',
      subject: 'Website project',
      message: 'I would like to build a new company website.',
    };

    const createdMessage = {
      id: 'a15a899f-db30-47d4-a7ab-23de4b437b88',
      ...dto,
      phone: null,
      isRead: false,
      readAt: null,
    };

    contactServiceMock.createMessage.mockResolvedValue(createdMessage);

    await expect(controller.createMessage(dto)).resolves.toEqual({
      message: 'Contact message submitted successfully.',
      data: createdMessage,
    });

    expect(contactServiceMock.createMessage).toHaveBeenCalledWith(dto);
    expect(contactServiceMock.createMessage).toHaveBeenCalledTimes(1);
  });
});
