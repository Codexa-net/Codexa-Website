import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join, normalize, resolve, sep } from 'path';
import {
  STORED_FILENAME_PATTERN,
  UPLOADS_ROUTE_PREFIX,
} from './uploads.constants';

@Injectable()
export class UploadsService {
  private readonly storageDir: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.storageDir = resolve(
      process.cwd(),
      this.configService.get<string>('UPLOADS_DIR', 'uploads'),
    );

    this.publicBaseUrl = this.configService
      .get<string>('UPLOADS_PUBLIC_URL', '')
      .replace(/\/+$/, '');
  }

  /**
   * Multer has already written the file to disk by the time this runs, so the
   * only work left is turning the stored name into the URL clients should keep.
   */
  buildUploadResponse(file: Express.Multer.File) {
    return {
      message: 'Image uploaded successfully.',
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: this.buildPublicUrl(file.filename),
      },
    };
  }

  async remove(filename: string) {
    const path = this.resolveStoredPath(filename);

    try {
      await fs.unlink(path);
    } catch (error) {
      if (this.isMissingFileError(error)) {
        throw new NotFoundException('File not found.');
      }

      throw error;
    }

    return {
      message: 'Image deleted successfully.',
      data: {
        filename,
      },
    };
  }

  async ensureStorageDir(): Promise<void> {
    await fs.mkdir(this.storageDir, { recursive: true });
  }

  getStorageDir(): string {
    return this.storageDir;
  }

  buildPublicUrl(filename: string): string {
    return `${this.publicBaseUrl}${UPLOADS_ROUTE_PREFIX}/${filename}`;
  }

  /**
   * Only filenames this API generated are accepted, which rules out traversal
   * ("../../.env") and any attempt to reach a file outside the uploads folder.
   * The resolved path is checked as well, so a pattern change cannot silently
   * reopen the hole.
   */
  private resolveStoredPath(filename: string): string {
    if (!STORED_FILENAME_PATTERN.test(filename)) {
      throw new BadRequestException('Invalid filename.');
    }

    const path = resolve(join(this.storageDir, normalize(filename)));

    if (path !== join(this.storageDir, filename)) {
      throw new BadRequestException('Invalid filename.');
    }

    if (!path.startsWith(this.storageDir + sep)) {
      throw new BadRequestException('Invalid filename.');
    }

    return path;
  }

  private isMissingFileError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'ENOENT'
    );
  }
}
