import { supabase } from '../client';

function getNormalizedEmail(email: string) {
  // Some email clients, E.g "Zoho mail" may send the email TO field as '"paul" <paul@leadmark.email>'
  email = email.trim().toLowerCase();
  let name;

  if (email.startsWith('"')) {
    name = email.match(/^"(.+)"\s*</)![1];
    email = email.replace(/^"(.+)"\s*</, '');
    email = email.replace(/>$/, '');
  }

  if (email.startsWith("'")) {
    name = email.match(/^'(.+)'\s*</)![1];
    email = email.replace(/^'(.+)'\s*</, '');
    email = email.replace(/>$/, '');
  }


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email address: ${email}`);
  }

  const [uniqueAddress, dotcom] = email.split('@');

  console.log({ uniqueAddress, dotcom, name }, '[IMailbox.getNormalizedEmail]');

  return { uniqueAddress, dotcom, name };
}


export async function getMailboxAndOwnerByUniqueAddress(address: string) {
    const { uniqueAddress, dotcom } = getNormalizedEmail(address);
  
    try {
      const { data, error } = await supabase
        .from('mailboxes')
        .select('*, owner:owner_id(*)')
        .eq('unique_address', uniqueAddress as string)
        .eq('dotcom', dotcom as string)
        .single();
  
      console.log({ data, error }, '[IMailbox.getMailboxAndOwnerByUniqueAddress]');
  
      if (error) {
        throw error;
      }
  
      return data;
    } catch (error) {
      console.error(error);
    }
  }
  