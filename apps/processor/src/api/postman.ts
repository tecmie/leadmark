import express from "express";
import { InboundMessageDetails } from "postmark/dist/client/models";
import { MailboxBaseWithUserBase } from "@repo/types";
import { getMailboxAndOwnerByUniqueAddress } from "~/services/supabase/base/mailbox.base";
import { PostmanResponse } from "~/interfaces/postman.interface";
import { EventProducerMQ } from "~/events";

const router: express.Router = express.Router();

async function _validateMailbox(
  fullEmail: string
): Promise<MailboxBaseWithUserBase | undefined> {
  /* ------  handle supabase related operations and checks ------ */
  const mailboxWithOwner = await getMailboxAndOwnerByUniqueAddress(fullEmail);
  if (mailboxWithOwner) return mailboxWithOwner;

  console.error("Mailbox not found - [_validateMailbox]");
  return undefined;
}

async function _validateFromPostman(): Promise<boolean> {
  return true;
}

router.post<{}, PostmanResponse>("/", async (req, res) => {
  try {
    const input = req.body as InboundMessageDetails;

    /**
     * @operation
     * Validate that the message is from Postman
     * Check the IP Address from Webhook
     */
    const isFromPostman = await _validateFromPostman();

    if (!isFromPostman) {
      // If not from Postman, throw an error
      throw new Error("Invalid Origin");
    }

    /**
     * @operation
     * Validate the mailbox
     */
    const mailboxWithOwner = await _validateMailbox(input.To);
    if (!mailboxWithOwner) {
      // If the mailbox is not valid, return an error
      res.status(404).json({ message: "Mailbox not found" });
      return;
    }

    const postmanEventProducerMQ = new EventProducerMQ({
      mailbox: mailboxWithOwner,
    });

    /**
     * @operation
     * A flow producer to kickstart a stateful
     * consumption for our new webhook event
     */
    await postmanEventProducerMQ.postman(input);

    /* Return a response to our webhook caller quickly */
    res.json({
      message: "Webhook received",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
