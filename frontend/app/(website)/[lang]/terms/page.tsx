import { Container } from '@/components/shared/container'
import {
  FileText,
  Code2,
  Lock,
  DollarSign,
  Clock,
  ShieldAlert,
  Server,
  Scale,
} from 'lucide-react'

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const isArabic = lang === 'ar'

  const sections = isArabic
    ? [
        {
          icon: FileText,
          title: '1. التعريفات وقبول الشروط',
          content:
            'تُعد هذه الشروط والأحكام بمثابة اتفاقية قانونية ملزمة بين شركة كوديكسا للبرمجيات والحلول الرقمية (Codexa) وبين العميل. إن تصفحك للموقع أو طلبك لأي عرض سعر أو التعاقد على أي من خدماتنا يُعد إقراراً وموافقةً صريحة منك على الالتزام الكامل بجميع البنود الواردة في هذه الوثيقة.',
          bullets: [
            'تطبق هذه الشروط على كافة الخدمات البرمجية، التصميمية، والاستشارية التي تقدمها كوديكسا.',
            'في حال وجود عقد منفصل موقع بين الطرفين، تُعد هذه الشروط مكملة له فيما لم يرد به نص خاص.',
          ],
        },
        {
          icon: Code2,
          title: '2. نطاق العمل والتعديلات الإضافية',
          content:
            'يتم تنفيذ المشروع وفقاً لوثيقة المتطلبات الفنية وعرض السعر المعتمد من العميل قبل بدء التنفيذ. تلتزم كوديكسا بتسليم المخرجات المحددة في النطاق المتفق عليه فقط.',
          bullets: [
            'يحق للعميل طلب مراجعات على التصميم أو الواجهات ضمن الحدود المتفق عليها قبل اعتماد المرحلة.',
            'أي طلبات لإضافة خصائص جديدة أو تعديلات جوهرية خارج النطاق المتفق عليه (Out of Scope) بعد اعتماد المرحلة تخضع لتقدير تكلفة مالية إضافية ومدة زمنية مستقلة.',
          ],
        },
        {
          icon: Lock,
          title: '3. حقوق الملكية الفكرية والشفرة المصدرية (Source Code)',
          content:
            'تحتفظ شركة كوديكسا بكامل حقوق الملكية الفكرية والبرمجية للأكواد المصدرية (Source Code)، والمكتبات البرمجية الخاصة بها، والهيكل الهندسي للأنظمة المطورة.',
          bullets: [
            'ترخيص الاستخدام: يمنح العميل بعد سداد كامل المستحقات ترخيصاً دائماً لاستخدام وتشغيل النسخة التنفيذية للمشروع للغرض المتفق عليه، ويمتلك العميل كامل حقوق علامته التجارية وبياناته ومحتواه.',
            'ملكية السورس كود: لا يشمل التعاقد تسليم الشفرة المصدرية (Source Code) للعميل بشكل افتراضي، ولا يتم التنازل عنها أو تسليمها إلا بموجب اتفاق كتابي مستقل يتضمن سداد رسوم شراء وحقوق ملكية الكود المصدري.',
            'حظر النسخ والهندسة العكسية: يُحظر على العميل أو أي طرف ثالث نسخ النظام، أو إجراء هندسة عكسية (Reverse Engineering)، أو فك التشفير، أو إعادة بيع البرمجيات لأطراف أخرى دون إذن كتابي مسبق من كوديكسا.',
          ],
        },
        {
          icon: DollarSign,
          title: '4. السياسة المالية ونظام الدفعات',
          content:
            'تُسدد مستحقات المشاريع وفق جدول الدفعات المحدد في العرض المالي (دفعة مقدمة لبدء العمل، ودفعات مرحلية، ودفعة نهائية قبل الإطلاق والتسليم النهائي).',
          bullets: [
            'الدفعة المقدمة (العربون) غير قابلة للاسترداد بعد بدء العمل وتخصيص الموارد وفريق التطوير للمشروع.',
            'في حال تأخر العميل عن سداد أي دفعة مستحقة لأكثر من (7) أيام عمل، يحق لكوديكسا تعليق العمل في المشروع أو إيقاف الخدمات مؤقتاً لحين سداد المستحقات دون أدنى مسؤولية عن تأخر الجدول الزمني.',
            'لا تشمل أسعار التطوير رسوم الاستضافات الخارجية، أو النطاقات (Domains)، أو تراخيص الطرف الثالث، أو رسوم حسابات المطورين (Apple / Google) ما لم يُذكر خلاف ذلك صراحةً.',
          ],
        },
        {
          icon: Clock,
          title: '5. الجدول الزمني والتزامات العميل',
          content:
            'تلتزم كوديكسا بالجدول الزمني المقدر للتنفيذ شريطة التزام العميل بتقديم كافة المتطلبات والمحتوى والردود في الأوقات المحددة.',
          bullets: [
            'يلتزم العميل بتوفير النصوص، الشعارات، الصور، وبيانات الربط (APIs) اللازمة للعمل في الوقت المتفق عليه.',
            'أي تأخير من جانب العميل في تسليم المحتوى أو اعتماد المراحل يُضاف تلقائياً إلى المدة الإجمالية للمشروع ولا يُحسب تأخيراً على كوديكسا.',
          ],
        },
        {
          icon: ShieldAlert,
          title: '6. الضمان الفني، الصيانة، والتدخل الخارجي',
          content:
            'تقدم كوديكسا فترة ضمان فني مجاني بعد التسليم النهائي لمعالجة أي أخطاء برمجية مصنعية (Bugs) تظهر ضمن الوظائف المتفق عليها.',
          bullets: [
            'يسقط الضمان الفني فوراً وتخلي كوديكسا مسؤوليتها بالكامل في حال قيام العميل أو أي مبرمج أو طرف ثالث غير مصرح له بالدخول إلى الخوادم أو التعديل على الكود أو قواعد البيانات.',
            'بعد انتهاء فترة الضمان المجاني، يمكن للعميل التعاقد على باقات الصيانة والدعم الفني الدورية (تحديثات، نسخ احتياطي، وحماية) بعقد مستقل.',
          ],
        },
        {
          icon: Server,
          title: '7. خدمات الأطراف الثالثة والاستضافة',
          content:
            'قد تعتمد بعض الأنظمة على خدمات مقدمة من أطراف ثالثة (مثل مزودي الاستضافة السحابية، بوابات الدفع الإلكتروني، خدمات الرسائل النصية، أو متاجر التطبيقات).',
          bullets: [
            'لا تتحمل كوديكسا أي مسؤولية عن انقطاع الخدمة، أو تغيير السياسات أو الأسعار، أو التأخير الناتج عن مزودي خدمات الطرف الثالث أو إجراءات مراجعة التطبيقات في متاجر Apple و Google.',
          ],
        },
        {
          icon: Scale,
          title: '8. الإشارة للمشروع والقانون الحاكم',
          content:
            'تحتفظ كوديكسا بالحق في إدراج اسم وشعار المشروع ضمن سابقة أعمالها (Portfolio) والمواد التسويقية الخاصة بها، ما لم يتم توقيع اتفاقية عدم إفصاح (NDA) تنص على غير ذلك.',
          bullets: [
            'تخضع هذه الشروط والأحكام وتُفسر وفقاً للقوانين واللوائح المعمول بها في جمهورية مصر العربية، وتختص المحاكم المصرية بالنظر في أي نزاع ينشأ عنها.',
          ],
        },
      ]
    : [
        {
          icon: FileText,
          title: '1. Definitions & Acceptance of Terms',
          content:
            'These Terms & Conditions constitute a legally binding agreement between Codexa Software Studio ("Codexa") and the Client. By accessing our website, requesting a quote, or engaging our services, you explicitly agree to be bound by all terms stated herein.',
          bullets: [
            'These terms apply to all software development, UI/UX design, and consulting services provided by Codexa.',
            'Where a separate signed contract exists, these terms serve as a supplementary framework.',
          ],
        },
        {
          icon: Code2,
          title: '2. Scope of Work & Change Requests',
          content:
            'Projects are executed strictly according to the technical scope and commercial proposal approved prior to kick-off.',
          bullets: [
            'Design and interface revisions are included within the agreed milestone limits before stage sign-off.',
            'Any additional features, structural modifications, or out-of-scope requests after stage approval will require a separate cost and timeline estimate.',
          ],
        },
        {
          icon: Lock,
          title: '3. Intellectual Property & Source Code Ownership',
          content:
            'Codexa retains full intellectual property rights, proprietary rights, and ownership of all underlying Source Code, internal libraries, software architecture, and development tools.',
          bullets: [
            'Usage License: Upon full payment settlement, the Client is granted a perpetual license to operate and use the compiled/deployed system for its intended business purpose. The Client retains full ownership of their brand assets, content, and user data.',
            'Source Code Handover: Standard service agreements do NOT include the handover or transfer of raw Source Code. Source Code transfer requires a separate written buyout agreement and additional licensing fees.',
            'Restrictions: The Client or any third party is strictly prohibited from copying, reselling, decompiling, or reverse-engineering the software without prior written consent from Codexa.',
          ],
        },
        {
          icon: DollarSign,
          title: '4. Financial Policy & Payment Terms',
          content:
            'Payments are scheduled across agreed project milestones (initial kick-off deposit, milestone payments, and final pre-launch settlement).',
          bullets: [
            'Initial down payments (deposits) are strictly non-refundable once project resources and engineering teams have been allocated.',
            'If any scheduled payment is delayed beyond seven (7) business days, Codexa reserves the right to pause development or suspend services until settlement is completed.',
            'Development quotes exclude third-party hosting, domains, external API subscriptions, and developer store fees (Apple/Google) unless explicitly stated.',
          ],
        },
        {
          icon: Clock,
          title: '5. Timelines & Client Obligations',
          content:
            'Estimated delivery timelines depend on timely collaboration, content provision, and stage approvals from the Client.',
          bullets: [
            'The Client agrees to provide required assets, text, and API credentials according to the project schedule.',
            'Any delays in client feedback or asset delivery will automatically extend the delivery timeline without liability on Codexa.',
          ],
        },
        {
          icon: ShieldAlert,
          title: '6. Technical Warranty & Third-Party Interference',
          content:
            'Codexa provides a post-launch warranty period covering verifiable software bugs within the agreed project scope.',
          bullets: [
            'The warranty is immediately voided if the Client or any unauthorized third-party developer modifies the codebase, server configuration, or database.',
            'Ongoing maintenance, server management, and feature upgrades post-warranty are available via separate support plans.',
          ],
        },
        {
          icon: Server,
          title: '7. Third-Party Services & Hosting',
          content:
            'Systems may integrate with external providers (cloud hosting, payment gateways, SMS providers, or app stores).',
          bullets: [
            'Codexa is not liable for downtime, policy changes, pricing updates, or app review delays caused by third-party providers (including Apple App Store and Google Play).',
          ],
        },
        {
          icon: Scale,
          title: '8. Portfolio Rights & Governing Law',
          content:
            'Codexa reserves the right to display the completed project in its portfolio unless a signed Non-Disclosure Agreement (NDA) specifies otherwise.',
          bullets: [
            'These Terms & Conditions are governed by and construed in accordance with the laws of the Arab Republic of Egypt.',
          ],
        },
      ]

  return (
    <div className="py-12 sm:py-20 md:py-28" dir={isArabic ? 'rtl' : 'ltr'}>
      <Container className="max-w-4xl space-y-8 sm:space-y-12">
        <div className="space-y-3 text-start sm:space-y-4">
          <span className="inline-block rounded-full bg-[#4b3fdf]/10 px-3.5 py-1 text-[11px] font-bold text-[#4b3fdf] dark:text-indigo-400 sm:px-4 sm:text-xs">
            {isArabic ? 'اتفاقية الاستخدام والتعاقد' : 'Usage Agreement & Terms'}
          </span>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {isArabic ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </h1>
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base">
            {isArabic
              ? 'تحدد هذه الاتفاقية الإطار القانوني والتعاقدي لتقديم خدماتنا البرمجية، وضوابط استخدام الأنظمة، وحقوق الملكية الفكرية لشركة كوديكسا وعملائها.'
              : 'This agreement defines the legal and contractual framework for our software services, system usage policies, and intellectual property rights.'}
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