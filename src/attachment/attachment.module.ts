import { AttachmentController } from './attachment.controller';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AbstractAttachmentService } from './abstract-attachment.service';
import { MulterUtils } from './multer-utils.service';

@Module({
  imports: [DatabaseModule],
  controllers: [AttachmentController],
  providers: [AbstractAttachmentService, MulterUtils],
})
export class AttachmentModule {}
