import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MailboxService } from './mailbox.service';
import { Mailbox, MailboxDocument } from 'src/mailbox/schemas/mailbox.schema';
import { CreateMailboxDto } from './dto/createMailboxDto';
import { Folder } from './schemas/folder.schema';

@Controller('mailbox')
export class MailboxController {
  constructor(private readonly mailboxService: MailboxService) {}

  @Post()
  async create(@Body() createMailboxDto: CreateMailboxDto) {
    await this.mailboxService.createMailbox(createMailboxDto);
  }

  @Get(':owner')
  async getMailboxId(@Param('owner') owner: string): Promise<String> {
    const mb: MailboxDocument = await this.mailboxService.getMailboxByOwner(
      owner,
    );
    return mb._id.toString();
  }

  @Get(':mailboxId/:folderPath')
  async getFolderFromMailbox(
    @Param('mailboxId') mailboxId: string,
    @Param('folderPath') folderPath: string,
  ): Promise<Folder> {
    const mb: Mailbox = await this.mailboxService.getMailboxByMailboxId(
      mailboxId,
    );
    return mb.folders.find((f) => f.path === folderPath);
  }
}
