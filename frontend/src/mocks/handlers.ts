import { rest } from "msw";

/**
 * Mocked responses for mailboxes requests.
 * Not constant to be able to modify the elements
 * using the send mail request for testing
 */
let mockMailboxResponses = {
  "carlos1@my-gmail.com": {
    _id: "63bc6311ff31a2ebe4b9714f",
    owner: "carlos1@my-gmail.com",
    folders: [
      {
        _id: "63bc6311ff31a2ebe4b9714c",
        path: "Inbox",
        mails: [
          {
            from: "carlos2@my-gmail.com",
            to: "carlos1@my-gmail.com",
            subject: "Subject Test 75326",
            body: "Body test 123",
          },
        ],
      },
      {
        _id: "63bc6311ff31a2ebe4b9714d",
        path: "Sent",
        mails: [],
      },
      {
        _id: "63bc6311ff31a2ebe4b9714e",
        path: "Trash",
        mails: [],
      },
    ],
    __v: 0,
  },
  "carlos2@my-gmail.com": {
    _id: "63bc76b0ff31a2ebe4b971cb",
    owner: "carlos2@my-gmail.com",
    folders: [
      {
        _id: "63bc76b0ff31a2ebe4b971c8",
        path: "Inbox",
        mails: [],
      },
      {
        _id: "63bc76b0ff31a2ebe4b971c9",
        path: "Sent",
        mails: [],
      },
      {
        _id: "63bc76b0ff31a2ebe4b971ca",
        path: "Trash",
        mails: [],
      },
    ],
    __v: 0,
  },
  default: {
    owner: "carlos3@my-gmail.com",
    folders: [
      {
        _id: "63bd9c926a3fabe1f508b055",
        path: "Inbox",
        mails: [],
      },
      {
        _id: "63bd9c926a3fabe1f508b056",
        path: "Sent",
        mails: [],
      },
      {
        _id: "63bd9c926a3fabe1f508b057",
        path: "Trash",
        mails: [],
      },
    ],
    _id: "63bd9c926a3fabe1f508b058",
    __v: 0,
  },
};

type ResponseKeys = keyof typeof mockMailboxResponses;
const mockKeys: ResponseKeys[] = Object.keys(
  mockMailboxResponses
) as ResponseKeys[];

export const handlers = [
  rest.get("http://localhost:3001/mailbox/:ownerAddress", (req, res, ctx) => {
    const { ownerAddress } = req.params;

    for (const index in mockKeys) {
      if (mockKeys[index] == ownerAddress) {
        return res(
          ctx.json(mockMailboxResponses[ownerAddress as ResponseKeys])
        );
      }
    }

    const result = {
      ...mockMailboxResponses.default,
      ...{ owner: ownerAddress },
    };

    return res(ctx.json(result));
  }),
  rest.post("http://localhost:3001/mail/", async (req, res, ctx) => {
    const { from, to, subject, body } = await req.json();

    let toMailbox: typeof mockMailboxResponses[ResponseKeys];
    let fromMailbox: typeof mockMailboxResponses[ResponseKeys];

    for (const index in mockKeys) {
      if (mockKeys[index] == to) {
        toMailbox = mockMailboxResponses[to as ResponseKeys];
        toMailbox.folders
          .find((f) => f.path == "Inbox")
          ?.mails.push({ from, to, subject, body });
      }
    }

    for (const index in mockKeys) {
      if (mockKeys[index] == from) {
        fromMailbox = mockMailboxResponses[from as ResponseKeys];
        fromMailbox.folders
          .find((f) => f.path == "Sent")
          ?.mails.push({ from, to, subject, body });
      }
    }

    return res(ctx.json({}));
  }),
];
