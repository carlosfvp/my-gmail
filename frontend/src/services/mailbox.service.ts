import axios from "axios";
import { MailboxDto } from "../dto/mailbox.model";

const baseURL = "http://localhost:3001/";

export default {
  async getMailbox(mailAddress: string): Promise<MailboxDto> {
    const response = await axios.get(baseURL + "mailbox/" + mailAddress);
    return response.data as MailboxDto;
  },

  async sendMail(
    from: string,
    to: string,
    subject: string,
    body: string
  ): Promise<boolean> {
    const response = await axios.post(baseURL + "mail/", {
      from,
      to,
      subject,
      body,
    });
    return response.status === 200;
  },
};
