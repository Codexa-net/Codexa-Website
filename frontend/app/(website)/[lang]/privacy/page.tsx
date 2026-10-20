import { Container } from '@/components/shared/container'
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Share2,
  Bell,
  Mail,
} from 'lucide-react'

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const isArabic = lang === 'ar'

  const sections = isArabic
    ? [
        {
          icon: Eye,
          title: '1. البيانات والمعلومات التي نجمعها',
          content:
            'نقوم في كوديكسا بجمع البيانات الضرورية فقط لتقديم خدماتنا البرمجية والتواصل الفعال مع عملائنا وزوار موقعنا.',
          bullets: [
            'بيانات التواصل المباشر: الاسم، البريد الإلكتروني، رقم الهاتف أو الواتساب، واسم الشركة عند ملء نماذج طلب المشروع أو التواصل معنا.',
            'بيانات المشروع: التفاصيل الفنية، الملفات المرفقة، والميزانية التقريبية التي يشاركها العميل لدراسة مشروعه.',
            'البيانات التقنية التلقائية: نوع المتصفح، نوع الجهاز، وعنوان الشبكة (IP) لأغراض الحماية الأمنية وتحسين سرعة وأداء الموقع على الهواتف والحواسيب.',
          ],
        },
        {
          icon: Database,
          title: '2. كيفية استخدام البيانات ومعالجتها',
          content:
            'تُستخدم البيانات التي نجمعها حصرياً للأغراض المهنية والتعاقدية المرتبطة بخدمات كوديكسا:',
          bullets: [
            'دراسة متطلبات المشاريع وتقديم عروض الأسعار الفنية والمالية الدقيقة.',
            'إدارة حسابات العملاء، متابعة مراحل التنفيذ، وتقديم خدمات الدعم الفني والصيانة.',
            'تحسين جودة واجهات الموقع وتجربة المستخدم بناءً على تحليلات الأداء.',
          ],
        },
        {
          icon: ShieldCheck,
          title: '3. سرية المشاريع واتفاقيات عدم الإفصاح (NDA)',
          content:
            'نلتزم في كوديكسا بأعلى معايير الأمانة المهنية والسرية التامة لكافة أفكار ومشاريع وبيانات عملائنا.',
          bullets: [
            'تُعامل جميع المستندات، خطط العمل، وبيانات المشاريع التي يشاركها العميل باعتبارها معلومات سرية لا يجوز كشفها لأي جهة خارجية.',
            'لا يتم استغلال أي بيانات تجارية أو قواعد بيانات خاصة بمشروع العميل لأي غرض خارج نطاق تنفيذ المشروع المتفق عليه.',
          ],
        },
        {
          icon: Lock,
          title: '4. أمن وحماية المعلومات',
          content:
            'نطبق إجراءات تقنية وتنظيمية صارمة لحماية البيانات من الوصول غير المصرح به أو الفقدان أو التلاعب.',
          bullets: [
            'استخدام بروتوكولات اتصال مشفرة (SSL/HTTPS) وقواعد بيانات مؤمنة بصلاحيات وصول محددة.',
            'تقييد الوصول إلى بيانات المشاريع ليقتصر فقط على المهندسين ومديري المشاريع المسؤولين مباشرة عن التنفيذ.',
          ],
        },
        {
          icon: Share2,
          title: '5. مشاركة البيانات وخدمات الطرف الثالث',
          content:
            'نحن لا نقوم ببيع أو تأجير أو المتاجرة ببياناتك الشخصية لأي طرف ثالث تحت أي ظرف.',
          bullets: [
            'قد تتم مشاركة بعض البيانات التقنية اللازمة فقط مع مزودي البنية التحتية المعتمدين لتشغيل مشروعك (مثل خوادم الاستضافة السحابية أو بوابات الدفع التي يختارها العميل).',
            'لا نفصح عن أي معلومات إلا في حال وجود التزام قانوني رسمي يقتضي ذلك.',
          ],
        },
        {
          icon: Bell,
          title: '6. ملفات تعريف الارتباط (Cookies)',
          content:
            'يستخدم موقع كوديكسا ملفات تعريف ارتباط أساسية وضرورية لتشغيل الموقع بكفاءة.',
          bullets: [
            'تُستخدم لحفظ تفضيلات الزائر مثل اللغة المختارة (العربية / الإنجليزية) والوضع اللوني (الداكن / الفاتح).',
            'يمكنك التحكم في إعدادات ملفات تعريف الارتباط أو تعطيلها في أي وقت من خلال إعدادات متصفحك.',
          ],
        },
        {
          icon: Mail,
          title: '7. حقوقك والتواصل معنا',
          content:
            'يحق لك في أي وقت الاستفسار عن بياناتك المسجلة لدينا، أو طلب تحديثها، أو طلب حذفها بالكامل من سجلات التواصل.',
          bullets: [
            'البريد الإلكتروني الرسمي: codexa.egy@gmail.com',
            'الهاتف / واتساب: 01277158762',
          ],
        },
      ]
    : [
        {
          icon: Eye,
          title: '1. Information We Collect',
          content:
            'At Codexa, we collect only the information necessary to deliver our software services and communicate effectively with our clients.',
          bullets: [
            'Contact Details: Name, email address, phone/WhatsApp number, and company name submitted via our contact forms.',
            'Project Specifications: Technical briefs, files, and project requirements shared for estimation and development.',
            'Technical Logs: Browser type, device screen metrics, and IP address for security protection and mobile/desktop performance optimization.',
          ],
        },
        {
          icon: Database,
          title: '2. How We Process & Use Data',
          content:
            'Collected data is used strictly for professional and contractual purposes related to Codexa services:',
          bullets: [
            'Evaluating project requirements and preparing accurate technical and financial proposals.',
            'Managing client accounts, tracking development milestones, and providing technical support.',
            'Enhancing website usability, responsiveness, and overall user experience.',
          ],
        },
        {
          icon: ShieldCheck,
          title: '3. Project Confidentiality & Non-Disclosure (NDA)',
          content:
            'We uphold strict professional confidentiality regarding all client business ideas, trade secrets, and project data.',
          bullets: [
            'All project briefs, business models, and operational data shared with Codexa are treated as strictly confidential.',
            'Client databases and business logic are never repurposed or shared outside the scope of the contracted project.',
          ],
        },
        {
          icon: Lock,
          title: '4. Data Security & Infrastructure',
          content:
            'We implement rigorous technical and organizational safeguards to protect your data against unauthorized access or loss.',
          bullets: [
            'Encrypted communication channels (SSL/HTTPS) and role-based access control across our development environments.',
            'Access to project data is restricted solely to the engineering and project management personnel assigned to your project.',
          ],
        },
        {
          icon: Share2,
          title: '5. Third-Party Disclosure',
          content:
            'We never sell, rent, or trade your personal or business information to third parties.',
          bullets: [
            'Data is only shared with essential infrastructure providers required to operate your system (e.g., cloud hosting or payment gateways selected for the project).',
            'Disclosures are otherwise made only when required by applicable law.',
          ],
        },
        {
          icon: Bell,
          title: '6. Cookies & Preferences',
          content:
            'Our website uses essential cookies to ensure smooth navigation and optimal performance.',
          bullets: [
            'Used to remember user preferences such as display language (AR/EN) and theme mode (Dark/Light).',
            'You may modify or disable cookies at any time through your browser settings.',
          ],
        },
        {
          icon: Mail,
          title: '7. Your Rights & Contact Channels',
          content:
            'You have the right to request access to, correction of, or deletion of your personal contact data held in our records.',
          bullets: [
            'Official Email: codexa.egy@gmail.com',
            'Phone / WhatsApp: 01277158762',
          ],
        },
      ]

  return (
    <div className="py-12 sm:py-20 md:py-28" dir={isArabic ? 'rtl' : 'ltr'}>
      <Container className="max-w-4xl space-y-8 sm:space-y-12">
        <div className="space-y-3 text-start sm:space-y-4">
          <span className="inline-block rounded-full bg-[#4b3fdf]/10 px-3.5 py-1 text-[11px] font-bold text-[#4b3fdf] dark:text-indigo-400 sm:px-4 sm:text-xs">
            {isArabic ? 'حماية وخصوصية البيانات' : 'Data Protection & Privacy'}
          </span>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {isArabic ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
            {isArabic
              ? 'في كوديكسا، نلتزم بحماية خصوصية بياناتك وسرية مشاريعك وأفكارك الرقمية وفق أعلى معايير الأمان المهني والتقني.'
              : 'At Codexa, we are committed to safeguarding your personal data and project confidentiality under the highest security standards.'}
          </p>
          <p className="text-[11px] text-muted-foreground/60 sm:text-xs">
            {isArabic ? 'آخر تحديث: أكتوبر 2026' : 'Last updated: October 2026'}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <div
                key={index}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:border-[#4b3fdf]/40 dark:bg-zinc-950/60 sm:p-6 md:p-8"
              >
                <div className="flex items-start gap-3 pb-3 sm:items-center">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#4b3fdf]/10 text-[#4b3fdf] dark:text-indigo-400 sm:size-9">
                    <Icon className="size-4 sm:size-5" />
                  </div>
                  <h2 className="text-base font-bold leading-snug text-foreground sm:text-lg md:text-xl">
                    {section.title}
                  </h2>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {section.content}
                </p>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2 border-t border-border/50 pt-3 text-xs leading-relaxed text-muted-foreground/90 dark:border-white/5 sm:text-sm">
                    {section.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#4b3fdf] dark:bg-indigo-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}