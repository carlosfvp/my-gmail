import axios from 'axios';
import { MailboxDto } from '../dto/mailbox.model';

export function getBaseUrl() {
  let url;

  switch (process.env.NODE_ENV) {
    case 'production':
      // TODO define production URL for prod
      url = 'http://localhost:3001/';
      break;
    case 'development':
    default:
      url = 'http://localhost:3001/';
  }

  return url;
}

export function getWSUrl() {
  let url;

  switch (process.env.NODE_ENV) {
    case 'production':
      // TODO define production URL for prod
      url = 'ws://localhost:3002/';
      break;
    case 'development':
    default:
      url = 'ws://localhost:3002/';
  }

  return url;
}

async function getMailbox(mailAddress: string): Promise<MailboxDto> {
  const response = await axios.get(getBaseUrl() + 'mailbox/' + mailAddress);
  return response.data as MailboxDto;
}

async function sendMail(
  from: string,
  to: string,
  subject: string,
  body: string,
): Promise<boolean> {
  const response = await axios.post(getBaseUrl() + 'mail/', {
    from,
    to,
    subject,
    body,
  });
  return response.status === 200;
}

export default {
  getMailbox,
  sendMail,
};
