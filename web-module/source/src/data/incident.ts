import { l, L } from "../i18n";
export interface Step { id: string; text: L; src?: string }
export interface Situation { id: string; title: L; steps: Step[] }
/** Shown to learners. Put your real IT security phone/email in ORG_CONTACT_DETAILS (leave empty to hide). */
export const ORG_CONTACT = l("Not sure who that is? Ask your manager.", "لست متأكدًا من هو؟ اسأل مديرك.");
export const ORG_CONTACT_DETAILS = l("", "");
export const SITUATIONS: Situation[] = [
  { id: "clicked", title: l("I clicked a link", "نقرت على رابط"), steps: [
    { id: "c1", text: l("Close the page. Don't type anything into it.", "أغلق الصفحة. لا تكتب أي شيء فيها.") },
    { id: "c2", text: l("Tell your IT or security team right away. Don't wait to see what happens.", "أبلغ فريق تقنية المعلومات أو الأمن فورًا. لا تنتظر لترى ما يحدث.") },
    { id: "c3", text: l("Update your security software and run a scan.", "حدّث برنامج الحماية لديك وأجرِ فحصًا للجهاز."), src: "FTC" },
    { id: "c4", text: l("Watch your accounts for anything unusual and report it.", "راقب حساباتك بحثًا عن أي نشاط غير معتاد وأبلغ عنه.") } ] },
  { id: "attachment", title: l("I opened an attachment", "فتحت مرفقًا"), steps: [
    { id: "a1", text: l("Tell IT or security immediately. Say which file you opened.", "أبلغ تقنية المعلومات أو الأمن فورًا واذكر الملف الذي فتحته.") },
    { id: "a2", text: l("Don't open more files from that message. Let IT decide whether to isolate the device.", "لا تفتح مزيدًا من الملفات من تلك الرسالة. اترك لفريق تقنية المعلومات قرار عزل الجهاز."), src: "CISA" },
    { id: "a3", text: l("Update your security software and run a scan.", "حدّث برنامج الحماية لديك وأجرِ فحصًا للجهاز."), src: "FTC" } ] },
  { id: "password", title: l("I entered my password", "أدخلت كلمة المرور"), steps: [
    { id: "p1", text: l("Tell IT or security immediately. Name the account and the site.", "أبلغ تقنية المعلومات أو الأمن فورًا واذكر الحساب والموقع.") },
    { id: "p2", text: l("IT should audit access to the affected account.", "ينبغي أن يراجع فريق تقنية المعلومات الوصول إلى الحساب المتأثر."), src: "CISA" },
    { id: "p3", text: l("Change the password as IT directs, including anywhere you reused it.", "غيّر كلمة المرور حسب توجيه فريق تقنية المعلومات، ويشمل ذلك أي مكان أعدت استخدامها فيه.") },
    { id: "p4", text: l("Turn on two-factor authentication for the account.", "فعّل المصادقة الثنائية للحساب."), src: "FTC" } ] },
  { id: "paid", title: l("I paid or shared bank details", "دفعت أو شاركت بيانات بنكية"), steps: [
    { id: "m1", text: l("Contact your bank or financial institution right away. Speed improves the chance of recovery.", "اتصل ببنكك أو مؤسستك المالية فورًا. السرعة تزيد فرصة الاسترداد.") },
    { id: "m2", text: l("Tell your manager and IT or security.", "أبلغ مديرك وفريق تقنية المعلومات أو الأمن.") },
    { id: "m3", text: l("File a report with the authorities. In the U.S. that is the FBI's IC3 (bec.ic3.gov for business email compromise) and the FTC. Elsewhere, use your country's equivalent.", "قدّم بلاغًا للجهات المختصة. في الولايات المتحدة هي IC3 التابع لمكتب التحقيقات الفيدرالي ولجنة التجارة الفيدرالية. وفي غيرها استخدم الجهة المماثلة في بلدك."), src: "FBI, FTC" } ] },
];
