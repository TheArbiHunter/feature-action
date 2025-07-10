import * as core from '@actions/core';

export const sendTelegramMessage = async (
  token: string,
  chatId: string,
  message: string,
): Promise<void> => {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })
    .then(() => core.info('Telegram message sent successfully'))
    .catch(() => core.setFailed('Telegram message failed to send'));
};
