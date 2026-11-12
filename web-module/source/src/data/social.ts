import { l, L } from "../i18n";

export interface Option { text: L; severity: "safe" | "partial" | "unsafe"; points: 0 | 1 | 2; outcome: L; lesson: L }
export interface Beat { who: L; say: L; kind?: "sms" | "call" | "chat" }
export interface Scenario { id: string; title: L; channel: L; beats: Beat[]; question: L; options: Option[]; realCase?: boolean }

export const SCENARIOS: Scenario[] = [
  {
    id: "call",
    title: l("The helpful IT caller", "المتصل \"المساعد\" من تقنية المعلومات"),
    channel: l("Phone call", "مكالمة هاتفية"),
    beats: [
      { kind: "call", who: l("Caller", "المتصل"), say: l("Hi, this is IT security. We've detected a sign-in to your account from another country.", "مرحبًا، معك أمن المعلومات. رصدنا تسجيل دخول إلى حسابك من دولة أخرى.") },
      { kind: "call", who: l("Caller", "المتصل"), say: l("To block it, I need the 6-digit code we just sent to your phone. Quickly, please, it expires in a minute.", "لإيقافه أحتاج رمز التحقق المكوّن من 6 أرقام الذي أرسلناه لهاتفك الآن. بسرعة من فضلك، ينتهي خلال دقيقة.") },
      { kind: "sms", who: l("Text message", "رسالة نصية"), say: l("Your verification code is 482 915. Never share it.", "رمز التحقق الخاص بك هو 482 915. لا تشاركه مع أحد.") },
    ],
    question: l("What do you do?", "ماذا تفعل؟"),
    options: [
      { text: l("Read the code out loud to stop the attack", "أقرأ الرمز بصوت عالٍ لإيقاف الهجوم"), severity: "unsafe", points: 0,
        outcome: l("The code was triggered by the caller's own sign-in attempt. By reading it out, you complete their login. They now have access to your account.", "الرمز نتج عن محاولة الدخول التي أجراها المتصل نفسه. بقراءته تُكمل عملية دخوله، ويصبح لديه وصول إلى حسابك."),
        lesson: l("A verification code proves it's you. Never read one to anyone, even someone who sounds official.", "رمز التحقق يثبت أنك أنت. لا تقرأه لأي شخص، حتى لو بدا رسميًا.") },
      { text: l("Ask the caller to email you proof first", "أطلب من المتصل إرسال إثبات بالبريد أولًا"), severity: "partial", points: 1,
        outcome: l("Better, because you didn't share the code. But email proof can be forged, and you are still dealing on the attacker's terms.", "أفضل لأنك لم تشارك الرمز. لكن الإثبات عبر البريد يمكن تزويره، وما زلت تتعامل بشروط المهاجم."),
        lesson: l("Don't verify someone using a channel they control. End the call and use one you trust.", "لا تتحقق من شخص عبر قناة يتحكم بها. أنهِ المكالمة واستخدم قناة تثق بها.") },
      { text: l("Hang up, call IT on the number in the staff directory, and report it", "أنهي المكالمة وأتصل بالدعم الفني على الرقم الموجود في دليل الموظفين وأبلّغ"), severity: "safe", points: 2,
        outcome: l("IT confirms they didn't call. They lock the targeted sign-in attempt and warn colleagues. You stopped the attack at the first step.", "يؤكد الدعم الفني أنه لم يتصل. يوقف محاولة الدخول ويحذّر الزملاء. أوقفت الهجوم من الخطوة الأولى."),
        lesson: l("Stop, verify through a channel you know, then report. It works for calls too.", "توقّف، وتحقّق عبر قناة تعرفها، ثم أبلِغ. وهذا ينطبق على المكالمات أيضًا.") },
    ],
  },
  {
    id: "sms",
    title: l("The parcel fee text", "رسالة رسوم الطرد"),
    channel: l("Text message", "رسالة نصية"),
    beats: [
      { kind: "sms", who: l("Delta Post", "دلتا بوست"), say: l("Your parcel is on hold. Pay a small fee within 12 hours to release it: https://delta-post-fee.invalid/r/8Hq2", "طردك معلّق. ادفع رسومًا بسيطة خلال 12 ساعة للإفراج عنه: https://delta-post-fee.invalid/r/8Hq2") },
    ],
    question: l("You are not sure you're expecting a parcel. What do you do?", "لست متأكدًا إن كنت تنتظر طردًا. ماذا تفعل؟"),
    options: [
      { text: l("Tap the link just to look", "أنقر على الرابط لأرى فقط"), severity: "unsafe", points: 0,
        outcome: l("The page asks for a card number to pay the \"fee\". Even if you stop there, the click can confirm your number is active and may load a harmful page.", "الصفحة تطلب رقم بطاقة لدفع \"الرسوم\". حتى لو توقفت هناك، قد تؤكد النقرة أن رقمك فعّال وقد تحمّل صفحة ضارة."),
        lesson: l("Unexpected links are not safe to \"just look at\".", "الروابط غير المتوقعة ليست آمنة \"للاطلاع فقط\".") },
      { text: l("Reply STOP to the sender", "أرد برسالة STOP"), severity: "partial", points: 1,
        outcome: l("This doesn't verify anything, and replying can tell the sender that your number is in use. You avoided the link, though.", "هذا لا يتحقق من شيء، وقد يخبر الرد المرسل أن رقمك مستخدم. لكنك تجنبت الرابط."),
        lesson: l("Don't engage with suspicious senders. Check independently instead.", "لا تتفاعل مع مرسل مشبوه. تحقق بشكل مستقل بدلًا من ذلك.") },
      { text: l("Ignore the link, check the courier's official app or website, then report the text", "أتجاهل الرابط وأتحقق من تطبيق شركة الشحن أو موقعها الرسمي ثم أبلّغ عن الرسالة"), severity: "safe", points: 2,
        outcome: l("The official app shows no held parcel. You delete the text and report it, which helps protect others.", "التطبيق الرسمي لا يُظهر أي طرد معلّق. تحذف الرسالة وتبلّغ عنها، مما يحمي الآخرين."),
        lesson: l("Use contact details you know are real, never the ones in the message.", "استخدم وسائل اتصال تعرف أنها حقيقية، وليس تلك الواردة في الرسالة.") },
    ],
  },
  {
    id: "director",
    title: l("The urgent request from the \"director\"", "الطلب العاجل من \"المدير\""),
    channel: l("Chat message", "رسالة محادثة"),
    realCase: true,
    beats: [
      { kind: "chat", who: l("Director (new number)", "المدير (رقم جديد)"), say: l("I'm in a meeting and can't talk. I need you to pay a supplier invoice today. Details attached.", "أنا في اجتماع ولا أستطيع الحديث. أحتاج منك دفع فاتورة مورّد اليوم. التفاصيل مرفقة.") },
      { kind: "chat", who: l("Director (new number)", "المدير (رقم جديد)"), say: l("Keep this between us until I'm out. Let me know as soon as it's done.", "أبقِ الأمر بيننا حتى أنتهي. أخبرني فور الانتهاء.") },
    ],
    question: l("You have payment authority. What do you do?", "لديك صلاحية الدفع. ماذا تفعل؟"),
    options: [
      { text: l("Pay it. You don't want to delay the director", "أدفع. لا أريد تأخير المدير"), severity: "unsafe", points: 0,
        outcome: l("The money goes to an account controlled by the attacker, and it is very hard to recover once sent.", "تذهب الأموال إلى حساب يسيطر عليه المهاجم، ومن الصعب جدًا استردادها بعد إرسالها."),
        lesson: l("Secrecy plus urgency is a classic pressure combination. Authority is exactly what attackers impersonate.", "السرية مع الاستعجال تركيبة ضغط كلاسيكية. والسلطة هي ما ينتحله المهاجمون تحديدًا.") },
      { text: l("Reply in the chat asking for more details", "أرد في المحادثة وأطلب مزيدًا من التفاصيل"), severity: "partial", points: 1,
        outcome: l("The attacker answers convincingly, because they control the conversation. You've gained nothing.", "يجيب المهاجم بإقناع لأنه يتحكم بالمحادثة. لم تكسب شيئًا."),
        lesson: l("Questions asked inside the attacker's channel can't verify the attacker.", "الأسئلة داخل قناة المهاجم لا تتحقق من هوية المهاجم.") },
      { text: l("Verify using the director's known number, follow dual approval, and report the message", "أتحقق عبر رقم المدير المعروف، وأتبع الموافقة المزدوجة، وأبلّغ عن الرسالة"), severity: "safe", points: 2,
        outcome: l("The real director knows nothing about it. The payment is never made and the number is blocked.", "المدير الحقيقي لا يعلم بالأمر. لا تُنفَّذ الدفعة ويُحظر الرقم."),
        lesson: l("Verification through a known channel and a second approver beat any urgent story.", "التحقق عبر قناة معروفة وموافقة شخص ثانٍ يتغلبان على أي قصة عاجلة.") },
    ],
  },
];

export const REAL_CASE = {
  title: l("Real case: a $120 million invoice scam", "قضية حقيقية: احتيال فواتير بأكثر من 120 مليون دولار"),
  body: l("From 2013 to 2015, a fraudster set up a company with the same name as a real hardware supplier and sent phishing emails that appeared to come from it. Two U.S. technology companies wired more than $120 million to accounts he controlled. He was sentenced to 60 months in prison, per the U.S. Department of Justice (SDNY). The DOJ release does not name the victims; CyberScoop reported that a Lithuanian court order identified them as Facebook and Google.",
    "من 2013 إلى 2015 أنشأ محتال شركة تحمل الاسم نفسه لمورّد حقيقي لعتاد الحاسوب وأرسل رسائل تصيّد تبدو صادرة عنه. حوّلت شركتان تقنيتان أمريكيتان أكثر من 120 مليون دولار إلى حسابات يسيطر عليها. حُكم عليه بالسجن 60 شهرًا بحسب وزارة العدل الأمريكية (المنطقة الجنوبية لنيويورك). بيان الوزارة لا يذكر أسماء الضحايا؛ وذكرت CyberScoop أن أمرًا قضائيًا ليتوانيًا حدّدهما بأنهما فيسبوك وغوغل."),
};
