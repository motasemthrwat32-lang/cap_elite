# Generator for sports_data.js
$outputPath = "C:\Users\M03TSM\.gemini\antigravity\scratch\sports_data.js"

$header = @'
/* ==========================================================================
   CAP ELITE — قاعدة بيانات الرياضات والتمارين الشاملة والمساعد الذكي AI
   تضمين 18 رياضة بتمارينها المتخصصة وشرحها الكامل ورسوم الوضعيات والمساعد الذكي
   ========================================================================== */
"use strict";

(function(window) {
  // مولد صور وضعيات التمارين كـ SVG Data URI عالية الدقة بدون أي تعتيم للـ Canvas
  function makePostureSvg(sportName, exName, phaseNum, phaseDesc, motionPath) {
    const isP1 = (phaseNum === 1);
    const badgeColor = isP1 ? "#e0b83f" : "#22c55e";
    const phaseTitle = isP1 ? "وضعية 1: البداية والتمركز" : "وضعية 2: التنفيذ والإنهاء";
    
    // عناصر الحركة والأشكال الرياضية المتجهة
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 380" width="500" height="380">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#f8fafc"/>
        </linearGradient>
        <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0b83f"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/>
        </filter>
      </defs>
      <!-- خلفية بيضاء نقية -->
      <rect width="100%" height="100%" fill="url(#bg)" rx="16"/>
      <rect x="12" y="12" width="476" height="356" fill="none" stroke="#e2e8f0" stroke-width="2" rx="12"/>
      
      <!-- شريط علوي بعنوان الرياضة والتمرين -->
      <rect x="24" y="24" width="452" height="42" fill="#0f172a" rx="8"/>
      <text x="250" y="49" font-family="Cairo, Arial" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" direction="rtl">
        ${sportName} • ${exName}
      </text>

      <!-- أرضية أو مسار التمرين -->
      <line x1="60" y1="280" x2="440" y2="280" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="6 4"/>
      
      <!-- رسم تعبيري للرياضي حسب الوضعية -->
      <g filter="url(#shadow)">
        ${motionPath}
      </g>

      <!-- سهم اتجاه الحركة -->
      ${isP1 ? `
        <g transform="translate(340, 150)">
          <path d="M0,40 Q30,10 60,30" fill="none" stroke="#e0b83f" stroke-width="4" stroke-linecap="round"/>
          <polygon points="60,24 66,36 52,34" fill="#e0b83f"/>
          <text x="30" y="60" font-family="Cairo, Arial" font-size="11" font-weight="bold" fill="#b45309" text-anchor="middle">مسار الحركة</text>
        </g>
      ` : `
        <g transform="translate(350, 140)">
          <circle cx="20" cy="20" r="18" fill="rgba(34, 197, 94, 0.15)"/>
          <path d="M12,20 L18,26 L28,14" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/>
          <text x="20" y="52" font-family="Cairo, Arial" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">الوصول للهدف</text>
        </g>
      `}

      <!-- بطاقة وصف المرحلة بالأسفل -->
      <rect x="36" y="300" width="428" height="48" fill="#1e293b" rx="10"/>
      <rect x="42" y="306" width="130" height="36" fill="${badgeColor}" rx="8"/>
      <text x="107" y="329" font-family="Cairo, Arial" font-size="12" font-weight="900" fill="#0f172a" text-anchor="middle" direction="rtl">
        ${phaseTitle}
      </text>
      <text x="310" y="330" font-family="Cairo, Arial" font-size="13" font-weight="bold" fill="#f8fafc" text-anchor="middle" direction="rtl">
        ${phaseDesc}
      </text>
    </svg>`;
    
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  // قوالب حركية فكتور للمراحل
  const P_SHAPES = {
    // سباحة
    swim_p1: `<g fill="#0284c7">
      <ellipse cx="250" cy="180" rx="90" ry="24" transform="rotate(-5 250 180)"/>
      <circle cx="160" cy="175" r="18"/>
      <path d="M170,175 L210,130 L280,120" stroke="#0284c7" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M330,185 L390,200 L410,215" stroke="#0284c7" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M100,220 Q200,240 300,210 T500,230" stroke="#38bdf8" stroke-width="4" fill="none" opacity="0.6"/>
    </g>`,
    swim_p2: `<g fill="#0369a1">
      <ellipse cx="250" cy="180" rx="90" ry="24" transform="rotate(5 250 180)"/>
      <circle cx="340" cy="175" r="18"/>
      <path d="M330,175 L280,225 L210,215" stroke="#0369a1" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M170,185 L110,170 L90,160" stroke="#0369a1" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M100,220 Q200,240 300,210 T500,230" stroke="#38bdf8" stroke-width="4" fill="none" opacity="0.6"/>
    </g>`,

    // قتال وضرب (كيك بوكسينج / ملاكمة / تايكوندو / كاراتيه)
    fight_p1: `<g fill="#0f172a">
      <circle cx="210" cy="110" r="18"/>
      <path d="M210,128 L205,195 L180,265 L170,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M205,195 L235,260 L245,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M210,140 L235,145 L245,130" stroke="#e0b83f" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M210,140 L185,150 L180,135" stroke="#e0b83f" stroke-width="14" stroke-linecap="round" fill="none"/>
    </g>`,
    fight_p2: `<g fill="#0f172a">
      <circle cx="215" cy="115" r="18"/>
      <path d="M215,133 L210,195 L175,265 L165,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M210,195 L275,170 L345,160" stroke="#0f172a" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <path d="M215,140 L285,135 L335,135" stroke="#e0b83f" stroke-width="14" stroke-linecap="round" fill="none"/>
      <circle cx="340" cy="135" r="14" fill="#ef4444"/>
    </g>`,

    // كرة قدم وتنس وسلة (جري وركل ورمي)
    ball_p1: `<g fill="#0f172a">
      <circle cx="220" cy="110" r="18"/>
      <path d="M220,128 L215,190 L195,255 L190,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M215,190 L245,245 L270,270" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M220,140 L185,165" stroke="#0f172a" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="300" cy="270" r="18" fill="#e0b83f" stroke="#0f172a" stroke-width="3"/>
    </g>`,
    ball_p2: `<g fill="#0f172a">
      <circle cx="230" cy="115" r="18"/>
      <path d="M230,133 L215,190 L200,265 L195,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M215,190 L280,210 L335,230" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M230,140 L285,140" stroke="#0f172a" stroke-width="12" stroke-linecap="round" fill="none"/>
      <circle cx="380" cy="190" r="18" fill="#e0b83f" stroke="#0f172a" stroke-width="3"/>
      <line x1="330" y1="230" x2="370" y2="195" stroke="#22c55e" stroke-width="4" stroke-dasharray="4 2"/>
    </g>`,

    // رفع أثقال وقوة
    lift_p1: `<g fill="#0f172a">
      <circle cx="250" cy="120" r="18"/>
      <path d="M250,138 L250,210 L210,255 L210,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M250,210 L290,255 L290,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M250,155 L210,195 L200,245" stroke="#0f172a" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M250,155 L290,195 L300,245" stroke="#0f172a" stroke-width="14" stroke-linecap="round" fill="none"/>
      <!-- بار سفلي -->
      <line x1="120" y1="245" x2="380" y2="245" stroke="#475569" stroke-width="8" stroke-linecap="round"/>
      <rect x="130" y="215" width="20" height="60" rx="4" fill="#e0b83f"/>
      <rect x="350" y="215" width="20" height="60" rx="4" fill="#e0b83f"/>
    </g>`,
    lift_p2: `<g fill="#0f172a">
      <circle cx="250" cy="140" r="18"/>
      <path d="M250,158 L250,225 L215,260 L215,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M250,225 L285,260 L285,280" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M250,165 L225,120 L220,80" stroke="#0f172a" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M250,165 L275,120 L280,80" stroke="#0f172a" stroke-width="14" stroke-linecap="round" fill="none"/>
      <!-- بار علوي مرفوع -->
      <line x1="120" y1="80" x2="380" y2="80" stroke="#475569" stroke-width="8" stroke-linecap="round"/>
      <rect x="130" y="50" width="20" height="60" rx="4" fill="#22c55e"/>
      <rect x="350" y="50" width="20" height="60" rx="4" fill="#22c55e"/>
    </g>`,

    // جري ومضمار ووثب
    run_p1: `<g fill="#0f172a">
      <circle cx="220" cy="115" r="18"/>
      <path d="M220,133 L205,190 L160,240 L140,245" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M205,190 L245,240 L280,275" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M220,145 L255,170 L275,195" stroke="#0f172a" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M220,145 L175,155 L155,135" stroke="#0f172a" stroke-width="14" stroke-linecap="round" fill="none"/>
    </g>`,
    run_p2: `<g fill="#0f172a">
      <circle cx="270" cy="110" r="18"/>
      <path d="M270,128 L255,185 L310,210 L330,265" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M255,185 L200,225 L165,240" stroke="#0f172a" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M270,140 L315,150 L330,130" stroke="#0f172a" stroke-width="14" stroke-linecap="round" fill="none"/>
      <path d="M270,140 L220,165 L200,195" stroke="#0f172a" stroke-width="14" stroke-linecap="round" fill="none"/>
    </g>`
  };

  // دالة مساعدة لإنشاء صور وضعيات التمرين
  function imgs(sp, title, d1, d2, shapeKey) {
    const s1 = shapeKey + "_p1";
    const s2 = shapeKey + "_p2";
    return [
      makePostureSvg(sp, title, 1, d1, P_SHAPES[s1] || P_SHAPES.fight_p1),
      makePostureSvg(sp, title, 2, d2, P_SHAPES[s2] || P_SHAPES.fight_p2)
    ];
  }
'@

Write-Output "Header length: $($header.Length)"
