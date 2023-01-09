export type MailDto = {
  to: string;
  from: string;
  subject: string;
  body: string;
};

export type FolderDto = {
  path: string;
  mails: MailDto[];
};

export type MailboxDto = {
  owner: string;
  folders: FolderDto[];
};
