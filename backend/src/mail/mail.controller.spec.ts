import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from '../mail/mail.service';
import { Types } from 'mongoose';
import { MailController } from './mail.controller';
import { MailboxController } from '../mailbox/mailbox.controller';
import { MailboxService } from '../mailbox/mailbox.service';
import { Mail, MailSchema } from './schemas/mail.schema';
import { Mailbox, MailboxSchema } from '../mailbox/schemas/mailbox.schema';
import { Folder, FolderSchema } from '../mailbox/schemas/folder.schema';
import { EventsGateway } from '../events/events.gateway';

describe('MailboxController', () => {
  let app: TestingModule;

  let mailboxService: MailboxService;

  let mailController: MailController;
  let mailService: MailService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGO_URL),
        MongooseModule.forFeature([
          { name: Mail.name, schema: MailSchema },
          { name: Mailbox.name, schema: MailboxSchema },
          { name: Folder.name, schema: FolderSchema },
        ]),
      ],
      controllers: [MailController],
      providers: [MailService, MailboxService, EventsGateway],
    }).compile();

    mailboxService = app.get<MailboxService>(MailboxService);

    mailController = app.get<MailController>(MailController);
    mailService = app.get<MailService>(MailService);
  });

  describe('createMail from carlos2@my-gmail.com to carlos1@my-gmail.com', () => {
    jest.setTimeout(30000);
    it('should not throw', async () => {
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

      jest.spyOn(mailService, 'createMail').mockImplementation(async () => {});

      expect(
        await mailController.create({
          from: 'carlito2@my-gmail.com',
          to: 'carlito1@my-gmail.com',
          subject: 'Not',
          body: 'a drill.',
        }),
      ).toBeTruthy();
    });
  });

  describe('delete mail tests', () => {
    it('should return true if email deleted', async () => {
      jest.spyOn(mailService, 'deleteMail').mockImplementation(async () => {
        return 1 as any;
      });

      expect(await mailController.delete('id1', 'id2', 'mailId')).toBeTruthy();
    });

    it('should return false if deleted more than one element', async () => {
      jest.spyOn(mailService, 'deleteMail').mockImplementation(async () => {
        return 2 as any;
      });

      expect(
        await mailController.delete('id1', 'id2', 'mailId'),
      ).not.toBeTruthy();
    });
  });
});
