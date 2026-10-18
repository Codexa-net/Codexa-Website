import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Request } from 'express';
type MulterFile = Express.Multer.File;
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const rawExt = extname(file.originalname).toLowerCase();
          const cleanExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(rawExt)
            ? rawExt
            : '.png';
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${cleanExt}`;
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (_req, file, callback) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const fileExt = extname(file.originalname).toLowerCase();

        if (!allowedMimes.includes(file.mimetype) || !allowedExts.includes(fileExt)) {
          return callback(
            new BadRequestException(
              'Only safe raster images (JPEG, PNG, WebP, GIF) are allowed.',
            ),
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
