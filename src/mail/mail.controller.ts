import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { Mailbox, MailboxDocument } from 'src/mailbox/schemas/mailbox.schema';
import { CreateMailDto } from './dto/createMailDto';
import { BaseExceptionFilter } from '@nestjs/core';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post()
  async create(@Body() createMailDto: CreateMailDto) {
    await this.mailService.createMail(createMailDto);
  }

  @Delete(':mailId')
  async delete(@Param() mailId: string) {
    let deletedCount = await this.mailService.deleteMail(mailId);
    return deletedCount === 1;
  }

  @Post('move')
  async moveToFolder(@Body() createMailDto: CreateMailDto) {
    // TODO: implement method
    throw new Error('Method not implemented');
  }
}
