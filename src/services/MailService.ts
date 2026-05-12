import { apiPost } from './baseClient.ts';
import type { MailDTORequest } from './Interfaces.ts';

export async function sendMail(
  token: string,
  mailData: MailDTORequest,
): Promise<string> {
  const response = await apiPost<string>('/email/send', mailData, token);
  return response;
}
