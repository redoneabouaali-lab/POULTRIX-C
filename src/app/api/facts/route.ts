import { NextResponse } from "next/server";

const FACTS = [
  { text: "الدجاج هو أكثر الطيور انتشاراً في العالم، حيث يبلغ تعداده أكثر من 23 مليار دجاجة.", source: "FAO", date: "2024" },
  { text: "يمكن للدجاجة أن تضع حوالي 300 بيضة سنوياً في ظروف مناسبة.", source: "Poultry Science", date: "2024" },
  { text: "الدجاج قادر على التعرف على أكثر من 100 وجه مختلف، بما في ذلك وجوه البشر.", source: "Animal Cognition", date: "2024" },
  { text: "تتواصل الدجاجات مع فراخها وهي لا تزال داخل البيض عن طريق أصوات نقر خفيفة.", source: "Applied Animal Behaviour", date: "2024" },
  { text: "يمتلك الدجاك رؤية ليلية أفضل من البشر بفضل كثافة عالية من الخلايا العصوية في شبكية العين.", source: "Vision Research", date: "2024" },
  { text: "يمكن للدجاج الركض بسرعة تصل إلى 14 كيلومتراً في الساعة.", source: "Journal of Experimental Biology", date: "2024" },
  { text: "الدجاج من نسل دجاج الأدغال الأحمر الذي لا يزال يعيش برياً في جنوب شرق آسيا.", source: "Nature Genetics", date: "2024" },
  { text: "درجة حرارة جسم الدجاجة الطبيعية تتراوح بين 40.6 و 41.7 درجة مئوية.", source: "Merck Veterinary Manual", date: "2024" },
  { text: "لون بيض الدجاج يحدده جينات الدجاجة وليس جودة البيض أو قيمته الغذائية.", source: "Poultry Science", date: "2024" },
  { text: "تمتلك الدجاجات ذاكرة ممتازة ويمكنها تذكر مسارات التعلم لأكثر من شهر.", source: "Behavioural Processes", date: "2024" },
  { text: "يبلغ متوسط عمر الدجاجة في المزارع التجارية حوالي 5-7 أسابيع للحم ولحم و2-3 سنوات للبيض.", source: "USDA", date: "2024" },
  { text: "لحم الدجاج غني بالبروتين وقليل الدهون، مما يجعله خياراً صحياً في التغذية.", source: "Nutrition Journal", date: "2024" },
  { text: "تستخدم الدجاجات أكثر من 30 نغمة مختلفة للتواصل مع بعضها البعض.", source: "Animal Behaviour", date: "2024" },
  { text: "يمكن للدجاجة أن تدير رأسها 180 درجة بفضل وجود 14 فقرة عنقية.", source: "Veterinary Anatomy", date: "2024" },
  { text: "لون صفار البيض يعتمد على نوع الغذاء الذي تأكله الدجاجة وليس على جودة البيض.", source: "Journal of Food Science", date: "2024" },
];

export async function GET() {
  return NextResponse.json(FACTS, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" },
  });
}
