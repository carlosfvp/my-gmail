import { Test, TestingModule } from '@nestjs/testing';
import { MailboxController } from './mailbox.controller';
import { MailboxService } from './mailbox.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Mailbox, MailboxSchema } from './schemas/mailbox.schema';
import { Types } from 'mongoose';

describe('MailboxController', () => {
  let app: TestingModule;
  let mailboxController: MailboxController;
  let mailboxService: MailboxService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URL),
        MongooseModule.forFeature([
          { name: Mailbox.name, schema: MailboxSchema },
        ]),
      ],
      controllers: [MailboxController],
      providers: [MailboxService],
    }).compile();

    mailboxController = app.get<MailboxController>(MailboxController);
    mailboxService = app.get<MailboxService>(MailboxService);
  });

  describe('getMailbox for carlos1@my-gmail.com', () => {
    jest.setTimeout(30000);
    it('should not return null', async () => {
      jest
        .spyOn(mailboxService, 'getMailboxByOwner')
        .mockImplementation(async () => {
          return {
            _id: new Types.ObjectId('63bd9c926a3fabe1f508b051'),
            owner: 'carlos1@my-gmail.com',
            folders: [
              {
                _id: '63bd9c926a3fabe1f508b055',
                path: 'Inbox',
                mails: [],
              },
              {
                _id: '63bd9c926a3fabe1f508b056',
                path: 'Sent',
                mails: [],
              },
              {
                _id: '63bd9c926a3fabe1f508b057',
                path: 'Trash',
                mails: [],
              },
            ],
          } as any;
        });

      expect(
        await mailboxController.getMailbox('carlos1@my-gmail.com'),
      ).not.toBeNull();
    });
  });

  describe('getMailbox for carlos2@my-gmail.com', () => {
    it('should not return null', async () => {
      jest
        .spyOn(mailboxService, 'getMailboxByOwner')
        .mockImplementation(async () => {
          return {
            _id: new Types.ObjectId('63bd9c926a3fabe1f508b052'),
            owner: 'carlos2@my-gmail.com',
            folders: [
              {
                _id: '63bd9c926a3fabe1f508b055',
                path: 'Inbox',
                mails: [],
              },
              {
                _id: '63bd9c926a3fabe1f508b056',
                path: 'Sent',
                mails: [],
              },
              {
                _id: '63bd9c926a3fabe1f508b057',
                path: 'Trash',
                mails: [],
              },
            ],
          } as any;
        });

      expect(
        await mailboxController.getMailbox('carlos2@my-gmail.com'),
      ).not.toBeNull();
    });
  });
});
