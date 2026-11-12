import { l, L } from "../i18n";

/** All domains are fictional and use the reserved .test / .invalid suffixes. */
export interface Clue { id: string; suspicious: boolean; title: L; why: L }
export interface Seg { t: L; clue?: string }
export interface Email {
  id: string; title: L; brief: L;
  from: { name: L; addr: string; clue: string };
  to: string; cc?: { name: string; addr: string };
  subject: { t: L; clue: string };
  date: { t: L; clue: string };
  body: Seg[][];
  link?: { label: L; url: string; clue: string };
  attachment?: { name: string; clue: string };
  signature: { t: L; clue: string };
  clues: Clue[];
}

export const EMAILS: Email[] = [
  {
    id: "mailbox",
    title: l("Mailbox full", "صندوق البريد ممتلئ"),
    brief: l("A message that claims to come from IT.", "رسالة تدّعي أنها من قسم تقنية المعلومات."),
    from: { name: l("IT Support", "الدعم الفني"), addr: "helpdesk@nile-logistics-it.invalid", clue: "sender" },
    to: "you@nilelogistics.test",
    subject: { t: l("Action required: your mailbox will be disabled in 2 hours", "إجراء مطلوب: سيتم تعطيل صندوق بريدك خلال ساعتين"), clue: "urgency" },
    date: { t: l("Mon 09:14", "الاثنين 09:14"), clue: "date" },
    body: [
      [{ t: l("Dear user,", "عزيزي المستخدم،"), clue: "greeting" }],
      [{ t: l("Your mailbox has exceeded its storage limit. To keep sending and receiving email, you must verify your account now.", "لقد تجاوز صندوق بريدك حد التخزين. لمواصلة إرسال الرسائل واستقبالها يجب أن تتحقق من حسابك الآن.") }],
    ],
    link: { label: l("Verify mailbox now", "تحقق من صندوق البريد الآن"), url: "https://nile-logistics-it.invalid/login", clue: "link" },
    signature: { t: l("Nile Logistics IT Department", "قسم تقنية المعلومات – نايل للخدمات اللوجستية"), clue: "logo" },
    clues: [
      { id: "sender", suspicious: true, title: l("Lookalike sender domain", "نطاق مرسل يشبه الحقيقي"), why: l("The display name says IT Support, but the address ends in nile-logistics-it.invalid. Your organization's real domain is nilelogistics.test. Always read the address, not the name.", "الاسم المعروض هو الدعم الفني، لكن العنوان ينتهي بـ nile-logistics-it.invalid. نطاق مؤسستك الحقيقي هو nilelogistics.test. اقرأ العنوان دائمًا وليس الاسم فقط.") },
      { id: "urgency", suspicious: true, title: l("Artificial urgency", "استعجال مصطنع"), why: l("A two-hour deadline and the threat of losing access are designed to rush you past checking.", "مهلة الساعتين والتهديد بفقدان الوصول مصمّمان لدفعك إلى التصرف قبل التحقق.") },
      { id: "link", suspicious: true, title: l("Link leads to a sign-in page off your domain", "الرابط يقود إلى صفحة دخول خارج نطاق مؤسستك"), why: l("The button points to nile-logistics-it.invalid, not nilelogistics.test. Typing your password there would hand it to the attacker. Don't click: open the official portal yourself or call IT on a known number.", "الزر يشير إلى nile-logistics-it.invalid وليس nilelogistics.test. إدخال كلمة المرور هناك يسلّمها للمهاجم. لا تنقر: افتح البوابة الرسمية بنفسك أو اتصل بالدعم الفني على رقم تعرفه.") },
      { id: "greeting", suspicious: true, title: l("Generic greeting", "تحية عامة"), why: l("Real internal notices usually use your name. A generic greeting suggests a message sent to many people. It is a weak sign on its own, but it adds up.", "الرسائل الداخلية الحقيقية تستخدم اسمك عادةً. التحية العامة تشير إلى رسالة أُرسلت لعدد كبير من الناس. هي علامة ضعيفة وحدها لكنها تتراكم مع غيرها.") },
      { id: "logo", suspicious: false, title: l("Company name in the signature", "اسم الشركة في التوقيع"), why: l("Not a warning sign by itself. Names and logos are easy to copy, so a professional look proves nothing either way.", "ليست علامة تحذير بحد ذاتها. الأسماء والشعارات سهلة النسخ، لذلك المظهر المهني لا يثبت شيئًا في أي اتجاه.") },
      { id: "date", suspicious: false, title: l("Date and time", "التاريخ والوقت"), why: l("Normal. Timing alone doesn't tell you whether a message is genuine.", "طبيعي. التوقيت وحده لا يخبرك إن كانت الرسالة حقيقية.") },
    ],
  },
  {
    id: "vendor",
    title: l("Vendor bank change", "تغيير الحساب البنكي لمورّد"),
    brief: l("An invoice email that asks you to pay a new account.", "رسالة فاتورة تطلب الدفع إلى حساب جديد."),
    from: { name: l("Atlas Components – Accounts", "أطلس للمكوّنات – الحسابات"), addr: "accounts@atlas-components-billing.invalid", clue: "sender" },
    to: "you@nilelogistics.test",
    cc: { name: "Hana Mostafa", addr: "hana.mostafa@nilelogistics.test" },
    subject: { t: l("Updated bank details for invoice 4471", "بيانات بنكية محدّثة للفاتورة 4471"), clue: "subject" },
    date: { t: l("Wed 16:42", "الأربعاء 16:42"), clue: "date" },
    body: [
      [{ t: l("Hello,", "مرحبًا،") }],
      [{ t: l("Our bank account has changed. ", "تغيّر حسابنا البنكي. "), clue: "change" }, { t: l("Please pay invoice 4471 to the new account listed in the attachment ", "يرجى دفع الفاتورة 4471 إلى الحساب الجديد المذكور في المرفق "), clue: "invoice" }, { t: l("today, before the end of business.", "اليوم قبل نهاية الدوام."), clue: "rush" }],
      [{ t: l("Our phone lines are being migrated, so please do not call. Reply by email to confirm.", "خطوط الهاتف لدينا قيد النقل، لذا يرجى عدم الاتصال. أكّد بالرد على هذا البريد."), clue: "nocall" }],
    ],
    attachment: { name: "Invoice_4471_new_bank.pdf", clue: "attachment" },
    signature: { t: l("Atlas Components – Accounts Receivable", "أطلس للمكوّنات – الذمم المدينة"), clue: "sig" },
    clues: [
      { id: "sender", suspicious: true, title: l("Lookalike vendor domain", "نطاق مورّد مشابه"), why: l("Your vendor's known domain is atlas-components.test. This one adds \"-billing\" and ends in .invalid. Compare it with the address already in your vendor records.", "نطاق مورّدك المعروف هو atlas-components.test. هذا النطاق يضيف \"-billing\" وينتهي بـ .invalid. قارنه بالعنوان المسجّل في سجلات الموردين لديك.") },
      { id: "change", suspicious: true, title: l("Request to change payment details", "طلب تغيير بيانات الدفع"), why: l("Changing bank details is a classic business email compromise move. Any change must be confirmed through a contact you already have on file.", "تغيير البيانات البنكية حيلة كلاسيكية في اختراق البريد التجاري. أي تغيير يجب تأكيده عبر جهة اتصال مسجّلة لديك مسبقًا.") },
      { id: "nocall", suspicious: true, title: l("\"Don't call\" blocks verification", "عبارة \"لا تتصل\" تمنع التحقق"), why: l("The one step that would expose the fraud, a phone call to a known number, is discouraged. Treat any instruction to avoid verification as a red flag.", "الخطوة الوحيدة التي قد تكشف الاحتيال، وهي الاتصال برقم معروف، يُنهى عنها. اعتبر أي تعليمات بتجنّب التحقق علامة تحذير.") },
      { id: "rush", suspicious: true, title: l("Same-day payment pressure", "ضغط للدفع في اليوم نفسه"), why: l("A same-day deadline leaves no time for normal approval and checks. That pressure is the point.", "المهلة في اليوم نفسه لا تترك وقتًا للموافقات والفحوص المعتادة. هذا الضغط هو الهدف.") },
      { id: "attachment", suspicious: false, title: l("PDF attachment", "مرفق PDF"), why: l("A PDF is a normal invoice format, so the file type is not the problem here. The request inside it is. Never use bank details from an unverified message.", "ملف PDF صيغة طبيعية للفواتير، لذا نوع الملف ليس المشكلة هنا. المشكلة في الطلب الذي بداخله. لا تعتمد بيانات بنكية من رسالة لم تتحقق منها.") },
      { id: "invoice", suspicious: false, title: l("Invoice number", "رقم الفاتورة"), why: l("A real-looking number is easy to include. It does not prove the message is genuine.", "من السهل إدراج رقم يبدو حقيقيًا. هذا لا يثبت أن الرسالة أصلية.") },
      { id: "subject", suspicious: false, title: l("Subject line", "سطر الموضوع"), why: l("Plain and businesslike. The warning signs are in the sender and the request.", "بسيط ومهني. علامات التحذير في المرسل وفي الطلب.") },
      { id: "date", suspicious: false, title: l("Date and time", "التاريخ والوقت"), why: l("Normal. Timing alone proves nothing.", "طبيعي. التوقيت وحده لا يثبت شيئًا.") },
      { id: "sig", suspicious: false, title: l("Signature block", "التوقيع"), why: l("Signatures are easy to copy from real emails, so they are weak evidence.", "التواقيع سهلة النسخ من رسائل حقيقية، لذلك هي دليل ضعيف.") },
    ],
  },
  {
    id: "payroll",
    title: l("Payroll statement", "كشف الراتب"),
    brief: l("An HR message with an attachment to open.", "رسالة موارد بشرية بمرفق يُطلب فتحه."),
    from: { name: l("HR Payroll", "الرواتب – الموارد البشرية"), addr: "hr-payroll@nile-logistics-hr.invalid", clue: "sender" },
    to: "you@nilelogistics.test",
    subject: { t: l("Your salary statement has changed", "تم تغيير كشف راتبك"), clue: "subject" },
    date: { t: l("Thu 08:05", "الخميس 08:05"), clue: "date" },
    body: [
      [{ t: l("Hi,", "مرحبًا،") }],
      [{ t: l("Your salary statement for this month was updated. Open the attached file and ", "تم تحديث كشف راتبك لهذا الشهر. افتح الملف المرفق و") }, { t: l("click \"Enable content\" to view it.", "انقر على \"تمكين المحتوى\" لعرضه."), clue: "enable" }],
      [{ t: l("Please review it before Friday.", "يرجى مراجعته قبل يوم الجمعة."), clue: "deadline" }],
    ],
    attachment: { name: "Salary_Statement.pdf.exe", clue: "attachment" },
    signature: { t: l("Human Resources", "الموارد البشرية"), clue: "sig" },
    clues: [
      { id: "sender", suspicious: true, title: l("Sender domain is not your company's", "نطاق المرسل ليس نطاق شركتك"), why: l("HR would write from nilelogistics.test. This address uses nile-logistics-hr.invalid.", "قسم الموارد البشرية يراسلك من nilelogistics.test. هذا العنوان يستخدم nile-logistics-hr.invalid.") },
      { id: "attachment", suspicious: true, title: l("Double file extension", "امتداد ملف مزدوج"), why: l("\"Salary_Statement.pdf.exe\" pretends to be a PDF but is a program. Attackers add a familiar extension to hide the real one.", "الملف \"Salary_Statement.pdf.exe\" يتظاهر بأنه PDF لكنه برنامج. يضيف المهاجمون امتدادًا مألوفًا لإخفاء الامتداد الحقيقي.") },
      { id: "enable", suspicious: true, title: l("Asks you to enable content", "يطلب منك تمكين المحتوى"), why: l("Documents that need you to \"enable content\" to be readable are a common way to run malware. A normal statement doesn't need it.", "المستندات التي تتطلب \"تمكين المحتوى\" لتصبح مقروءة طريقة شائعة لتشغيل البرمجيات الخبيثة. الكشف العادي لا يحتاج ذلك.") },
      { id: "deadline", suspicious: false, title: l("Friday deadline", "مهلة حتى الجمعة"), why: l("A deadline alone is not proof. HR does set deadlines, so judge it together with the sender and the attachment.", "المهلة وحدها ليست دليلًا. الموارد البشرية تضع مواعيد أحيانًا، لذا قيّمها مع المرسل والمرفق.") },
      { id: "subject", suspicious: false, title: l("Subject line", "سطر الموضوع"), why: l("Curiosity is the bait, but the wording is not a technical warning sign.", "الفضول هو الطُّعم، لكن الصياغة ليست علامة تقنية للتحذير.") },
      { id: "date", suspicious: false, title: l("Date and time", "التاريخ والوقت"), why: l("Normal. Timing alone proves nothing.", "طبيعي. التوقيت وحده لا يثبت شيئًا.") },
      { id: "sig", suspicious: false, title: l("Signature", "التوقيع"), why: l("Easy to copy. Not evidence either way.", "سهل النسخ. ليس دليلًا في أي اتجاه.") },
    ],
  },
];
