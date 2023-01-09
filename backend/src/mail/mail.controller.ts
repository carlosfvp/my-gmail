import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/createMailDto';
import { MailboxService } from 'src/mailbox/mailbox.service';
import { EventsGateway } from '../events/events.gateway';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailboxService: MailboxService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  async create(@Body() createMailDto: CreateMailDto) {
    // TODO project only ids
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
  }

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

  @Post('move')
  async moveToFolder(@Body() createMailDto: CreateMailDto) {
    // TODO: implement method
    throw new Error('Method not implemented');
  }
}
