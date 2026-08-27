import { BadRequestException, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { randomBytes } from 'crypto';
import { diskStorage } from 'multer';
import { resolve } from 'path';

import { AuthModule } from '../auth/auth.module';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from './uploads.constants';

@Module({
  imports: [
    AuthModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const storageDir = resolve(
          process.cwd(),
          configService.get<string>('UPLOADS_DIR', 'uploads'),
        );

        return {
          limits: {
            fileSize: MAX_IMAGE_SIZE_BYTES,
            files: 1,
          },

          // Refuse anything that is not an accepted image before a byte is
          // written, so a rejected upload never reaches the disk at all.
          fileFilter: (_request, file, callback) => {
            if (!ALLOWED_IMAGE_MIME_TYPES[file.mimetype]) {
              callback(
                new BadRequestException(
                  `Unsupported file type "${file.mimetype}". Allowed types: ${Object.keys(
                    ALLOWED_IMAGE_MIME_TYPES,
                  ).join(', ')}.`,
                ),
                false,
              );
              return;
            }

            callback(null, true);
          },

          storage: diskStorage({
            destination: storageDir,

            // The client's filename is never reused: it could collide with an
            // existing file, carry a misleading extension, or contain path
            // separators. A random name plus the extension for the detected
            // mime type avoids all three.
            filename: (_request, file, callback) => {
              const extension = ALLOWED_IMAGE_MIME_TYPES[file.mimetype];
              callback(null, `${randomBytes(16).toString('hex')}.${extension}`);
            },
          }),
        };
      },
    }),
  ],
  controllers: [UploadsController],
  providers: [UploadsService],
  exports: [UploadsService],
})
export class UploadsModule implements OnModuleInit {
  constructor(private readonly uploadsService: UploadsService) {}

  async onModuleInit(): Promise<void> {
    await this.uploadsService.ensureStorageDir();
  }
}
