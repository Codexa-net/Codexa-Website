import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UploadsService } from './uploads.service';
import { ImageFilePipe } from './pipes/image-file.pipe';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'jpg, png, webp, gif or svg. 5 MB maximum.',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload an image',
    description:
      'Returns the public url to store on a project or service. The file is renamed on the way in, so the name the client sends is never used on disk.',
  })
  @ApiCreatedResponse({
    description: 'Image uploaded successfully.',
  })
  @ApiBadRequestResponse({
    description: 'No file was sent, or the file is not an accepted image type.',
  })
  @ApiPayloadTooLargeResponse({
    description: 'The file is larger than 5 MB.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  uploadImage(@UploadedFile(new ImageFilePipe()) file: Express.Multer.File) {
    return this.uploadsService.buildUploadResponse(file);
  }

  @Delete(':filename')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an uploaded image',
    description:
      'Takes the filename from the upload response, not the full url. Nothing checks whether a project or service still references it.',
  })
  @ApiOkResponse({
    description: 'Image deleted successfully.',
  })
  @ApiBadRequestResponse({
    description: 'The filename is not one this API generated.',
  })
  @ApiNotFoundResponse({
    description: 'File not found.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication is required.',
  })
  remove(@Param('filename') filename: string) {
    return this.uploadsService.remove(filename);
  }
}
