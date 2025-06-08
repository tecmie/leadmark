import { PostmanInput } from '~/interfaces/postman.interface';
import { supabase } from '../client';

const findContactByEmail = async (email: string) => {
  try {
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('email', email)
      .eq('primary_contact', 'email') // Ensure primary_contact is 'email'
      .maybeSingle()
      .throwOnError();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

function splitFullName(fullName: string) {
  const name = fullName.split(' ');
  const firstName = name[0];

  /** pick every other name */
  const lastName = name.slice(1).join(' ');
  return { firstName, lastName };
}

/**
 * @operation
 * Create a new contact for this email address
 *
 * Or return the existing contact
 */
export async function contactOperation({ input, mailbox }: { input: PostmanInput; mailbox: any }) {
  try {
    const contact = await findContactByEmail(input.FromFull.Email);

    // If no contact is found or the specific error occurs, create a new contact
    if (!contact) {
      const name = splitFullName(input.FromFull.Name);

      /**
       * @operation
       * Create a new contact for this email address
       */
      const { data: newContact, error: insertError } = await supabase
        .from('contacts')
        .insert([
          {
            first_name: name.firstName,
            last_name: name.lastName,
            email: input.FromFull.Email,
            primary_contact: 'email',
            owner_id: mailbox?.owner_id as string,
            metadata: {
              name: input.FromFull.Name,
              email: input.FromFull.Email,
              origin_mailbox: mailbox?.id,
            },
          },
        ])
        .select('*')
        .single();

      if (insertError) {
        console.error('Error inserting new contact:', insertError);
        return null; // or handle the error appropriately
      }

      return newContact;
    }

    return contact;
  } catch (error) {
    console.error('An unexpected error occurred in contactOperation:', error);
    throw error;
  }
}
