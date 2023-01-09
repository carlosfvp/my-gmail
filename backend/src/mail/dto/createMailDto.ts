export class CreateMailDto {
  readonly to: string;
  readonly from: string;
  readonly subject: string;
  readonly body: string;
}
