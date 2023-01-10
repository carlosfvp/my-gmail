/**
 * DTO types used in the mailbox services
 */
export type MailDto = {
  _id: string;
  to: string;
  from: string;
  subject: string;
  body: string;
};

export type FolderDto = {
  _id: string;
  path: string;
  mails: MailDto[];
};

export type MailboxDto = {
  _id: string;
  owner: string;
  folders: FolderDto[];
};
