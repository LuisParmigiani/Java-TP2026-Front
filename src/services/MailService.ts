import { apiPost } from './baseClient.ts';
import type { MailDTORequest } from './Interfaces.ts';

export async function sendMail(
  token: string,
  mailData: MailDTORequest,
): Promise<string> {
  try {
    const response = await apiPost<string>('/email/send', mailData, token);
    return response;
  } catch (error) {
    console.error('Error in sendMail:', error);
    throw error;
  }
}
