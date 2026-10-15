import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // قالب HTML ذكي متكيف مع الوضعين الفاتح والداكن (Light & Dark Mode)
  private getEmailTemplate(
    title: string,
    badgeText: string,
    contentHtml: string,
    actionUrl: string,
    actionLabel: string,
  ): string {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const finalUrl = actionUrl.startsWith('http')
      ? actionUrl
      : `${frontendUrl}${actionUrl}`;

    return `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <style>
          :root {
            color-scheme: light dark;
            supported-color-schemes: light dark;
          }

          /* التنسيق الافتراضي (Light Mode) */
          body, .email-body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7f8fb;
            margin: 0;
            padding: 24px 12px;
            direction: rtl;
            text-align: right;
            color: #334155;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 18px;
            overflow: hidden;
            border: 1px solid #eef0f4;
            box-shadow: 0 4px 16px rgba(0,0,0,0.03);
          }
          .header {
            background-color: #14161f;
            padding: 26px 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff !important;
            margin: 0;
            font-size: 20px;
            font-weight: 800;
            letter-spacing: 0.5px;
          }
          .badge {
            display: inline-block;
            padding: 6px 14px;
            background-color: #f0fdf4;
            color: #16a34a;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 700;
            margin-top: 4px;
          }
          .badge.warning { background-color: #fffbeb; color: #d97706; }
          .badge.info { background-color: #eff6ff; color: #2563eb; }
          .content {
            padding: 28px 30px;
            line-height: 1.7;
            font-size: 14px;
          }
          .main-title {
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin: 16px 0;
          }
          .info-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
          }
          .info-table td {
            padding: 11px 12px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 13px;
          }
          .info-table td.label {
            color: #64748b;
            font-weight: 600;
            width: 35%;
          }
          .info-table td.value {
            color: #0f172a;
            font-weight: 700;
          }
          .button-wrapper {
            text-align: center;
            margin: 32px 0 10px;
          }
          .btn {
            background-color: #2563eb !important;
            color: #ffffff !important;
            padding: 13px 30px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 13px;
            display: inline-block;
          }
          .footer {
            background-color: #f8fafc;
            padding: 18px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #eef2f6;
          }

          /* التنسيق المتكيف التلقائي (Dark Mode) */
          @media (prefers-color-scheme: dark) {
            body, .email-body {
              background-color: #0b0f19 !important;
              color: #cbd5e1 !important;
            }
            .container {
              background-color: #111827 !important;
              border-color: #1f2937 !important;
              box-shadow: 0 4px 20px rgba(0,0,0,0.5) !important;
            }
            .header {
              background-color: #080c14 !important;
              border-bottom: 1px solid #1f2937 !important;
            }
            .header h1 {
              color: #f9fafb !important;
            }
            .main-title {
              color: #f8fafc !important;
            }
            .content {
              color: #cbd5e1 !important;
            }
            .info-table td {
              border-bottom-color: #1f2937 !important;
            }
            .info-table td.label {
              color: #94a3b8 !important;
            }
            .info-table td.value {
              color: #f1f5f9 !important;
            }
            .badge {
              background-color: rgba(22, 163, 74, 0.15) !important;
              color: #4ade80 !important;
            }
            .badge.warning {
              background-color: rgba(217, 119, 6, 0.15) !important;
              color: #fbbf24 !important;
            }
            .badge.info {
              background-color: rgba(37, 99, 235, 0.15) !important;
              color: #60a5fa !important;
            }
            .footer {
              background-color: #0a0e17 !important;
              color: #64748b !important;
              border-top-color: #1f2937 !important;
            }
          }
        </style>
      </head>
      <body class="email-body">
        <div class="container">
          <div class="header">
            <h1>منصة كوديكسا الإدارية</h1>
          </div>
          <div class="content">
            <span class="badge ${badgeText.includes('ملاحظات') ? 'warning' : badgeText.includes('مهمة جديدة') ? 'info' : ''}">${badgeText}</span>
            <div class="main-title">${title}</div>
            ${contentHtml}
            <div class="button-wrapper">
              <a href="${finalUrl}" class="btn">${actionLabel}</a>
            </div>
          </div>
          <div class="footer">
            هذا إشعار تلقائي من نظام Codexa لإدارة المشاريع. لا يلزم الرد على هذه الرسالة.
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private async sendMail(to: string, subject: string, html: string) {
    if (!to || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      this.logger.warn(`تخطي إرسال الإيميل إلى ${to}: بيانات الـ SMTP غير مكتملة.`);
      return;
    }

    const cleanTo = to.trim().toLowerCase();
    let actualRecipient = cleanTo;

    // توجيه إيميل السوبر ليدر / الآدمن لإيميل الشركة الرسمي
    if (
      cleanTo.includes('alqadi') ||
      cleanTo.includes('admin@') ||
      cleanTo === 'codexa.egy@gmail.com'
    ) {
      actualRecipient = 'codexa.egy@gmail.com';
    } else if (cleanTo.includes('@codexa')) {
      actualRecipient = cleanTo.replace(/@codexa.*$/i, '@gmail.com');
    }

    // استخراج نسخة نصية خالصة (Text Fallback) لمنع تصنيف الرسالة كـ Spam
    const plainText = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    try {
      await this.transporter.sendMail({
        from: `"Codexa Management" <${process.env.SMTP_USER}>`,
        to: actualRecipient,
        subject,
        text: plainText,
        html,
        headers: {
          'X-Entity-Ref-ID': Date.now().toString(),
        },
      });
      this.logger.log(
        `تم إرسال إشعار بريدي بنجاح إلى: ${actualRecipient} (المسجل بالنظام: ${to})`,
      );
    } catch (error) {
      this.logger.error(`فشل إرسال الإيميل إلى ${actualRecipient}:`, error);
    }
  }

  // 1. إسناد مهمة جديدة للمنفذ
  async sendTaskAssigned(
    executorEmail: string,
    data: {
      taskTitle: string;
      projectName: string;
      deadline?: string;
      reward?: number;
      taskId: string;
    },
  ) {
    const html = this.getEmailTemplate(
      'تم إسناد مهمة جديدة إليك',
      '📌 إسناد مهمة',
      `
        <p>مرحباً، تم تعيينك رسمياً لتنفيذ مهمة جديدة ضمن مشروع <strong>${data.projectName}</strong>.</p>
        <table class="info-table">
          <tr><td class="label">المهمة:</td><td class="value">${data.taskTitle}</td></tr>
          <tr><td class="label">المشروع:</td><td class="value">${data.projectName}</td></tr>
          <tr><td class="label">الموعد النهائي:</td><td class="value">${data.deadline || 'غير محدد'}</td></tr>
          <tr><td class="label">المكافأة:</td><td class="value">${data.reward ? `${data.reward} ج.م` : 'غير محدد'}</td></tr>
        </table>
      `,
      `/dashboard/tasks`,
      'عرض تفاصيل المهمة والبدء',
    );
    await this.sendMail(
      executorEmail,
      `📌 مهمة جديدة مسندة إليك: ${data.taskTitle}`,
      html,
    );
  }

  // 2. إشعار تسليم المهمة 100% (إلى الليدر أو السوبر أدمن)
  async sendTaskSubmitted(
    leadEmail: string,
    data: {
      taskTitle: string;
      projectName: string;
      executorName: string;
      deliverableUrl?: string;
      executorNotes?: string;
    },
  ) {
    const html = this.getEmailTemplate(
      'تسليم مهمة بانتظار المراجعة الفنية',
      '🚀 تم التسليم بنسبة 100%',
      `
        <p>قام المنفذ <strong>${data.executorName}</strong> بإنهاء وتسليم المهمة الموضحة أدناه:</p>
        <table class="info-table">
          <tr><td class="label">المهمة:</td><td class="value">${data.taskTitle}</td></tr>
          <tr><td class="label">المشروع:</td><td class="value">${data.projectName}</td></tr>
          ${data.deliverableUrl ? `<tr><td class="label">رابط التسليم:</td><td class="value"><a href="${data.deliverableUrl}" target="_blank" style="color: #2563eb; font-weight: bold;">معاينة العمل المرفوع</a></td></tr>` : ''}
          ${data.executorNotes ? `<tr><td class="label">توضيح المنفذ:</td><td class="value">${data.executorNotes}</td></tr>` : ''}
        </table>
      `,
      `/dashboard/tasks`,
      'دخول لمراجعة العمل واعتماده',
    );
    await this.sendMail(
      leadEmail,
      `🚀 تسليم مهمة: ${data.taskTitle} بواسطة ${data.executorName}`,
      html,
    );
  }

  // 3. إرجاع ملاحظات وتعديلات للمنفذ
  async sendChangesRequested(
    executorEmail: string,
    data: { taskTitle: string; projectName: string; feedback: string },
  ) {
    const html = this.getEmailTemplate(
      'ملاحظات وتعديلات مطلوبة',
      '⚠️ بانتظار التعديل',
      `
        <p>قام المشرف بمراجعة تسليمك للمهمة <strong>${data.taskTitle}</strong> وسجل الملاحظات التالية:</p>
        <div style="background: rgba(217, 119, 6, 0.1); border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 10px; padding: 14px; margin: 15px 0; color: #b45309; font-weight: 600;">
          ${data.feedback}
        </div>
        <p>يرجى مراجعة النقاط وتعديلها وإعادة التسليم في أقرب وقت.</p>
      `,
      `/dashboard/tasks`,
      'تعديل وإعادة تسليم المهمة',
    );
    await this.sendMail(
      executorEmail,
      `⚠️ ملاحظات على مهمة: ${data.taskTitle}`,
      html,
    );
  }

  // 4. الاعتماد الفني للمهمة (إلى السوبر أدمن للصرف)
  async sendTechnicalApproved(
    adminEmail: string,
    data: {
      taskTitle: string;
      projectName: string;
      executorName: string;
      reward: number;
    },
  ) {
    const html = this.getEmailTemplate(
      'اعتماد فني للمهمة - بانتظار الصرف المالي',
      '✅ معتمدة فنياً',
      `
        <p>تم الانتهاء من مراجعة مهمة <strong>${data.taskTitle}</strong> وتأكيد استيفائها لجميع المتطلبات الفنية.</p>
        <table class="info-table">
          <tr><td class="label">المشروع:</td><td class="value">${data.projectName}</td></tr>
          <tr><td class="label">المنفذ:</td><td class="value">${data.executorName}</td></tr>
          <tr><td class="label">المستحقات:</td><td class="value">${data.reward} ج.م</td></tr>
        </table>
      `,
      `/dashboard/tasks`,
      'الانتقال لصرف مستحقات المهمة',
    );
    await this.sendMail(
      adminEmail,
      `✅ تم الاعتماد الفني لمهمة: ${data.taskTitle}`,
      html,
    );
  }

  // 5. إيداع المكافأة المالية في المحفظة للمنفذ
  async sendPayoutDeposited(
    executorEmail: string,
    data: { taskTitle: string; amount: number; balance: number },
  ) {
    const html = this.getEmailTemplate(
      'تم إيداع أرباحك في المحفظة',
      '🎉 إيداع مالي جديد',
      `
        <p>تهانينا! تم اعتماد وصرف المستحقات المالية الخاصة بمهمة <strong>${data.taskTitle}</strong> إلى محفظتك بنجاح.</p>
        <table class="info-table">
          <tr><td class="label">المبلغ المودع:</td><td class="value" style="color: #16a34a;">+${data.amount} ج.م</td></tr>
          <tr><td class="label">رصيدك الحالي:</td><td class="value">${data.balance} ج.م</td></tr>
        </table>
      `,
      `/dashboard/wallet`,
      'عرض رصيد المحفظة والمعاملات',
    );
    await this.sendMail(
      executorEmail,
      `🎉 تم إيداع ${data.amount} ج.م في محفظتك`,
      html,
    );
  }
}