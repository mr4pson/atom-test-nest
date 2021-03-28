import { IsNotEmpty, IsBoolean, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AbstractAttachmentDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  fileName: string;

  @ApiProperty()
  @IsNotEmpty()
  originalFileName: string;

  @ApiProperty()
  @IsNotEmpty()
  mediaType: string;

  @ApiProperty()
  @IsNotEmpty()
  fileSize: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  isCommentAttachment = false;

  // Validate this field if the attachment is not for a comment
  // @ApiProperty({ required: this.isCommentAttachment ? true : false })
  @ApiProperty({ required: false })
  @ValidateIf((o) => (o.isCommentAttachment ? false : true))
  @IsNotEmpty()
  parent?: string;

  constructor(
    fileName: string,
    originalFileName: string,
    mediaType: string,
    fileSize: number,
    isCommentAttachment: boolean,
    parent?: string,
  ) {
    this.fileName = fileName;
    this.originalFileName = originalFileName;
    this.mediaType = mediaType;
    this.fileSize = fileSize;
    this.parent = parent;
    this.isCommentAttachment = isCommentAttachment;
  }
}
