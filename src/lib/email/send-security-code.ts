import "server-only";

import { env } from "@/env";
import { smtpTransport } from "@/lib/email/smtp-transport";

type SendSecurityCodeParams = { to: string; code: string };

export async function sendSecurityCode({ to, code }: SendSecurityCodeParams) {
  await smtpTransport.sendMail({
    from: env.SMTP_FROM,
    to,
    subject: "STUDIO POLE — код подтверждения входа",
    text: [
      "Код подтверждения входа в STUDIO POLE:",
      "",
      code,
      "",
      "Если вы не пытались войти, проигнорируйте это письмо.",
    ].join("\n"),
  });
}
