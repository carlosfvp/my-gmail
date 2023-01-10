import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/createMailDto';
import { MailboxService } from '../mailbox/mailbox.service';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailboxService: MailboxService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Method to create a mail, includes the same message
   * in sent of the sender and inbox folder for the receiver.
   * @param createMailDto
   */
  @Post()
  async create(@Body() createMailDto: CreateMailDto): Promise<boolean> {
    // TODO project only ids on the mongoose query
    try {
      const toMailbox = await this.mailboxService.getMailboxByOwner(
        createMailDto.to,
      );

      const fromMailbox = await this.mailboxService.getMailboxByOwner(
        createMailDto.from,
      );

      await this.mailService.createMail(
        toMailbox._id.toString(),
        fromMailbox._id.toString(),
        createMailDto,
      );
    } catch (error) {
      const e = new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error creating a mail',
        },
        HttpStatus.BAD_REQUEST,
      );
      e.cause = error;
      throw e;
    }

    return true;
  }

  /**
   * Method to delete mail using params
   * @param mailboxId
   * @param folderId
   * @param mailId
   */
  @Delete(':mailboxId/:folderId/:mailId')
  async delete(
    @Param() mailboxId: string,
    @Param() folderId: string,
    @Param() mailId: string,
  ) {
    let deletedCount = await this.mailService.deleteMail(
      mailboxId,
      folderId,
      mailId,
    );
    return deletedCount === 1;
  }

  /**
   * TODO: implement method to move mail to a folder
   * @param createMailDto
   */
  @Post('move')
  async moveToFolder(@Body() createMailDto: CreateMailDto) {
    //
    throw new Error('Method not implemented');
  }
}
