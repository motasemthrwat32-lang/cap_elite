# Script to build sports_data.js with complete exercise database without images for all 17 non-gym sports
$outPath = "C:\Users\M03TSM\.gemini\antigravity\scratch\sports_data.js"

$sb = [System.Text.StringBuilder]::new()

[void]$sb.AppendLine(@"
/* ==========================================================================
   CAP ELITE — قاعدة بيانات الرياضات والتمارين الشاملة والمساعد الذكي AI
   تضمين 18 تخصصاً رياضياً بتمارينها المتخصصة والشاملة لجميع الأقسام
   ========================================================================== */
"use strict";

(function(window) {
  // 1. تكوين الرياضات الـ 18 المعتمدة
  const SPORTS_CONFIG = {
    gym: { id: "gym", name: "جيم ولياقة بدنية", icon: "fa-dumbbell", color: "#e0b83f" },
    swimming: { id: "swimming", name: "سباحة", icon: "fa-person-swimming", color: "#06b6d4" },
    kickboxing: { id: "kickboxing", name: "كيك بوكسينج", icon: "fa-hand-fist", color: "#f97316" },
    boxing: { id: "boxing", name: "ملاكمة", icon: "fa-shield-halved", color: "#ef4444" },
    mma: { id: "mma", name: "فنون قتالية (MMA)", icon: "fa-user-ninja", color: "#dc2626" },
    taekwondo: { id: "taekwondo", name: "تايكوندو", icon: "fa-person-running", color: "#3b82f6" },
    judo: { id: "judo", name: "جودو", icon: "fa-people-robbery", color: "#6366f1" },
    karate: { id: "karate", name: "كاراتيه", icon: "fa-hand", color: "#ec4899" },
    wrestling: { id: "wrestling", name: "مصارعة", icon: "fa-person-falling", color: "#a855f7" },
    football: { id: "football", name: "كرة قدم", icon: "fa-futbol", color: "#22c55e" },
    basketball: { id: "basketball", name: "كرة سلة", icon: "fa-basketball", color: "#f59e0b" },
    handball: { id: "handball", name: "كرة يد", icon: "fa-volleyball", color: "#14b8a6" },
    volleyball: { id: "volleyball", name: "كرة طائرة", icon: "fa-network-wired", color: "#8b5cf6" },
    tennis: { id: "tennis", name: "تنس أرضي", icon: "fa-table-tennis-paddle-ball", color: "#84cc16" },
    tabletennis: { id: "tabletennis", name: "تنس طاولة", icon: "fa-circle-dot", color: "#10b981" },
    weightlifting: { id: "weightlifting", name: "رفع أثقال", icon: "fa-weight-hanging", color: "#eab308" },
    track: { id: "track", name: "مضمار وجري", icon: "fa-stopwatch", color: "#38bdf8" },
    longjump: { id: "longjump", name: "الوثب وألعاب قوى", icon: "fa-person-walking-arrow-right", color: "#d946ef" }
  };

  // 2. أقسام كل رياضة (الجيم يقتصر على الـ 7 مجموعات العضلية بدون كارديو وتسخين)
  const SPORTS_CATEGORIES = {
    gym: [
      { id: "chest", name: "الصدر", icon: "fa-heart-pulse" },
      { id: "back", name: "الظهر", icon: "fa-dumbbell" },
      { id: "legs", name: "الرجل", icon: "fa-person-walking" },
      { id: "shoulders", name: "الكتف", icon: "fa-shield-halved" },
      { id: "biceps", name: "بايسبس", icon: "fa-hand-fist" },
      { id: "triceps", name: "ترايسبس", icon: "fa-bolt" },
      { id: "abs", name: "بطن", icon: "fa-fire" }
    ],
    swimming: [
      { id: "sw_free", name: "سباحة حرة (كرول)", icon: "fa-water" },
      { id: "sw_breast", name: "سباحة صدر", icon: "fa-person-swimming" },
      { id: "sw_back", name: "سباحة ظهر", icon: "fa-water-ladder" },
      { id: "sw_fly", name: "سباحة فراشة", icon: "fa-feather" },
      { id: "sw_cond", name: "لياقة مائية", icon: "fa-heart-pulse" },
      { id: "sw_dry", name: "إحماء وإطالات جافة", icon: "fa-stopwatch" }
    ],
    kickboxing: [
      { id: "kb_punch", name: "لكمات وملاكمة", icon: "fa-hand-fist" },
      { id: "kb_kick", name: "ركلات أساسية وقاضية", icon: "fa-person-running" },
      { id: "kb_knee", name: "ركبات ودفاعات", icon: "fa-shield-halved" },
      { id: "kb_combos", name: "تركيبات كومبو", icon: "fa-bolt" },
      { id: "kb_pads", name: "تدريب الميتس والكيس", icon: "fa-dumbbell" }
    ],
    boxing: [
      { id: "bx_punch", name: "اللكمات الأساسية", icon: "fa-hand-fist" },
      { id: "bx_defense", name: "الدفاع والمراوغة", icon: "fa-shield-halved" },
      { id: "bx_footwork", name: "حركة القدمين", icon: "fa-shoe-prints" },
      { id: "bx_speed", name: "كيس السرعة والرشاقة", icon: "fa-bolt" }
    ],
    mma: [
      { id: "mma_strike", name: "الضربات والوقفات", icon: "fa-hand-fist" },
      { id: "mma_take", name: "الإسقاطات (تيك داون)", icon: "fa-person-falling" },
      { id: "mma_ground", name: "القتال الأرضي", icon: "fa-arrows-down-to-people" },
      { id: "mma_sub", name: "حركات الإخضاع", icon: "fa-lock" }
    ],
    taekwondo: [
      { id: "tk_kicks", name: "الركلات السريعة", icon: "fa-person-running" },
      { id: "tk_jump", name: "ركلات هوائية ودائرية", icon: "fa-feather" },
      { id: "tk_poom", name: "بومسي ووقفات", icon: "fa-user-ninja" },
      { id: "tk_flex", name: "مرونة الحوض", icon: "fa-arrows-left-right" }
    ],
    judo: [
      { id: "jd_ukemi", name: "كسر السقوط بأمان", icon: "fa-person-falling" },
      { id: "jd_throws", name: "الرميات الكلاسيكية", icon: "fa-arrows-spin" },
      { id: "jd_ground", name: "التثبيت الأرضي", icon: "fa-shield" },
      { id: "jd_grip", name: "قوة القبضة", icon: "fa-hand-fist" }
    ],
    karate: [
      { id: "kr_kihon", name: "كيهون وضربات", icon: "fa-hand-fist" },
      { id: "kr_kata", name: "كاتا ووقفات", icon: "fa-user-ninja" },
      { id: "kr_kumite", name: "كوميتيه وتباري", icon: "fa-bolt" },
      { id: "kr_blocks", name: "صدات ودفاعات", icon: "fa-shield-halved" }
    ],
    wrestling: [
      { id: "wr_takedown", name: "الرميات والتيك داون", icon: "fa-person-falling" },
      { id: "wr_defense", name: "سبراول ودفاع", icon: "fa-shield" },
      { id: "wr_bridge", name: "كوبري وقوة الرقبة", icon: "fa-archway" },
      { id: "wr_strength", name: "قوة وتحمل المصارع", icon: "fa-dumbbell" }
    ],
    football: [
      { id: "fb_dribble", name: "استلام ومراوغة", icon: "fa-futbol" },
      { id: "fb_passing", name: "تمرير وباص", icon: "fa-arrow-right-arrow-left" },
      { id: "fb_shooting", name: "تسديد وإنهاء", icon: "fa-bullseye" },
      { id: "fb_agility", name: "سلم رشاقة وسرعة", icon: "fa-bars-staggered" },
      { id: "fb_power", name: "قوة انفجارية", icon: "fa-bolt" }
    ],
    basketball: [
      { id: "bb_dribble", name: "دريبل وتنطيط", icon: "fa-basketball" },
      { id: "bb_shooting", name: "تصويب ورميات", icon: "fa-bullseye" },
      { id: "bb_layup", name: "ليف أب واختراق", icon: "fa-arrow-up-right-dots" },
      { id: "bb_vert", name: "قفز عمودي وريباوند", icon: "fa-up-long" }
    ],
    handball: [
      { id: "hb_shot", name: "تسديد طائر 9م", icon: "fa-volleyball" },
      { id: "hb_pass", name: "تمريرات سريعة", icon: "fa-share" },
      { id: "hb_dribble", name: "جري وتنطيط", icon: "fa-person-running" },
      { id: "hb_shoulder", name: "قوة الكتف والذراع", icon: "fa-shield-halved" }
    ],
    volleyball: [
      { id: "vb_spike", name: "ضرب ساحق (سبايك)", icon: "fa-bolt" },
      { id: "vb_serve", name: "إرسال قاطع وعائم", icon: "fa-arrow-up" },
      { id: "vb_set", name: "إعداد وتمرير بأصابع", icon: "fa-hand" },
      { id: "vb_block", name: "حائط صد ودفاع", icon: "fa-shield-halved" }
    ],
    tennis: [
      { id: "tn_serve", name: "إرسال حاسم", icon: "fa-arrow-trend-up" },
      { id: "tn_fore", name: "فورهاند توب سبين", icon: "fa-table-tennis-paddle-ball" },
      { id: "tn_back", name: "باكهاند وسلايس", icon: "fa-rotate-left" },
      { id: "tn_foot", name: "تحركات الملعب ورشاقة", icon: "fa-shoe-prints" }
    ],
    tabletennis: [
      { id: "tt_drive", name: "فورهاند درايف ولووب", icon: "fa-circle-dot" },
      { id: "tt_push", name: "باكهاند بوش وبلوك", icon: "fa-shield" },
      { id: "tt_serve", name: "إرسال خادع ودوران", icon: "fa-arrows-rotate" },
      { id: "tt_speed", name: "رد فعل سريع", icon: "fa-bolt" }
    ],
    weightlifting: [
      { id: "wl_snatch", name: "الخطف (Snatch)", icon: "fa-up-long" },
      { id: "wl_clean", name: "الكلين والنتر (Clean & Jerk)", icon: "fa-weight-hanging" },
      { id: "wl_squat", name: "سكوات أولمبي", icon: "fa-dumbbell" },
      { id: "wl_pull", name: "سحب انفجاري", icon: "fa-bolt" }
    ],
    track: [
      { id: "tr_sprint", name: "سبرنت وانطلاق 100م", icon: "fa-stopwatch-20" },
      { id: "tr_drills", name: "تمرين دريل أ ب (Skip)", icon: "fa-person-running" },
      { id: "tr_hurdle", name: "تخطي الحواجز وتوافق", icon: "fa-road-barrier" },
      { id: "tr_endur", name: "تحمل هوائي وفارتلك", icon: "fa-heart-pulse" }
    ],
    longjump: [
      { id: "lj_approach", name: "اقتراب وسرعة اللوحة", icon: "fa-forward" },
      { id: "lj_flight", name: "طيران وتعليق هوائي", icon: "fa-plane-departure" },
      { id: "lj_landing", name: "هبوط رملي وسحب أرجل", icon: "fa-shoe-prints" },
      { id: "lj_plyo", name: "بليومتريكس وانفجارية", icon: "fa-bolt" }
    ]
  };

  // 3. قاعدة التمارين المتخصصة الكاملة بدون صور لجميع الرياضات الـ 17
  const SPORTS_EXERCISES = [
"@)

Write-Host "Appending complete exercises..."
