import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Request } from 'express';
import type { File as MulterFile } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Only image files are allowed.'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  upload(
    @UploadedFile() file: MulterFile,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    return {
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      filename: file.filename,
    };
  }
}