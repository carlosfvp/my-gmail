import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { MailboxModule } from 'src/mailbox/mailbox.module';
import { EventsModule } from 'src/events/events.module';
import { MailboxService } from 'src/mailbox/mailbox.service';
import { MailService } from 'src/mail/mail.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/mailbox (GET) carlos1@my-gmail.com', () => {
    return request(app.getHttpServer())
      .get('/mailbox/carlos1@my-gmail.com')
      .expect(200)
      .then((res) => {
        res.body.forEach((response) => {
          expect(response).toHaveProperty('_id');
          expect(response).toHaveProperty('owner', 'carlos1@my-gmail.com');
          expect(response).toHaveProperty('folders');
        });
      });
  });

  it('/mailbox (GET) carlos2@my-gmail.com', () => {
    return request(app.getHttpServer())
      .get('/mailbox/carlos2@my-gmail.com')
      .expect(200)
      .then((res) => {
        res.body.forEach((response) => {
          expect(response).toHaveProperty('_id');
          expect(response).toHaveProperty('owner', 'carlos2@my-gmail.com');
          expect(response).toHaveProperty('folders');
        });
      });
  });

  it('/mail (POST) send mail and validate', () => {
    let testSubject: string = `Subject test ${Math.floor(Math.random() * 100)}`;

    request(app.getHttpServer())
      .post('/mail')
      .set({
        from: 'carlos1@my-gmail.com',
        to: 'carlos2@my-gmail.com',
        subject: testSubject,
        body: 'This is the body.',
      })
      .expect(201);

    request(app.getHttpServer())
      .get('/mailbox/carlos2@my-gmail.com')
      .expect(200)
      .then((res) => {
        res.body.forEach((response) => {
          const foundMail = response.folders['Inbox'].mails.find((m) => {
            return m.subject == testSubject;
          });
          expect(foundMail).not.toBeNull();
        });
      });
  });
});
