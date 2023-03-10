import React from 'react';
import { MailDto, MailboxDto } from '../../dto/mailbox.model';

interface MailLineProps {
  info: MailDto;
  pickMail: React.Dispatch<React.SetStateAction<MailDto | undefined>>;
}

function MailLine(props: MailLineProps) {
  return (
    <tr className="border" onClick={() => props.pickMail(props.info)}>
      <td className="flex flex-row items-start pl-4">{props.info.subject}</td>
      <td>{props.info.from}</td>
      <td>{props.info.to}</td>
    </tr>
  );
}

function EmptyLine() {
  return (
    <tr className="border">
      <td colSpan={3} className="flex flex-row items-start pl-4">
        No mails in this folder
      </td>
    </tr>
  );
}

/**
 * @param owner current address of the mailbox
 * @param mailboxInfo DTO result from API request
 * @param pickMail dispatch to update the current selected mail to parent component
 */
export type MailboxProps = {
  owner: string;
  mailboxInfo?: MailboxDto;
  pickMail: React.Dispatch<React.SetStateAction<MailDto | undefined>>;
};

/**
 * Mailbox component, includes folder list with email list
 * @param props
 * @returns
 */
export default function Mailbox(props: MailboxProps) {
  const [currentFolder, setCurrentFolder] = React.useState('Inbox');

  const folder = props.mailboxInfo?.folders?.find(
    (f) => f.path === currentFolder,
  );
  const mailList = folder?.mails?.map((info, index) => (
    <MailLine key={index} info={info} pickMail={props.pickMail} />
  ));

  return (
    <div className="flex flex-row">
      <ul className="border">
        {props.mailboxInfo?.folders?.map((f, index) => {
          return (
            <li
              className="bg-yellow-200 px-2 rounded-md my-1 cursor-pointer"
              key={index}
              onClick={() => setCurrentFolder(f.path)}
            >
              {f.path}
            </li>
          );
        })}
      </ul>
      <table className="w-[60rem] border">
        <thead>
          <tr className="text-center">
            <th className="flex flex-row items-start pl-4 w-[20rem]">
              Subject
            </th>
            <th className="w-[15rem]">From</th>
            <th className="w-[15rem]">To</th>
          </tr>
        </thead>
        <tbody>
          {mailList && mailList.length > 0 ? mailList : <EmptyLine />}
        </tbody>
      </table>
    </div>
  );
}
