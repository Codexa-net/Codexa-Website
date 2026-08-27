import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from '../uploads.constants';

/**
 * Multer's fileFilter rejects the wrong mime type before anything is written,
 * but it cannot report a useful error body on its own. This pipe runs after the
 * interceptor and turns "nothing arrived" into a 400 the frontend can show.
 */
@Injectable()
export class ImageFilePipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException(
        'No file was uploaded. Send the image as multipart/form-data under the field name "file".',
      );
    }

    if (!ALLOWED_IMAGE_MIME_TYPES[file.mimetype]) {
      throw new BadRequestException(
        `Unsupported file type "${file.mimetype}". Allowed types: ${Object.keys(
          ALLOWED_IMAGE_MIME_TYPES,
        ).join(', ')}.`,
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException('The file is larger than 5 MB.');
    }

    return file;
  }
}
