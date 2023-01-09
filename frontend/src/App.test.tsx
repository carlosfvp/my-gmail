import { render, screen } from "@testing-library/react";
import App from "./App";
import MailboxService from "./services/mailbox.service";
import { ReportHandler } from "web-vitals";
// https://github.com/prisma/prisma/issues/8558#issuecomment-1129055580
global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;

test("display mailbox", async () => {
  render(<App />);
  const mailAddress = screen.getByDisplayValue(/carlos@my-gmail.com/i);
  mailAddress.setAttribute("value", "carlos1@my-mail.com");

  const loadButton = screen.getByText(/change mailbox/i);
  loadButton.click();

  await screen.findByText("Inbox");
  await screen.findByText("Sent");
  await screen.findByText("Trash");
});

test("send mail and wait for mailbox", async () => {
  render(<App />);
  const mailAddress = screen.getByDisplayValue(/carlos@my-gmail.com/i);
  const loadButton = screen.getByText(/change mailbox/i);

  mailAddress.setAttribute("value", "carlos2@my-gmail.com");

  loadButton.click();

  await screen.findByText("Inbox");

  mailAddress.setAttribute("value", "carlos1@my-gmail.com");
  loadButton.click();

  await screen.findByText("Inbox");

  const randomId = Math.floor(Math.random() * 100000);
  const randomSubject = `Subject Test ${randomId}`;

  const notPresent = screen.queryByText(randomSubject);
  expect(notPresent).toBeNull();

  MailboxService.sendMail(
    "carlos2@my-gmail.com",
    "carlos1@my-gmail.com",
    randomSubject,
    "Body test 123"
  );

  await screen.findByText(randomSubject);
});
