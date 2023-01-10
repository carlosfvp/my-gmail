import {
  fireEvent,
  queryByText,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import App from "./App";
import MailboxService from "./services/mailbox.service";
import { act } from "react-dom/test-utils";
// https://github.com/prisma/prisma/issues/8558#issuecomment-1129055580
global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;

describe("App test", () => {
  test("display mailbox and folders", async () => {
    act(() => {
      render(<App />);
    });
    const mailAddress = screen.getByDisplayValue("carlos@my-gmail.com");
    mailAddress.setAttribute("value", "carlos1@my-mail.com");

    const loadButton = screen.getByText("Change Mailbox");
    act(() => {
      loadButton.click();
    });

    await screen.findByText("Inbox");
    await screen.findByText("Sent");
    await screen.findByText("Trash");
  });

  test("send mail and wait for mailbox", async () => {
    act(() => {
      render(<App />);
    });

    const mailAddress = screen.getByDisplayValue("carlos@my-gmail.com");
    const loadButton = screen.getByText("Change Mailbox");

    act(() => {
      fireEvent.change(mailAddress, {
        target: { value: "carlos2@my-gmail.com" },
      });

      loadButton.click();
    });

    await screen.findByText("Inbox");

    act(() => {
      fireEvent.change(mailAddress, {
        target: { value: "carlos1@my-gmail.com" },
      });

      loadButton.click();
    });

    await waitFor(() => {
      expect(() => screen.getByText("Not mails in this folder")).toThrow();
    });

    await screen.findByText("Inbox");

    const randomId = Math.floor(Math.random() * 100000);
    const randomSubject = `Subject Test ${randomId}`;

    const notPresent = screen.queryByText(randomSubject);
    expect(notPresent).toBeNull();

    await act(async () => {
      await MailboxService.sendMail(
        "carlos2@my-gmail.com",
        "carlos1@my-gmail.com",
        randomSubject,
        "Body test 123"
      );

      fireEvent.change(mailAddress, {
        target: { value: "carlos2@my-gmail.com" },
      });

      loadButton.click();
    });

    await screen.findByText("Inbox");

    act(() => {
      fireEvent.change(mailAddress, {
        target: { value: "carlos1@my-gmail.com" },
      });

      loadButton.click();
    });

    await waitFor(() => {
      expect(() => screen.getByText(randomSubject)).not.toThrow();
    });
  });
});
