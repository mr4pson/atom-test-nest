import { Inject, Injectable, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { IAttachment } from '../database/attachment.model';
import { ATTACHMENT_MODEL } from '../database/database.constants';
import { AbstractAttachmentDto } from './abstract-attachment.dto';

@Injectable({ scope: Scope.REQUEST })
export class AbstractAttachmentService {
  constructor(
    @Inject(ATTACHMENT_MODEL)
    private readonly attachmentModel: Model<IAttachment>,
  ) {}

  /**
   * Add attachment
   *
   * @param {any[]} files
   * @param {string} userId
   * @returns {Promise<IAttachment[]>}
   * @memberof AbstractAttachmentService
   */
  async addAttachments(files: any[], userId: string): Promise<IAttachment[]> {
    const attachments: IAttachment[] = [];

    for (const file of files) {
      // Get the file properties
      const { filename, originalname, mimetype, size } = file;

      // Form the attachment object
      const attachment = new AbstractAttachmentDto(
        filename,
        originalname,
        mimetype,
        size,
        true,
      );

      // Collect all attachments
      attachments.push(new this.attachmentModel(attachment));
    }

    // Persist the data
    return await this.attachmentModel.insertMany(attachments);
  }
}
