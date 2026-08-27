import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { UploadsService } from './uploads.service';

describe('UploadsService', () => {
  let service: UploadsService;

  const config = {
    get: jest.fn((key: string, fallback: string) => {
      if (key === 'UPLOADS_DIR') {
        return 'uploads';
      }

      if (key === 'UPLOADS_PUBLIC_URL') {
        return 'http://localhost:3001';
      }

      return fallback;
    }),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadsService, { provide: ConfigService, useValue: config }],
    }).compile();

    service = module.get<UploadsService>(UploadsService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildUploadResponse', () => {
    it('returns the stored name and its public url, not the client name', () => {
      const result = service.buildUploadResponse({
        filename: 'a1b2c3d4e5f60718293a4b5c6d7e8f90.png',
        originalname: 'my holiday photo.PNG',
        mimetype: 'image/png',
        size: 1234,
      } as Express.Multer.File);

      expect(result.data.filename).toBe(
        'a1b2c3d4e5f60718293a4b5c6d7e8f90.png',
      );
      expect(result.data.url).toBe(
        'http://localhost:3001/uploads/a1b2c3d4e5f60718293a4b5c6d7e8f90.png',
      );
      expect(result.data.url).not.toContain('holiday');
    });
  });

  describe('remove', () => {
    const valid = 'a1b2c3d4e5f60718293a4b5c6d7e8f90.png';

    it.each([
      ['../../.env', 'parent traversal'],
      ['..\\..\\package.json', 'windows traversal'],
      ['/etc/passwd', 'absolute path'],
      ['not-a-generated-name.png', 'name this API never issued'],
      ['a1b2c3d4e5f60718293a4b5c6d7e8f90.exe', 'disallowed extension'],
      ['a1b2c3d4e5f60718293a4b5c6d7e8f9.png', 'wrong length'],
    ])('refuses %s (%s)', async (filename) => {
      const unlink = jest.spyOn(fs, 'unlink');

      await expect(service.remove(filename)).rejects.toThrow(
        BadRequestException,
      );
      expect(unlink).not.toHaveBeenCalled();
    });

    it('deletes a file it generated', async () => {
      jest.spyOn(fs, 'unlink').mockResolvedValue(undefined);

      const result = await service.remove(valid);

      expect(result.data.filename).toBe(valid);
    });

    it('reports a missing file as not found', async () => {
      jest
        .spyOn(fs, 'unlink')
        .mockRejectedValue(Object.assign(new Error('missing'), {
          code: 'ENOENT',
        }));

      await expect(service.remove(valid)).rejects.toThrow(NotFoundException);
    });

    it('lets an unexpected filesystem error through', async () => {
      jest
        .spyOn(fs, 'unlink')
        .mockRejectedValue(Object.assign(new Error('denied'), {
          code: 'EACCES',
        }));

      await expect(service.remove(valid)).rejects.toThrow('denied');
    });
  });
});
