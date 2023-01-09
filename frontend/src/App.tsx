import React, { useEffect, useState } from "react";
import { MailDto, MailboxDto } from "./dto/mailbox.model";
import { io } from "socket.io-client";
import Mailbox from "./mailbox/Mailbox";
import MailboxService from "./services/mailbox.service";

const socket = io("ws://localhost:81/");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [mailboxInfo, setMailboxInfo] = React.useState<MailboxDto>({
    owner: "",
    folders: [],
  });
  const [selectedMail, setSelectedMail] = React.useState<MailDto>();
  const [sessionId, setSessionId] = useState(null);
  const mailRef = React.useRef("carlos@my-gmail.com");
  const [mailAddress, setMailAddress] = React.useState(mailRef.current);

  React.useEffect(() => {
    MailboxService.getMailbox(mailAddress).then((response) => {
      setMailboxInfo(response);
      setSelectedMail(undefined);
    });
  }, [mailAddress]);

  React.useEffect(() => {
    socket.on("connect", () => {
      console.log("WS Connected");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("new_mail", (a) => {
      if (mailboxInfo) {
        let newMailboxInfo = mailboxInfo;
        newMailboxInfo.folders
          .find((f) => f.path === a.path)
          ?.mails.push(a.mail);
        setMailboxInfo({ ...mailboxInfo, ...newMailboxInfo });
      }
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new_mail");
    };
  }, [mailboxInfo]);

  useEffect(() => {
    if (isConnected === true) {
      socket.emit("subscribe", { owner: mailAddress }, (val: any) => {
        setSessionId(val);
      });
    } else {
      setSessionId(null);
    }
  }, [mailAddress, isConnected]);

  return (
    <div className="m-10">
      <div className="flex flex-col items-center gap-2 m-2">
        <p className="text-2xl">My GMail</p>
        <p>
          Type any mailbox address, if it doesn't exist it will be created on
          the database.
        </p>
        <input
          className="w-60 placeholder:text-center border"
          type="text"
          placeholder="type to change mailbox"
          defaultValue={mailAddress}
          onChange={(e) => (mailRef.current = e.target.value)}
        />
        <button
          className="bg-blue-300 px-2 rounded-md"
          type="button"
          onClick={() => setMailAddress(mailRef.current)}
        >
          Change Mailbox
        </button>
      </div>
      <div className="flex flex-row">
        <Mailbox
          owner={mailRef.current}
          mailboxInfo={mailboxInfo}
          pickMail={setSelectedMail}
        />
        <div className="border p-2 w-full">
          <div>To: {selectedMail?.to}</div>
          <div>From: {selectedMail?.from}</div>
          <div>Subject: {selectedMail?.subject}</div>
          <div className="w-full border"></div>
          {selectedMail?.body}
        </div>
      </div>
    </div>
  );
}

export default App;
