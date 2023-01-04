import { Test, TestingModule } from '@nestjs/testing';
import { MailboxController } from './mailbox.controller';
import { MailboxService } from './mailbox.service';

describe('MailboxController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [MailboxController],
      providers: [MailboxService],
    }).compile();
  });

  describe('getMailbox for Carlito', () => {
    it('should not return null', async () => {
      const mailboxController = app.get(MailboxController);
      expect(
        await mailboxController.getMailbox('carlito@my-gmail.com'),
      ).not.toBeNull();
    });
  });
});
