import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter';
import { fileNamer } from './helpers/fileNamer';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    ) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1024 }, //en bytes
      storage: diskStorage({
        destination: './static/products', // ./ desde la raiz del project
        filename: fileNamer,
      }),
    }),
  )
  uploadProductFile(@UploadedFile() file: Express.Multer.File) {
    if (!file)
      throw new BadRequestException(
        `Make sure there is a file and it is an image`,
      );
    const secureUrl = `${this.configService.get('HOST_API')}/v1/files/product/${file.filename}}`;
    return { secureUrl };
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticProductImage(imageName);
    
    res.sendFile(path);
  }
}
