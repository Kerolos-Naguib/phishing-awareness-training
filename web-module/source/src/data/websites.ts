import { l, L } from "../i18n";

/** Fictional bank "Delta Trust". Real domain: deltatrust.test. All lookalikes use .test / .invalid. */
export interface Round {
  id: string;
  context: L;
  segments: string[];           // address broken into tappable parts
  culprit: number | null;       // index of the suspicious part, or null when the address is genuine
  title: L;
  explain: L;
}
export const KNOWN_DOMAIN = "deltatrust.test";

export const ROUNDS: Round[] = [
  {
    id: "subdomain",
    context: l("A text says: \"Delta Trust: new sign-in detected. Review it here.\"", "رسالة نصية: \"دلتا ترست: تم رصد تسجيل دخول جديد. راجعه هنا.\""),
    segments: ["https://", "deltatrust.test", ".account-verify.invalid", "/login"], culprit: 2,
    title: l("The real domain is at the end", "النطاق الحقيقي في نهاية العنوان"),
    explain: l("Read the host from right to left, up to the first single slash. The registered domain here is account-verify.invalid. The familiar deltatrust.test is only a prefix that the attacker placed in front.", "اقرأ اسم المضيف من اليمين إلى اليسار حتى أول شرطة مائلة منفردة. النطاق المسجّل هنا هو account-verify.invalid. أما deltatrust.test المألوف فهو مجرد بادئة وضعها المهاجم في المقدمة."),
  },
  {
    id: "genuine",
    context: l("You typed the address from your bookmarks to sign in to Delta Trust.", "كتبت العنوان من الإشارات المرجعية لتسجيل الدخول إلى دلتا ترست."),
    segments: ["https://", "deltatrust.test", "/login"], culprit: null,
    title: l("This address matches", "هذا العنوان مطابق"),
    explain: l("The domain is exactly deltatrust.test, the one you already know. Not every address is a trap, and checking is what lets you proceed with confidence.", "النطاق هو deltatrust.test تمامًا، وهو الذي تعرفه مسبقًا. ليس كل عنوان فخًّا، والتحقق هو ما يتيح لك المتابعة بثقة."),
  },
  {
    id: "typo",
    context: l("An email says your card is locked and gives a link.", "رسالة بريد تقول إن بطاقتك مقفلة وتتضمن رابطًا."),
    segments: ["https://", "de1tatrust", ".test", "/login"], culprit: 1,
    title: l("One character swapped", "حرف واحد مُستبدَل"),
    explain: l("\"de1tatrust\" uses the digit 1 instead of the letter l. It is a different domain that merely looks the same at a glance. Slow down and read every character.", "العنوان \"de1tatrust\" يستخدم الرقم 1 بدل حرف l. هو نطاق مختلف يبدو مطابقًا لمن يمر عليه سريعًا. تمهّل واقرأ كل حرف."),
  },
  {
    id: "extra-word",
    context: l("A chat message offers \"help\" resetting your password.", "رسالة محادثة تعرض \"مساعدتك\" في إعادة تعيين كلمة المرور."),
    segments: ["https://", "deltatrust-support", ".test", "/reset-password"], culprit: 1,
    title: l("An extra word makes a new domain", "كلمة إضافية تصنع نطاقًا جديدًا"),
    explain: l("The bank's domain is deltatrust.test. Adding \"-support\" creates a different name that anyone could register. Only the exact known domain counts.", "نطاق البنك هو deltatrust.test. إضافة \"-support\" تصنع اسمًا مختلفًا يمكن لأي شخص تسجيله. المعتمد هو النطاق المعروف تمامًا فقط."),
  },
  {
    id: "at-sign",
    context: l("A pop-up on a shopping site says you've won a refund from Delta Trust.", "نافذة منبثقة في موقع تسوق تقول إنك ربحت استردادًا من دلتا ترست."),
    segments: ["https://", "deltatrust.test@", "secure-check.invalid", "/login"], culprit: 2,
    title: l("Everything before @ is ignored", "كل ما قبل @ يُتجاهل"),
    explain: l("In an address, text before an @ sign is treated as a username, not the destination. The browser would actually go to secure-check.invalid.", "في العنوان، يُعامَل النص الذي يسبق علامة @ كاسم مستخدم وليس وجهة. المتصفح سيذهب فعليًا إلى secure-check.invalid."),
  },
];
