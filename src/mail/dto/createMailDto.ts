export class CreateMailDto {
  readonly fromMailboxId: string;
  readonly to: string;
  readonly subject: string;
  readonly body: string;
}
