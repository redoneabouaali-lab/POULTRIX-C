"use client";

import { AnimatedNotification } from "@/components/lightswind/animated-notification";

const dummyMessages = [
  "🚀 عبد الرحمان سجل للتو في المنصة",
  "✅ مزرعة الدار البيضاء ربطت الحساسات",
  "📊 توقعات جديدة: نسبة النفوق 2.3% فقط",
  "🔔 تنبيه: درجة الحرارة منخفضة في الحظيرة 3",
  "💰 المزرعة الفلاحية حققت +34% أرباح هذا الشهر",
  "🐔 تحليل جديد للسلالات متوفر",
  "⚡ تحديث: تم اكتشاف 3 حالات مبكرة",
  "📈 مؤشرات ضيعة سوس: أداء ممتاز",
];

export default function SocialProofSection() {
  return (
    <div className="fixed top-24 right-4 z-50 hidden lg:block">
      <AnimatedNotification
        maxNotifications={3}
        autoInterval={6000}
        autoGenerate={true}
        position="top-right"
        width={320}
        showAvatars={false}
        showTimestamps={false}
        customMessages={dummyMessages}
        animationDuration={0.4}
      />
    </div>
  );
}