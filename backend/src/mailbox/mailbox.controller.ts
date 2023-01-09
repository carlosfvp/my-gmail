import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MailboxService } from './mailbox.service';
import { Mailbox, MailboxDocument } from 'src/mailbox/schemas/mailbox.schema';
import { CreateMailboxDto } from './dto/createMailboxDto';
import { Folder } from './schemas/folder.schema';
import { Mail } from '../mail/schemas/mail.schema';
import { MailService } from 'src/mail/mail.service';
import { EventsGateway } from '../events/events.gateway';

@Controller('mailbox')
export class MailboxController {
  constructor(
    private readonly mailboxService: MailboxService,
    private readonly mailService: MailService,
  ) {}

  @Post()
  async create(@Body() createMailboxDto: CreateMailboxDto) {
    await this.mailboxService.createMailbox(createMailboxDto);
  }

  @Get(':owner')
  async getMailboxId(@Param('owner') owner: string): Promise<Mailbox> {
    let mb: Mailbox = await this.mailboxService.getMailboxByOwner(owner);

    if (mb == null)
      mb = await this.mailboxService.createMailbox({ owner: owner });

    return mb;
  }
}
