import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendNotificationDto } from './dto/send-notification.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT', 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP transporter initialized for ${host}:${port}`);
    } else {
      this.logger.warn(
        'SMTP credentials not fully provided. Mail service operating in log-only mode.',
      );
    }
  }

  async sendEmail(dto: SendNotificationDto): Promise<{ success: boolean; message: string }> {
    const from =
      this.configService.get<string>('SMTP_FROM') ||
      'Codexa Agency <noreply@codexa.net>';

    if (!this.transporter) {
      this.logger.log(
        `[LOG-ONLY MAIL] To: ${dto.to} | Subject: ${dto.subject}\nContent: ${dto.content}`,
      );
      return {
        success: true,
        message: 'Mail logged (SMTP credentials not configured).',
      };
    }

    try {
      await this.transporter.sendMail({
        from,
        to: dto.to,
        subject: dto.subject,
        html: dto.content,
      });
      this.logger.log(`Email successfully sent to ${dto.to}`);
      return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send email to ${dto.to}: ${errMessage}`);
      return { success: false, message: `Failed to send email: ${errMessage}` };
    }
  }

  async sendPortalLink(
    email: string,
    clientName: string,
    portalUrl: string,
  ): Promise<{ success: boolean; message: string }> {
    const subject = 'رابط الوصول لإدارة مشروعك — Codexa Client Portal';
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; direction: rtl; text-align: right; background-color: #0f172a; color: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
          <h2 style="color: #38bdf8; margin-bottom: 16px;">مرحباً ${clientName}،</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
            يسعدنا تواصلك معنا في شركة Codexa. تم تجهيز بوابة العميل (Client Portal) المخصصة لمتابعة سير مشروعك وتفاصيل المراحل لحظة بلحظة.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${portalUrl}" target="_blank" style="background-color: #0284c7; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
              الدخول لبوابة العميل
            </a>
          </div>
          <p style="font-size: 14px; color: #94a3b8; margin-top: 24px;">
            أو يمكنك نسخ الرابط التالي وفتحه في المتصفح:<br/>
            <span style="color: #38bdf8; word-break: break-all;">${portalUrl}</span>
          </p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            Codexa Software Solutions © 2026 — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({ to: email, subject, content: html });
  }

  async sendProjectProgressUpdate(
    email: string,
    clientName: string,
    projectName: string,
    progress: number,
    stageTitle?: string,
  ): Promise<{ success: boolean; message: string }> {
    const subject = `تحديث نسبة الإنجاز للمشروع: ${projectName}`;
    const stageInfo = stageTitle
      ? `<p style="font-size: 15px; color: #cbd5e1;">المرحلة الحالية: <strong>${stageTitle}</strong></p>`
      : '';

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; direction: rtl; text-align: right; background-color: #0f172a; color: #f8fafc; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155;">
          <h2 style="color: #38bdf8; margin-bottom: 16px;">مرحباً ${clientName}،</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
            تم تحديث تقدم مشروعك <strong>${projectName}</strong> لدى شركة Codexa.
          </p>
          <div style="background-color: #0f172a; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #334155;">
            <p style="font-size: 18px; color: #38bdf8; margin: 0 0 10px 0;">نسبة الإنجاز الإجمالية: <strong>${progress}%</strong></p>
            ${stageInfo}
          </div>
          <p style="font-size: 14px; color: #94a3b8;">
            يمكنك متابعة تفاصيل المراحل والملاحظات مباشرة من خلال بوابة العميل الخاصة بك.
          </p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 32px 0;" />
          <p style="font-size: 12px; color: #64748b; text-align: center;">
            Codexa Software Solutions © 2026 — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({ to: email, subject, content: html });
  }
}
