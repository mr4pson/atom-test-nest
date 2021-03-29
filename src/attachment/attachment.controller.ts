import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  Scope,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AbstractAttachmentService } from './abstract-attachment.service';
import { MulterUtils } from './multer-utils.service';
import { UploadTypesEnum } from './upload-types.enum';

@ApiTags('attachments')
@Controller({ path: 'attachments', scope: Scope.REQUEST })
export class AttachmentController {
  constructor(private attachmentService: AbstractAttachmentService) {}

  @Get(':fileName')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'image/jpeg')
  seeUploadedFile(@Param('fileName') fileName, @Res() res) {
    return res.sendFile(fileName, { root: './upload' });
  }

  /**
   * Upload attachments
   * Note: The controller method
   *
   * @param {string} authUserId
   * @param {any[]} files
   * @memberof CommonController
   */
  @Post('/addAttachments')
  // @ApiOperation({ title: 'Upload attachments' })
  @ApiCreatedResponse({
    description: 'The record has been created successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiConsumes('multipart/form-data')
  // @ApiImplicitFile({
  //   name: 'files',
  //   required: true,
  //   description: 'File Attachments',
  // })
  @UseInterceptors(
    FilesInterceptor(
      'files',
      // +process.env.MAX_FILE_COUNTS,
      20,
      MulterUtils.getConfig(UploadTypesEnum.ANY),
    ),
  )
  @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  uploadAttachments(@UploadedFiles() files: any[]) {
    console.log(files);
    return this.attachmentService.addAttachments(files, 'authUserId');
  }
}
