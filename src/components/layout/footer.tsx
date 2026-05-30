import { COLORS } from "@/constants";
import { Cpu, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const aboutLinks = [
  { text: "عن المنصة", href: "#" },
  { text: "الميزات", href: "#services" },
  { text: "المدونة", href: "/dashboard/articles" },
  { text: "وظائف", href: "#" },
];

const serviceLinks = [
  { text: "لوحة القيادة", href: "/dashboard" },
  { text: "تحليلات", href: "/dashboard/analytics" },
  { text: "المالية", href: "/dashboard/finance" },
  { text: "سلالات الدجاج", href: "/dashboard/breeds" },
];

const helpLinks = [
  { text: "الأسئلة الشائعة", href: "#" },
  { text: "الدعم الفني", href: "#" },
  { text: "الشروط والأحكام", href: "#" },
  { text: "سياسة الخصوصية", href: "#" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#F0EDE5", borderTop: "1px solid rgba(0,0,0,0.04)" }} dir="rtl">
      <div className="mx-auto max-w-[1320px] px-4 pt-16 pb-6 sm:px-6 lg:pt-24">
        {/* Two-column layout matching colabs pattern */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* Column 1: Brand, description, social links */}
          <div className="w-full lg:w-[55%]">
            <div className="flex items-center gap-2.5">
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Cpu size={15} style={{ color: "#1E2B22" }} />
              </div>
              <span className="text-xl font-bold font-brand" style={{ color: "#1E2B22", letterSpacing: "-0.02em" }}>POULTRIX</span>
            </div>

            <p className="mt-5 max-w-md leading-relaxed text-sm" style={{ color: "#5A6A5A" }}>
              أول منصة ذكاء اصطناعي لتدبير ضيعات الدواجن في المغرب. مراقبة حية، توقعات دقيقة، وتدبير تلقائي.
            </p>

            <ul className="mt-8 flex gap-5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <li key={label}>
                  <a href={href} className="spring-hover block" style={{ color: "#7A8A7A" }}>
                    <span className="sr-only">{label}</span>
                    <Icon size={20} />
                  </a>
                </li>
              ))}
            </ul>

            {/* Nav links in a row */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div>
                <p className="font-semibold mb-3" style={{ color: "#1E2B22", fontSize: "0.8rem" }}>عن POULTRIX</p>
                <ul className="space-y-2.5">
                  {aboutLinks.map(({ text, href }) => (
                    <li key={text}>
                      <a href={href} className="spring-transition hover:opacity-70" style={{ color: "#5A6A5A" }}>{text}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-3" style={{ color: "#1E2B22", fontSize: "0.8rem" }}>خدماتنا</p>
                <ul className="space-y-2.5">
                  {serviceLinks.map(({ text, href }) => (
                    <li key={text}>
                      <a href={href} className="spring-transition hover:opacity-70" style={{ color: "#5A6A5A" }}>{text}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-3" style={{ color: "#1E2B22", fontSize: "0.8rem" }}>روابط مفيدة</p>
                <ul className="space-y-2.5">
                  {helpLinks.map(({ text, href }) => (
                    <li key={text}>
                      <a href={href} className="spring-transition hover:opacity-70" style={{ color: "#5A6A5A" }}>{text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Column 2: Contact info */}
          <div className="w-full lg:w-[45%] lg:text-left">
            <p className="font-semibold mb-6 text-sm" style={{ color: "#1E2B22" }}>اتصل بنا</p>
            <ul className="space-y-4 text-sm">
              <li>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.aqua}10` }}>
                    <Mail size={15} style={{ color: COLORS.aqua }} />
                  </div>
                  <span style={{ color: "#5A6A5A" }}>contact@abouaaliahmed.com</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.aqua}10` }}>
                    <Phone size={15} style={{ color: COLORS.aqua }} />
                  </div>
                  <span style={{ color: "#5A6A5A" }}>+212606510599</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.aqua}10` }}>
                    <MapPin size={15} style={{ color: COLORS.aqua }} />
                  </div>
                  <span style={{ color: "#5A6A5A" }}>الدار البيضاء، المغرب</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm" style={{ color: "#7A8A7A" }}>
            <p>&copy; 2026 POULTRIX. جميع الحقوق محفوظة.</p>
            <p>بالذكاء الاصطناعي — مراقبة حية — دقة مطلقة</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
