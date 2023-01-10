import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { MailboxService } from './mailbox.service';
import { CreateMailboxDto } from './dto/createMailboxDto';
import { MailboxDocument } from './schemas/mailbox.schema';

@Controller('mailbox')
export class MailboxController {
  constructor(private readonly mailboxService: MailboxService) {}

  /**
   * Method to create mailbox for new user
   * @param createMailboxDto
   */
  @Post()
  async create(@Body() createMailboxDto: CreateMailboxDto) {
    await this.mailboxService.createMailbox(createMailboxDto);
  }

  /**
   * Method to get mailbox DTO, creates mailbox if it doesn't exist
   * @param owner
   * @returns
   */
  @Get(':owner')
  async getMailbox(@Param('owner') owner: string): Promise<MailboxDocument> {
    let returnMb: MailboxDocument = null;
    try {
      let mb: MailboxDocument = await this.mailboxService.getMailboxByOwner(
        owner,
      );

      if (mb == null)
        mb = await this.mailboxService.createMailbox({ owner: owner });

      return mb;
    } catch (error) {
      const e = new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error getting mailbox info',
        },
        HttpStatus.BAD_REQUEST,
      );
      e.cause = error;
      throw e;
    }

    return returnMb;
  }
}
