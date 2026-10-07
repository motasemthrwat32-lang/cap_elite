/* =========================================================
   CAP ELITE — النظام الشامل (التمارين + التغذية + الأدمن والتصدير)
   ملف مدمج كامل 100% بدون أي نقصان
   ========================================================= */
"use strict";

/* =========================================================
   1) شريط عرض الأخطاء لضمان استقرار النظام
   ========================================================= */
function showErrorBar(msg){
  try{
    var bar=document.getElementById("errbar");
    if(!bar){bar=document.createElement("div");bar.id="errbar";bar.className="errbar";document.body.appendChild(bar);}
    bar.innerHTML='<button type="button" onclick="this.parentNode.remove()">×</button>⚠ '+String(msg).replace(/</g,"&lt;");
  }catch(e){}
}
window.addEventListener("error",function(e){ if(e && e.message) showErrorBar(e.message+(e.lineno?" (line "+e.lineno+")":"")); });
window.addEventListener("unhandledrejection",function(e){ showErrorBar("Promise: "+((e.reason&&e.reason.message)||e.reason)); });

/* =========================================================
   2) إعدادات المدربين والباسوردات المعتمدة
   ========================================================= */
const ADMIN_MASTER_PASS = "752004@Sarwat";
const DEMO_COACHES = [
  { code: "ENGY@2",      name: "ENGY ASHRAF" },
  { code: "ABDO@1",      name: "ABDO OSMAN" }
];
const SESSION_KEY = "capEliteCoach";
const CUSTOM_TRAINERS_KEY = "cap_elite_custom_trainers";
const TARGET_EXERCISES = 10;
const EXERCISES_PER_PAGE = 10;

function formatArDate(d) {
  try {
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return "";
    const day = dt.getDate();
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    return `${day} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
  } catch(e) {
    return "";
  }
}

function formatArFullDate(d) {
  try {
    const dt = d ? new Date(d) : new Date();
    if (isNaN(dt.getTime())) return "";
    const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    return `${days[dt.getDay()]}، ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
  } catch(e) {
    return "";
  }
}

const DB_URLS = [
  "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/dist/exercises.json",
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json"
];
const IMG_BASES = [
  "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/",
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"
];
const CUSTOM_IMAGES = {};

/* دمج وتحديث قائمة المدربين المعتمدة */
function syncCustomCoaches() {
  try {
    const custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || [];
    custom.forEach(tc => {
      if (!tc.expiresAt) {
        tc.durationDays = tc.durationDays || 30;
        tc.durationLabel = tc.durationLabel || "1 شهر (30 يوم)";
        tc.createdAt = tc.createdAt || new Date().toISOString();
        tc.expiresAt = new Date(Date.now() + tc.durationDays * 24 * 60 * 60 * 1000).toISOString();
      }
      if (!DEMO_COACHES.some(c => c.code.toLowerCase() === tc.code.toLowerCase())) {
        DEMO_COACHES.push(tc);
      }
    });
  } catch(e) {}
}
syncCustomCoaches();

/* =========================================================
   3) قاعدة بيانات التمارين الكاملة (60+ تمرين بصورها الأصلية)
   ========================================================= */
const CUSTOM_EXERCISES = [
  {"id":"cap-chest-01","cat":"chest","name":"Machine Chest Press","ar":"ضغط صدر بالجهاز","level":"beginner","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-01.jpg","images/chest/chest-02.jpg","images/chest/chest-33.jpg","images/chest/chest-34.jpg"],"desc":"ضغط للصدر على جهاز بمسار ثابت، فبيركّز الشغل على الصدر من غير ما تحتاج توازن، ومناسب جدًا للمبتدئين.","local":true},
  {"id":"cap-chest-02","cat":"chest","name":"Plate-Loaded Chest Press","ar":"ضغط صدر بالأطباق (هامر)","level":"intermediate","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-03.jpg","images/chest/chest-09.jpg","images/chest/chest-41.jpg","images/chest/chest-42.jpg"],"desc":"جهاز بأطباق بيدّيك حركة ضغط طبيعية وقوية، بيبني كتلة وقوة في الصدر مع تحكّم كامل في المسار.","local":true},
  {"id":"cap-chest-03","cat":"chest","name":"Cable Crossover","ar":"كروس أوفر كابل","level":"intermediate","equipment":"cable","mechanic":"isolation","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders"],"images":["images/chest/chest-04.jpg","images/chest/chest-05.jpg","images/chest/chest-43.jpg","images/chest/chest-44.jpg"],"desc":"بيعزل عضلة الصدر ويحافظ على الشد عليها طول الحركة، وممتاز لتحديد منتصف الصدر وتفاصيله.","local":true},
  {"id":"cap-chest-04","cat":"chest","name":"Machine Chest Fly (Pec Deck)","ar":"فلاي صدر بالجهاز (بيك ديك)","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders"],"images":["images/chest/chest-06.jpg","images/chest/chest-07.jpg","images/chest/chest-26.jpg","images/chest/chest-31.jpg"],"desc":"بيفتح ويقفل الدراعين على الجهاز عشان يعزل الصدر، ويساعد على توسيع الصدر وتحسين الإحساس بالعضلة.","local":true},
  {"id":"cap-chest-05","cat":"chest","name":"Incline Dumbbell Press","ar":"بنش مائل دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-08.jpg","images/chest/chest-14.jpg","images/chest/chest-22.jpg","images/chest/chest-35.jpg","images/chest/chest-36.jpg","images/chest/chest-45.jpg"],"desc":"بيركّز على الجزء العلوي من الصدر، ومدى الحركة الأكبر مع الدامبلز بيساعد على توازن العضلة بين الناحيتين.","local":true},
  {"id":"cap-chest-06","cat":"chest","name":"Low-to-High Cable Fly","ar":"فلاي كابل من تحت لفوق","level":"intermediate","equipment":"cable","mechanic":"isolation","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders"],"images":["images/chest/chest-10.jpg","images/chest/chest-11.jpg"],"desc":"حركة ضم بالكابل من تحت لفوق بتشدّ على أعلى الصدر وتساعد على امتلاء الصدر العلوي.","local":true},
  {"id":"cap-chest-07","cat":"chest","name":"Cable Fly","ar":"فلاي كابل","level":"intermediate","equipment":"cable","mechanic":"isolation","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders"],"images":["images/chest/chest-12.jpg","images/chest/chest-13.jpg","images/chest/chest-15.jpg","images/chest/chest-18.jpg","images/chest/chest-20.jpg"],"desc":"حركة فتح وضم بالكابل بتحافظ على الشد على الصدر طول الوقت، وبتحسّن شكل العضلة وتفاصيلها.","local":true},
  {"id":"cap-chest-08","cat":"chest","name":"Dumbbell Bench Press","ar":"بنش مستوي دامبل","level":"beginner","equipment":"dumbbell","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-16.jpg","images/chest/chest-17.jpg","images/chest/chest-55.jpg","images/chest/chest-56.jpg"],"desc":"الضغط بالدامبلز على بنش مستوي بيبني الصدر كله، وبيسمح بنزول أعمق من البار ويقوّي ثبات الكتف.","local":true},
  {"id":"cap-chest-09","cat":"chest","name":"Parallel Bar Dips","ar":"متوازي (ديبس) للصدر","level":"intermediate","equipment":"body only","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["triceps","shoulders"],"images":["images/chest/chest-19.jpg","images/chest/chest-32.jpg","images/chest/chest-39.jpg"],"desc":"تمرين بوزن الجسم بيقوّي أسفل الصدر والترايسبس والكتف الأمامي، وميل الجسم للأمام بيزوّد شغل الصدر.","local":true},
  {"id":"cap-chest-10","cat":"chest","name":"Barbell Bench Press","ar":"بنش بار مستوي","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-21.jpg"],"desc":"أهم تمرين لبناء قوة وكتلة الصدر، بيستخدم أوزان تقيلة ويشغّل الصدر والكتف الأمامي والترايسبس.","local":true},
  {"id":"cap-chest-11","cat":"chest","name":"Dumbbell Fly","ar":"فلاي دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders"],"images":["images/chest/chest-23.jpg","images/chest/chest-24.jpg"],"desc":"بيفتح الصدر بحركة قوس ويمط ألياف العضلة، وبيعزل الصدر من غير تدخّل كبير من الترايسبس.","local":true},
  {"id":"cap-chest-12","cat":"chest","name":"Push-Up","ar":"ضغط (بوش أب)","level":"beginner","equipment":"body only","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps","abdominals"],"images":["images/chest/chest-25.jpg"],"desc":"تمرين بوزن الجسم بيقوّي الصدر والكتف والترايسبس ويشدّ عضلات البطن، وتقدر تعمله في أي مكان.","local":true},
  {"id":"cap-chest-13","cat":"chest","name":"Dumbbell Pullover","ar":"بولوفر دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"compound","force":"pull","primaryMuscles":["chest"],"secondaryMuscles":["lats","triceps"],"images":["images/chest/chest-27.jpg","images/chest/chest-28.jpg","images/chest/chest-51.jpg","images/chest/chest-52.jpg"],"desc":"بيمط القفص الصدري ويشغّل الصدر والضهر العلوي مع بعض، وبيساعد على توسيع الصدر.","local":true},
  {"id":"cap-chest-14","cat":"chest","name":"Decline Dumbbell Press","ar":"بنش سفلي دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-29.jpg","images/chest/chest-30.jpg","images/chest/chest-37.jpg","images/chest/chest-38.jpg","images/chest/chest-47.jpg","images/chest/chest-48.jpg"],"desc":"ضغط بالدامبلز على بنش منحدر، بيستهدف أسفل الصدر ويدّي إحساس قوي بالجزء السفلي من العضلة.","local":true},
  {"id":"cap-chest-15","cat":"chest","name":"Decline Barbell Bench Press","ar":"بنش سفلي بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-40.jpg","images/chest/chest-46.jpg","images/chest/chest-60.jpg","images/chest/chest-67.jpg"],"desc":"بنش بار على ميل سفلي بيستهدف أسفل الصدر، ويسمح بأوزان تقيلة مع ضغط أقل على الكتف.","local":true},
  {"id":"cap-chest-16","cat":"chest","name":"Lying Machine Chest Press","ar":"ضغط صدر نايم بالجهاز","level":"beginner","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-49.jpg","images/chest/chest-50.jpg"],"desc":"ضغط للصدر وإنت نايم على جهاز بأطباق، بيدّيك ثبات كويس وتقدر ترفع وزن تقيل بأمان.","local":true},
  {"id":"cap-chest-17","cat":"chest","name":"Incline Dumbbell Fly","ar":"فلاي علوي دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders"],"images":["images/chest/chest-53.jpg"],"desc":"فتح الدامبلز على بنش مائل بيمط الصدر العلوي ويعزله ويحسّن تفاصيله.","local":true},
  {"id":"cap-chest-18","cat":"chest","name":"Knee Push-Up","ar":"ضغط على الركبة","level":"beginner","equipment":"body only","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-54.jpg","images/chest/chest-59.jpg"],"desc":"نسخة أسهل من الضغط العادي، مناسبة للمبتدئين وبتقوّي الصدر والترايسبس لحد ما تقدر تعمل ضغط كامل.","local":true},
  {"id":"cap-chest-19","cat":"chest","name":"Incline Barbell Bench Press","ar":"بنش مائل بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-57.jpg","images/chest/chest-58.jpg"],"desc":"بيبني الصدر العلوي والكتف الأمامي بأوزان تقيلة، وبيكمّل شكل الصدر مع البنش المستوي.","local":true},
  {"id":"cap-chest-20","cat":"chest","name":"Smith Machine Incline Press","ar":"بنش مائل سميث","level":"intermediate","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-61.jpg","images/chest/chest-62.jpg"],"desc":"نفس فايدة البنش المائل، لكن بمسار ثابت في جهاز السميث فبيدّيك أمان وتحكّم أكتر.","local":true},
  {"id":"cap-chest-21","cat":"chest","name":"Smith Machine Bench Press","ar":"بنش مستوي سميث","level":"beginner","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps"],"images":["images/chest/chest-63.jpg","images/chest/chest-64.jpg"],"desc":"بنش مستوي على جهاز السميث بمسار ثابت، بيركّز على الصدر ومناسب للتدريب من غير سبوتر.","local":true},
  {"id":"cap-chest-22","cat":"chest","name":"Incline Dumbbell Pullover","ar":"بولوفر مائل دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"compound","force":"pull","primaryMuscles":["chest"],"secondaryMuscles":["lats","triceps"],"images":["images/chest/chest-65.jpg","images/chest/chest-66.jpg"],"desc":"بيمط الصدر العلوي والقفص الصدري على بنش مائل، ويشغّل الصدر والضهر في نفس الوقت.","local":true},
  {"id":"cap-chest-23","cat":"chest","name":"TRX Push-Up","ar":"ضغط بحبال التعليق (TRX)","level":"intermediate","equipment":"other","mechanic":"compound","force":"push","primaryMuscles":["chest"],"secondaryMuscles":["shoulders","triceps","abdominals"],"images":["images/chest/chest-68.jpg","images/chest/chest-69.jpg"],"desc":"ضغط بحبال معلّقة بيزوّد الصعوبة لأن الجسم بيتأرجح، فبيشغّل الصدر والكور وثبات الكتف.","local":true},
  {"id":"cap-back-01","cat":"back","name":"Close-Grip Lat Pulldown","ar":"سحب عالي ضيق","level":"beginner","equipment":"cable","mechanic":"compound","force":"pull","primaryMuscles":["lats"],"secondaryMuscles":["biceps","middle back"],"images":["images/back/back-01.jpg","images/back/back-05.jpg","images/back/back-25.jpg"],"desc":"سحب البار لصدرك بقبضة ضيقة، بيشغّل اللاتس وسُمك الضهر والبايسبس.","local":true},
  {"id":"cap-back-02","cat":"back","name":"Seated Machine Row","ar":"تجديف بالجهاز قاعد","level":"beginner","equipment":"machine","mechanic":"compound","force":"pull","primaryMuscles":["middle back"],"secondaryMuscles":["lats","biceps"],"images":["images/back/back-02.jpg","images/back/back-03.jpg"],"desc":"تجديف على جهاز بمسار ثابت، بيزوّد سُمك منتصف الضهر ويحسّن وضعية الكتفين.","local":true},
  {"id":"cap-back-03","cat":"back","name":"Romanian Deadlift","ar":"رومانيان ديدليفت","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"pull","primaryMuscles":["lower back","hamstrings"],"secondaryMuscles":["glutes"],"images":["images/back/back-04.jpg"],"desc":"بيقوّي أسفل الضهر والفخذ الخلفي والمؤخرة، وبيعلّمك حركة الانحناء من الحوض بظهر مستقيم.","local":true},
  {"id":"cap-back-04","cat":"back","name":"One-Arm Dumbbell Row","ar":"تجديف دامبل بدراع واحدة","level":"beginner","equipment":"dumbbell","mechanic":"compound","force":"pull","primaryMuscles":["lats"],"secondaryMuscles":["middle back","biceps"],"images":["images/back/back-06.jpg","images/back/back-07.jpg"],"desc":"تجديف بدراع واحدة بيركّز على كل ناحية لوحدها، وبيبني عرض وسُمك الضهر ويصلّح الفرق بين الناحيتين.","local":true},
  {"id":"cap-back-05","cat":"back","name":"Straight-Arm Cable Pulldown","ar":"سحب كابل بدراعات مفرودة","level":"intermediate","equipment":"cable","mechanic":"isolation","force":"pull","primaryMuscles":["lats"],"secondaryMuscles":["middle back"],"images":["images/back/back-08.jpg","images/back/back-09.jpg"],"desc":"بيعزل اللاتس بدون تدخّل البايسبس، وبيحسّن الإحساس بعضلة الضهر وعرضه.","local":true},
  {"id":"cap-back-06","cat":"back","name":"Wide-Grip Lat Pulldown","ar":"سحب عالي واسع","level":"beginner","equipment":"cable","mechanic":"compound","force":"pull","primaryMuscles":["lats"],"secondaryMuscles":["biceps","middle back"],"images":["images/back/back-10.jpg","images/back/back-11.jpg","images/back/back-14.jpg","images/back/back-26.jpg","images/back/back-27.jpg"],"desc":"سحب البار من فوق بقبضة واسعة، بيعرّض الضهر ويدّيه شكل V ويقوّي اللاتس.","local":true},
  {"id":"cap-back-07","cat":"back","name":"Barbell Deadlift","ar":"ديدليفت بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"pull","primaryMuscles":["lower back"],"secondaryMuscles":["glutes","hamstrings","quadriceps","traps"],"images":["images/back/back-12.jpg","images/back/back-13.jpg","images/back/back-16.jpg"],"desc":"أقوى تمرين لقوة الجسم كله؛ بيشغّل الضهر السفلي والمؤخرة والفخذ والترابيس في حركة واحدة.","local":true},
  {"id":"cap-back-08","cat":"back","name":"Barbell Bent-Over Row","ar":"تجديف بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"pull","primaryMuscles":["middle back"],"secondaryMuscles":["lats","biceps","lower back"],"images":["images/back/back-15.jpg"],"desc":"تمرين أساسي لسُمك الضهر، بيشغّل منتصف الضهر واللاتس ويقوّي أسفل الضهر للثبات.","local":true},
  {"id":"cap-back-09","cat":"back","name":"Pull-Up","ar":"عقلة","level":"intermediate","equipment":"body only","mechanic":"compound","force":"pull","primaryMuscles":["lats"],"secondaryMuscles":["biceps","middle back"],"images":["images/back/back-17.jpg","images/back/back-18.jpg"],"desc":"تمرين وزن جسم بيبني عرض الضهر وقوة السحب، ويشغّل البايسبس والساعد كمان.","local":true},
  {"id":"cap-back-10","cat":"back","name":"Back Extension","ar":"هايبر إكستنشن (ضهر سفلي)","level":"beginner","equipment":"body only","mechanic":"isolation","force":"pull","primaryMuscles":["lower back"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/back/back-19.jpg"],"desc":"بيقوّي أسفل الضهر والمؤخرة وبيحمي العمود الفقري ويحسّن القوام.","local":true},
  {"id":"cap-back-11","cat":"back","name":"Seated Cable Row","ar":"سحب أرضي كابل","level":"beginner","equipment":"cable","mechanic":"compound","force":"pull","primaryMuscles":["middle back"],"secondaryMuscles":["lats","biceps"],"images":["images/back/back-20.jpg","images/back/back-21.jpg","images/back/back-24.jpg"],"desc":"سحب القبضة ناحية بطنك وإنت قاعد، بيسمّك منتصف الضهر ويعدّل وضعية الكتفين.","local":true},
  {"id":"cap-back-12","cat":"back","name":"T-Bar Row","ar":"تي بار رو","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"pull","primaryMuscles":["middle back"],"secondaryMuscles":["lats","biceps","lower back"],"images":["images/back/back-22.jpg","images/back/back-23.jpg"],"desc":"تجديف بالتي بار بيبني كتلة وسُمك في الضهر بأوزان تقيلة بثبات أكتر من البار الحر.","local":true},
  {"id":"cap-legs-01","cat":"legs","name":"Lever Leg Press","ar":"ليج برس جهاز بالأطباق","level":"beginner","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/legs/legs-01.jpg","images/legs/legs-09.jpg"],"desc":"دفع الأطباق بالرجلين وإنت مايل لورا، بيبني الفخذ الأمامي والمؤخرة بأمان ومن غير حمل على الضهر.","local":true},
  {"id":"cap-legs-02","cat":"legs","name":"Seated Calf Raise","ar":"سمانة قاعد","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["calves"],"secondaryMuscles":[],"images":["images/legs/legs-02.jpg","images/legs/legs-41.jpg","images/legs/legs-42.jpg"],"desc":"رفع الكعبين وإنت قاعد، بيركّز على عضلة السمانة السفلية وبيحسّن قوة الكاحل.","local":true},
  {"id":"cap-legs-03","cat":"legs","name":"Romanian Deadlift (Barbell)","ar":"رومانيان ديدليفت بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"pull","primaryMuscles":["hamstrings"],"secondaryMuscles":["glutes","lower back"],"images":["images/legs/legs-03.jpg","images/legs/legs-04.jpg"],"desc":"بيمط ويقوّي الفخذ الخلفي والمؤخرة بحركة انحناء من الحوض مع الحفاظ على استقامة الضهر.","local":true},
  {"id":"cap-legs-04","cat":"legs","name":"Dumbbell Romanian Deadlift","ar":"رومانيان ديدليفت دامبل","level":"beginner","equipment":"dumbbell","mechanic":"compound","force":"pull","primaryMuscles":["hamstrings"],"secondaryMuscles":["glutes","lower back"],"images":["images/legs/legs-48.jpg","images/legs/legs-52.jpg"],"desc":"نفس فايدة الرومانيان بالبار لكن بالدامبلز، أسهل في التعلّم وبيقوّي الفخذ الخلفي والمؤخرة.","local":true},
  {"id":"cap-legs-05","cat":"legs","name":"Seated Leg Curl","ar":"ليج كيرل قاعد","level":"beginner","equipment":"machine","mechanic":"isolation","force":"pull","primaryMuscles":["hamstrings"],"secondaryMuscles":["calves"],"images":["images/legs/legs-05.jpg","images/legs/legs-06.jpg"],"desc":"ثني الركبة على الجهاز وإنت قاعد، بيعزل الفخذ الخلفي ويقلّل خطر إصابات الركبة.","local":true},
  {"id":"cap-legs-06","cat":"legs","name":"Smith Machine Squat","ar":"سكوات سميث","level":"intermediate","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/legs/legs-07.jpg","images/legs/legs-08.jpg"],"desc":"سكوات بمسار ثابت في جهاز السميث، بيبني الفخذ الأمامي والمؤخرة مع تحكّم وأمان أكتر.","local":true},
  {"id":"cap-legs-07","cat":"legs","name":"Leg Extension","ar":"ليج إكستنشن","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":[],"images":["images/legs/legs-10.jpg","images/legs/legs-16.jpg","images/legs/legs-28.jpg","images/legs/legs-32.jpg"],"desc":"فرد الركبة على الجهاز بيعزل الفخذ الأمامي بالكامل ويحدّد شكله.","local":true},
  {"id":"cap-legs-08","cat":"legs","name":"Smith Machine Calf Raise","ar":"سمانة واقف سميث","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["calves"],"secondaryMuscles":[],"images":["images/legs/legs-11.jpg","images/legs/legs-45.jpg","images/legs/legs-46.jpg"],"desc":"رفع الكعبين وإنت واقف تحت بار السميث، بيقوّي ويكبّر عضلة السمانة.","local":true},
  {"id":"cap-legs-09","cat":"legs","name":"Hip Abduction Machine","ar":"جهاز الفخذ الخارجي","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["abductors"],"secondaryMuscles":["glutes"],"images":["images/legs/legs-12.jpg"],"desc":"بيفتح الرجلين للخارج على الجهاز، بيقوّي الفخذ الخارجي والمؤخرة ويثبّت الحوض.","local":true},
  {"id":"cap-legs-10","cat":"legs","name":"Hip Adduction Machine","ar":"جهاز الفخذ الداخلي","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["adductors"],"secondaryMuscles":[],"images":["images/legs/legs-13.jpg"],"desc":"بيضم الرجلين ناحية بعض على الجهاز، بيقوّي الفخذ الداخلي ويحسّن ثبات الحوض والركبة.","local":true},
  {"id":"cap-legs-11","cat":"legs","name":"Barbell Squat","ar":"سكوات بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings","lower back"],"images":["images/legs/legs-14.jpg","images/legs/legs-23.jpg","images/legs/legs-33.jpg","images/legs/legs-34.jpg"],"desc":"ملك تمارين الرجل؛ بيبني الفخذ والمؤخرة وقوة الجسم كله، ويشغّل الجذع للثبات.","local":true},
  {"id":"cap-legs-12","cat":"legs","name":"Barbell Deadlift","ar":"ديدليفت بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"pull","primaryMuscles":["glutes"],"secondaryMuscles":["hamstrings","quadriceps","lower back"],"images":["images/legs/legs-15.jpg","images/legs/legs-17.jpg"],"desc":"رفع البار من الأرض بيشغّل المؤخرة والفخذ والضهر في حركة واحدة وبيبني قوة شاملة.","local":true},
  {"id":"cap-legs-13","cat":"legs","name":"Dumbbell Walking Lunge","ar":"لانجز مشي دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings","calves"],"images":["images/legs/legs-18.jpg"],"desc":"خطوات لانجز بالدامبلز بتشغّل الفخذ والمؤخرة وبتحسّن التوازن وثبات الرجلين.","local":true},
  {"id":"cap-legs-14","cat":"goblet-squat","cat":"legs","name":"Goblet Squat","ar":"جوبلت سكوات","level":"beginner","equipment":"kettlebells","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/legs/legs-19.jpg","images/legs/legs-20.jpg"],"desc":"سكوات بوزن قدام الصدر بيساعدك تنزل بشكل صح وتشغّل الفخذ والمؤخرة والجذع.","local":true},
  {"id":"cap-legs-15","cat":"legs","name":"Dumbbell Squat","ar":"سكوات دامبل","level":"beginner","equipment":"dumbbell","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/legs/legs-21.jpg","images/legs/legs-22.jpg"],"desc":"سكوات ماسكة دامبلز في الإيدين، بيبني الفخذ والمؤخرة بوزن أخف على الضهر من البار.","local":true},
  {"id":"cap-legs-16","cat":"legs","name":"Kettlebell Sumo Squat","ar":"سكوات سومو كيتل بل","level":"beginner","equipment":"kettlebells","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["adductors","glutes"],"images":["images/legs/legs-24.jpg","images/legs/legs-27.jpg"],"desc":"سكوات برجلين واسعة بيشغّل الفخذ الداخلي والمؤخرة والفخذ الأمامي.","local":true},
  {"id":"cap-legs-17","cat":"legs","name":"45° Leg Press","ar":"ليج برس 45 درجة","level":"beginner","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/legs/legs-25.jpg","images/legs/legs-26.jpg","images/legs/legs-37.jpg","images/legs/legs-47.jpg"],"desc":"دفع المنصة بالرجلين على ميل 45 درجة، بيبني قوة وكتلة الفخذ والمؤخرة بأمان.","local":true},
  {"id":"cap-legs-18","cat":"legs","name":"Machine Leg Press","ar":"ليج برس جهاز قاعد","level":"beginner","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/legs/legs-31.jpg","images/legs/legs-38.jpg"],"desc":"دفع المنصة بالرجلين وإنت قاعد على جهاز بالوزن المعدني، بيقوّي الفخذين والمؤخرة.","local":true},
  {"id":"cap-legs-19","cat":"legs","name":"Dumbbell Bulgarian Split Squat","ar":"سبليت سكوات بلغاري دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/legs/legs-29.jpg","images/legs/legs-30.jpg"],"desc":"سكوات برجل واحدة والتانية على بنش، بيبني رجل قوية ومتوازنة وبيحسّن التوازن.","local":true},
  {"id":"cap-legs-20","cat":"legs","name":"Lying Leg Curl","ar":"ليج كيرل نايم","level":"beginner","equipment":"machine","mechanic":"isolation","force":"pull","primaryMuscles":["hamstrings"],"secondaryMuscles":["calves"],"images":["images/legs/legs-35.jpg","images/legs/legs-36.jpg"],"desc":"ثني الركبة وإنت نايم على بطنك، بيعزل الفخذ الخلفي ويقوّيه.","local":true},
  {"id":"cap-legs-21","cat":"legs","name":"Barbell Lunge","ar":"لانجز بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":["glutes","hamstrings"],"images":["images/legs/legs-39.jpg","images/legs/legs-40.jpg"],"desc":"لانجز بالبار على الكتف، بيقوّي الفخذ والمؤخرة وبيحسّن التوازن وثبات الحوض.","local":true},
  {"id":"cap-legs-22","cat":"legs","name":"Standing Calf Raise Machine","ar":"سمانة واقف بالجهاز","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["calves"],"secondaryMuscles":[],"images":["images/legs/legs-43.jpg","images/legs/legs-44.jpg"],"desc":"رفع الكعبين وإنت واقف على جهاز بالأوزان، بيبني السمانة بقوة.","local":true},
  {"id":"cap-legs-23","cat":"legs","name":"Calf Press on Leg Press","ar":"سمانة على جهاز الليج برس","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["calves"],"secondaryMuscles":[],"images":["images/legs/legs-49.jpg","images/legs/legs-50.jpg"],"desc":"دفع المنصة بأطراف الصوابع على جهاز الليج برس، بيعزل عضلة السمانة بأمان.","local":true},
  {"id":"cap-legs-24","cat":"legs","name":"Seated Cable Leg Extension","ar":"ليج إكستنشن قاعد بالكابل","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["quadriceps"],"secondaryMuscles":[],"images":["images/legs/legs-51.jpg","images/legs/legs-53.jpg"],"desc":"فرد الركبة وإنت قاعد على جهاز بكابل، بيعزل الفخذ الأمامي وبيحسّن قوته.","local":true},
  {"id":"cap-shoulders-01","cat":"shoulders","name":"Machine Shoulder Press","ar":"ضغط كتف بالجهاز","level":"beginner","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["triceps"],"images":["images/shoulders/shoulders-02.jpg","images/shoulders/shoulders-03.jpg","images/shoulders/shoulders-32.jpg","images/shoulders/shoulders-33.jpg"],"desc":"ضغط للأكتاف على جهاز بمسار ثابت، بيبني الكتف الأمامي والجانبي بأمان.","local":true},
  {"id":"cap-shoulders-02","cat":"shoulders","name":"Seated Dumbbell Shoulder Press","ar":"ضغط كتف دامبل قاعد","level":"intermediate","equipment":"dumbbell","mechanic":"compound","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["triceps"],"images":["images/shoulders/shoulders-04.jpg","images/shoulders/shoulders-05.jpg"],"desc":"أساسي لبناء أكتاف عريضة وقوية، والجلوس بيثبّت الجسم ويركّز الشغل على الكتف.","local":true},
  {"id":"cap-shoulders-03","cat":"shoulders","name":"Dumbbell Shoulder External Rotation","ar":"دوران خارجي للكتف بدامبل","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["shoulders"],"secondaryMuscles":[],"images":["images/shoulders/shoulders-06.jpg"],"desc":"بيقوّي العضلات الصغيرة حوالين مفصل الكتف (الروتيتور كاف) وبيحميه من الإصابة.","local":true},
  {"id":"cap-abs-01","cat":"abs","name":"Ab Wheel Rollout","ar":"عجلة البطن","level":"intermediate","equipment":"other","mechanic":"compound","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":["shoulders","lats"],"images":["images/shoulders/shoulders-07.jpg","images/abs/abs-06.jpg"],"desc":"بيشدّ عضلات البطن والجذع بقوة ويشغّل الكتف والضهر كمان، وهو تمرين متقدم للكور.","local":true},
  {"id":"cap-shoulders-04","cat":"shoulders","name":"Barbell Overhead Press","ar":"ميلتري برس بار","level":"intermediate","equipment":"barbell","mechanic":"compound","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["triceps"],"images":["images/shoulders/shoulders-08.jpg"],"desc":"ضغط البار فوق الراس وإنت واقف، بيبني قوة وكتلة الأكتاف والترايسبس ويشغّل الجذع للثبات.","local":true},
  {"id":"cap-shoulders-05","cat":"shoulders","name":"Seated Dumbbell Lateral Raise","ar":"رفرفة جانبي دامبل قاعد","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["traps"],"images":["images/shoulders/shoulders-01.jpg","images/shoulders/shoulders-09.jpg","images/shoulders/shoulders-22.jpg","images/shoulders/shoulders-23.jpg"],"desc":"بيعزل الكتف الجانبي، وده اللي بيدّي الأكتاف عرضها وشكلها المرفوع.","local":true},
  {"id":"cap-shoulders-06","cat":"shoulders","name":"Dumbbell Shrug","ar":"رفع أكتاف دامبل (شراج)","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["traps"],"secondaryMuscles":["shoulders"],"images":["images/shoulders/shoulders-10.jpg","images/shoulders/shoulders-11.jpg"],"desc":"رفع الكتفين لفوق بالدامبلز بيقوّي الترابيس (أعلى الضهر والرقبة) ويحسّن شكل الأكتاف.","local":true},
  {"id":"cap-shoulders-07","cat":"shoulders","name":"Barbell Shrug","ar":"شراج بار","level":"beginner","equipment":"barbell","mechanic":"isolation","force":"pull","primaryMuscles":["traps"],"secondaryMuscles":["shoulders"],"images":["images/shoulders/shoulders-12.jpg","images/shoulders/shoulders-21.jpg"],"desc":"رفع الكتفين بالبار بيسمح بوزن أتقل ويبني الترابيس بقوة.","local":true},
  {"id":"cap-shoulders-08","cat":"shoulders","name":"Chest Dips (Shoulders)","ar":"متوازي للكتف والصدر","level":"intermediate","equipment":"body only","mechanic":"compound","force":"push","primaryMuscles":["chest","shoulders"],"secondaryMuscles":["triceps"],"images":["images/shoulders/shoulders-13.jpg","images/shoulders/shoulders-14.jpg","images/shoulders/shoulders-15.jpg"],"desc":"تمرين بوزن الجسم بيشغّل الصدر والكتف الأمامي والترايسبس مع بعض.","local":true},
  {"id":"cap-shoulders-09","cat":"shoulders","name":"Reverse Pec Deck","ar":"فلاي خلفي بالجهاز","level":"beginner","equipment":"machine","mechanic":"isolation","force":"pull","primaryMuscles":["shoulders"],"secondaryMuscles":["middle back","traps"],"images":["images/shoulders/shoulders-16.jpg","images/shoulders/shoulders-17.jpg"],"desc":"بيشغّل الكتف الخلفي وأعلى الضهر، وبيحسّن القوام ويوازن شكل الكتف.","local":true},
  {"id":"cap-shoulders-10","cat":"shoulders","name":"Cable Front Raise","ar":"رفرفة أمامي كابل","level":"beginner","equipment":"cable","mechanic":"isolation","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["chest"],"images":["images/shoulders/shoulders-18.jpg","images/shoulders/shoulders-19.jpg"],"desc":"بيعزل الكتف الأمامي بمقاومة ثابتة من الكابل طول الحركة.","local":true},
  {"id":"cap-shoulders-11","cat":"shoulders","name":"Machine Lateral Raise","ar":"رفرفة جانبي بالجهاز","level":"beginner","equipment":"machine","mechanic":"isolation","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["traps"],"images":["images/shoulders/shoulders-20.jpg","images/shoulders/shoulders-28.jpg"],"desc":"رفرفة جانبي على جهاز بمسار ثابت، بيعزل الكتف الجانبي من غير أرجحة.","local":true},
  {"id":"cap-shoulders-12","cat":"shoulders","name":"Cable Face Pull","ar":"فيس بول كابل","level":"intermediate","equipment":"cable","mechanic":"compound","force":"pull","primaryMuscles":["shoulders"],"secondaryMuscles":["traps","middle back"],"images":["images/shoulders/shoulders-24.jpg","images/shoulders/shoulders-25.jpg"],"desc":"سحب الحبل ناحية وشك، بيقوّي الكتف الخلفي وأعلى الضهر ويحسّن وضعية الكتفين.","local":true},
  {"id":"cap-shoulders-13","cat":"shoulders","name":"Cable Lateral Raise","ar":"رفرفة جانبي كابل","level":"intermediate","equipment":"cable","mechanic":"isolation","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["traps"],"images":["images/shoulders/shoulders-26.jpg","images/shoulders/shoulders-27.jpg"],"desc":"رفرفة جانبي بالكابل بتحافظ على الشد على الكتف الجانبي طول الحركة.","local":true},
  {"id":"cap-shoulders-14","cat":"shoulders","name":"Seated Bent-Over Rear Delt Raise","ar":"رفرفة خلفي دامبل قاعد","level":"intermediate","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["shoulders"],"secondaryMuscles":["middle back","traps"],"images":["images/shoulders/shoulders-29.jpg","images/shoulders/shoulders-35.jpg"],"desc":"بيعزل الكتف الخلفي وهو الجزء اللي بيكمّل شكل الكتف من ورا.","local":true},
  {"id":"cap-shoulders-15","cat":"shoulders","name":"Plate-Loaded Shoulder Press","ar":"ضغط كتف جهاز بالأطباق","level":"intermediate","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["triceps"],"images":["images/shoulders/shoulders-30.jpg","images/shoulders/shoulders-31.jpg"],"desc":"ضغط كتف على جهاز بأطباق بحركة طبيعية، بيبني قوة وكتلة الأكتاف.","local":true},
  {"id":"cap-shoulders-16","cat":"shoulders","name":"Smith Machine Shoulder Press","ar":"ضغط كتف سميث","level":"intermediate","equipment":"machine","mechanic":"compound","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["triceps"],"images":["images/shoulders/shoulders-34.jpg","images/shoulders/shoulders-40.jpg"],"desc":"ضغط كتف بمسار ثابت في جهاز السميث، بيدّيك ثبات وبيبني الأكتاف بأمان.","local":true},
  {"id":"cap-shoulders-17","cat":"shoulders","name":"Dumbbell Front Raise","ar":"رفرفة أمامي دامبل","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["chest"],"images":["images/shoulders/shoulders-36.jpg","images/shoulders/shoulders-37.jpg"],"desc":"رفع الدامبل قدام الجسم بيعزل الكتف الأمامي ويقوّيه.","local":true},
  {"id":"cap-shoulders-18","cat":"shoulders","name":"Single-Arm Cable Lateral Raise","ar":"رفرفة جانبي كابل بدراع واحدة","level":"intermediate","equipment":"cable","mechanic":"isolation","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":["traps"],"images":["images/shoulders/shoulders-38.jpg","images/shoulders/shoulders-39.jpg"],"desc":"رفرفة بدراع واحدة بالكابل بتركّز على كل كتف لوحده بمقاومة ثابتة.","local":true},
  {"id":"cap-shoulders-19","cat":"shoulders","name":"Side-Lying Incline Lateral Raise","ar":"رفرفة جانبي على بنش مائل","level":"intermediate","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["shoulders"],"secondaryMuscles":[],"images":["images/shoulders/shoulders-41.jpg","images/shoulders/shoulders-44.jpg"],"desc":"رفرفة وإنت نايم على جنبك على بنش مائل، بتغيّر زاوية الشد على الكتف الجانبي.","local":true},
  {"id":"cap-shoulders-20","cat":"shoulders","name":"Kneeling Cable Rear Delt Pull","ar":"سحب كتف خلفي كابل (ركبة)","level":"intermediate","equipment":"cable","mechanic":"compound","force":"pull","primaryMuscles":["shoulders"],"secondaryMuscles":["middle back","traps"],"images":["images/shoulders/shoulders-42.jpg","images/shoulders/shoulders-43.jpg"],"desc":"سحب الكابل ناحية الراس وإنت راكع، بيشغّل الكتف الخلفي وأعلى الضهر.","local":true},
  {"id":"cap-biceps-01","cat":"biceps","name":"Preacher Curl","ar":"بريشر كيرل","level":"intermediate","equipment":"barbell","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-01.jpg","images/biceps/biceps-03.jpg"],"desc":"الدراعين على الدعامة بيمنعوا الأرجحة، فبيعزل البايسبس بقوة خصوصًا الجزء السفلي.","local":true},
  {"id":"cap-biceps-02","cat":"biceps","name":"Barbell Preacher Curl","ar":"بريشر كيرل بار (بنش)","level":"intermediate","equipment":"barbell","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-11.jpg","images/biceps/biceps-12.jpg"],"desc":"كيرل بالبار على بنش البريشر، بيعزل البايسبس ويبني كتلته.","local":true},
  {"id":"cap-biceps-03","cat":"biceps","name":"Machine Preacher Curl","ar":"بريشر كيرل بالجهاز","level":"beginner","equipment":"machine","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-20.jpg","images/biceps/biceps-23.jpg"],"desc":"كيرل على جهاز بريشر بمسار ثابت، مناسب للمبتدئين وبيعزل البايسبس.","local":true},
  {"id":"cap-biceps-04","cat":"biceps","name":"Single-Arm Cable Curl","ar":"باي كابل بدراع واحدة","level":"intermediate","equipment":"cable","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-02.jpg","images/biceps/biceps-09.jpg"],"desc":"كيرل بالكابل بيحافظ على الشد على البايسبس طول الحركة.","local":true},
  {"id":"cap-biceps-05","cat":"biceps","name":"Cross-Body Hammer Curl","ar":"هامر كيرل متقاطع","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-04.jpg"],"desc":"كيرل بالدامبل ناحية الصدر بيشغّل البايسبس والعضلة العميقة تحته (البراكياليس) والساعد.","local":true},
  {"id":"cap-biceps-06","cat":"biceps","name":"Barbell Curl","ar":"باي بار","level":"beginner","equipment":"barbell","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-05.jpg","images/biceps/biceps-06.jpg"],"desc":"التمرين الكلاسيكي لبناء كتلة وقوة البايسبس بأوزان تقيلة.","local":true},
  {"id":"cap-biceps-07","cat":"biceps","name":"Concentration Curl","ar":"كونسنترشن كيرل","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-07.jpg","images/biceps/biceps-08.jpg"],"desc":"كيرل بدراع واحدة والكوع على الفخذ، بيعزل البايسبس ويركّز على الانقباض.","local":true},
  {"id":"cap-biceps-10","cat":"biceps","name":"Incline Dumbbell Curl","ar":"باي دامبل على بنش مائل","level":"intermediate","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-13.jpg","images/biceps/biceps-14.jpg"],"desc":"الجلوس على بنش مائل بيمط البايسبس في أول الحركة، فبيشغّل الرأس الطويلة منه بقوة.","local":true},
  {"id":"cap-biceps-11","cat":"biceps","name":"Dumbbell Curl","ar":"باي دامبل","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-16.jpg","images/biceps/biceps-19.jpg"],"desc":"كيرل بالدامبلز بيبني البايسبس ويصلّح الفرق بين الدراعين.","local":true},
  {"id":"cap-biceps-13","cat":"biceps","name":"EZ-Bar Curl","ar":"باي بار زد","level":"beginner","equipment":"e-z curl bar","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-21.jpg","images/biceps/biceps-22.jpg"],"desc":"البار الزد بيريّح الرسغ أثناء الكيرل ويبني البايسبس بأمان.","local":true},
  {"id":"cap-triceps-01","cat":"triceps","name":"Triceps Pushdown","ar":"تراي كابل (بوشداون)","level":"beginner","equipment":"cable","mechanic":"isolation","force":"push","primaryMuscles":["triceps"],"secondaryMuscles":[],"images":["images/triceps/triceps-01.jpg","images/triceps/triceps-07.jpg"],"desc":"فرد الدراعين لتحت بالكابل بيعزل الترايسبس ويحدّد شكل الدراع من ورا.","local":true},
  {"id":"cap-triceps-02","cat":"triceps","name":"Dumbbell Kickback","ar":"كيك باك دامبل","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["triceps"],"secondaryMuscles":["shoulders"],"images":["images/triceps/triceps-02.jpg"],"desc":"فرد الكوع لورا بالدامبل بيعزل الترايسبس بقوة ويركّز على الانقباض.","local":true},
  {"id":"cap-triceps-03","cat":"triceps","name":"Overhead Dumbbell Triceps Extension","ar":"تراي فوق الراس دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["triceps"],"secondaryMuscles":["shoulders"],"images":["images/triceps/triceps-04.jpg"],"desc":"فرد الدراعين فوق الراس بدامبل واحد بيمط الترايسبس بقوة وبيشغّل الرأس الطويلة.","local":true},
  {"id":"cap-triceps-04","cat":"triceps","name":"Parallel Bar Dips","ar":"متوازي (ديبس)","level":"intermediate","equipment":"body only","mechanic":"compound","force":"push","primaryMuscles":["triceps"],"secondaryMuscles":["chest","shoulders"],"images":["images/triceps/triceps-05.jpg"],"desc":"تمرين بوزن الجسم بيبني الترايسبس والصدر والكتف الأمامي.","local":true},
  {"id":"cap-triceps-05","cat":"triceps","name":"Bench Dips","ar":"ديبس على بنش","level":"beginner","equipment":"body only","mechanic":"compound","force":"push","primaryMuscles":["triceps"],"secondaryMuscles":["chest","shoulders"],"images":["images/triceps/triceps-06.jpg","images/triceps/triceps-15.jpg"],"desc":"ديبس على بنش وراك، سهل وبيقوّي الترايسبس في أي مكان.","local":true},
  {"id":"cap-triceps-07","cat":"triceps","name":"Lying Dumbbell Triceps Extension","ar":"تراي نايم دامبل","level":"intermediate","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["triceps"],"secondaryMuscles":["shoulders"],"images":["images/triceps/triceps-10.jpg","images/triceps/triceps-11.jpg"],"desc":"فرد الكوع وإنت نايم بيعزل الترايسبس ويشدّ عليه طول الحركة.","local":true},
  {"id":"cap-triceps-08","cat":"triceps","name":"Seated Single-Arm Overhead Extension","ar":"تراي فوق الراس دراع واحدة","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"push","primaryMuscles":["triceps"],"secondaryMuscles":[],"images":["images/triceps/triceps-12.jpg","images/triceps/triceps-13.jpg"],"desc":"فرد الدراع فوق الراس وإنت قاعد، بيركّز على كل ترايسبس لوحده.","local":true},
  {"id":"cap-biceps-18","cat":"biceps","name":"Hammer Curl","ar":"هامر كيرل","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/triceps/triceps-26.jpg","images/triceps/triceps-27.jpg"],"desc":"كيرل بقبضة محايدة بيشغّل البايسبس والبراكياليس والساعد ويزوّد سُمك الدراع.","local":true},
  {"id":"cap-abs-02","cat":"abs","name":"Machine Crunch","ar":"كرنش بالجهاز","level":"beginner","equipment":"machine","mechanic":"isolation","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":[],"images":["images/abs/abs-01.jpg","images/abs/abs-05.jpg"],"desc":"كرنش على جهاز بوزن، بيعزل عضلات البطن ويسمح بزيادة المقاومة تدريجيًا.","local":true},
  {"id":"cap-abs-03","cat":"abs","name":"Plank","ar":"بلانك","level":"beginner","equipment":"body only","mechanic":"isolation","force":"static","primaryMuscles":["abdominals"],"secondaryMuscles":["shoulders","lower back"],"images":["images/abs/abs-02.jpg","images/abs/abs-11.jpg"],"desc":"ثبات على الساعدين بيقوّي البطن والجذع كله ويحمي أسفل الضهر.","local":true},
  {"id":"cap-abs-04","cat":"abs","name":"Plate Russian Twist","ar":"روسيان تويست بطبق","level":"intermediate","equipment":"other","mechanic":"isolation","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":["lower back"],"images":["images/abs/abs-03.jpg","images/abs/abs-04.jpg","images/abs/abs-10.jpg"],"desc":"لف الجذع بطبق وزن بيشغّل جوانب البطن (الأوبليك) والجذع.","local":true},
  {"id":"cap-abs-06","cat":"abs","name":"Mountain Climber","ar":"ماونتن كلايمر","level":"beginner","equipment":"body only","mechanic":"compound","force":"push","primaryMuscles":["abdominals"],"secondaryMuscles":["quadriceps","shoulders"],"images":["images/abs/abs-09.jpg","images/abs/abs-19.jpg"],"desc":"جري على الأرض بوضع الضغط، بيشدّ البطن ويرفع النبض ويحرق سعرات.","local":true},
  {"id":"cap-abs-07","cat":"abs","name":"Crunch","ar":"كرنش","level":"beginner","equipment":"body only","mechanic":"isolation","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":[],"images":["images/abs/abs-12.jpg","images/abs/abs-13.jpg"],"desc":"التمرين الكلاسيكي بيستهدف عضلة البطن المستقيمة (الأبس) بحركة بسيطة.","local":true},
  {"id":"cap-abs-08","cat":"abs","name":"Russian Twist","ar":"روسيان تويست","level":"beginner","equipment":"body only","mechanic":"isolation","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":[],"images":["images/abs/abs-14.jpg","images/abs/abs-15.jpg"],"desc":"لف الجذع من جنب لجنب بيشغّل جوانب البطن ويحسّن ثبات الجذع.","local":true},
  {"id":"cap-abs-10","cat":"abs","name":"Bicycle Crunch","ar":"كرنش دراجة","level":"beginner","equipment":"body only","mechanic":"isolation","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":[],"images":["images/abs/abs-22.jpg","images/abs/abs-23.jpg"],"desc":"حركة بيدال بالرجلين مع لف الجذع، بتشغّل البطن المستقيمة وجوانب البطن.","local":true},
  {"id":"cap-biceps-08","cat":"biceps","name":"Lying Band Biceps Curl","ar":"باي بالأستك نايم","level":"beginner","equipment":"bands","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-10.jpg","images/abs/abs-26.jpg"],"desc":"سحب الأستك بالإيدين وإنت نايم، بيشغّل البايسبس ومناسب للتمرين في البيت.","local":true},
  {"id":"cap-biceps-09","cat":"biceps","name":"Seated Band Biceps Curl","ar":"باي بالأستك قاعد","level":"beginner","equipment":"bands","mechanic":"isolation","force":"pull","primaryMuscles":["biceps"],"secondaryMuscles":["forearms"],"images":["images/biceps/biceps-15.jpg","images/abs/abs-18.jpg"],"desc":"كيرل بالأستك وإنت قاعد، بيشغّل البايسبس بمقاومة متزايدة طول الحركة.","local":true},
  {"id":"cap-biceps-12","cat":"biceps","name":"Cable Wrist Curl","ar":"رسغ كابل","level":"beginner","equipment":"cable","mechanic":"isolation","force":"pull","primaryMuscles":["forearms"],"secondaryMuscles":[],"images":["images/biceps/biceps-17.jpg","images/biceps/biceps-18.jpg","images/triceps/triceps-24.jpg","images/triceps/triceps-25.jpg"],"desc":"ثني الرسغ بالكابل بيقوّي الساعد وقبضة اليد.","local":true},
  {"id":"cap-triceps-06","cat":"triceps","name":"Close-Grip Knee Push-Up","ar":"ضغط ضيق على الركبة","level":"beginner","equipment":"body only","mechanic":"compound","force":"push","primaryMuscles":["triceps"],"secondaryMuscles":["chest","shoulders"],"images":["images/triceps/triceps-08.jpg","images/triceps/triceps-09.jpg"],"desc":"ضغط بإيدين قريبين من بعض على الركبة، بيزوّد شغل الترايسبس وهو أسهل من الضغط الكامل.","local":true},
  {"id":"cap-biceps-14","cat":"biceps","name":"Barbell Wrist Curl (Over Bench)","ar":"رسغ بار على بنش","level":"beginner","equipment":"barbell","mechanic":"isolation","force":"pull","primaryMuscles":["forearms"],"secondaryMuscles":[],"images":["images/triceps/triceps-16.jpg","images/triceps/triceps-17.jpg"],"desc":"ثني الرسغ بالبار والساعد على البنش، بيقوّي الساعد وقبضة اليد.","local":true},
  {"id":"cap-biceps-15","cat":"biceps","name":"Seated Dumbbell Wrist Curl","ar":"رسغ دامبل قاعد","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["forearms"],"secondaryMuscles":[],"images":["images/triceps/triceps-18.jpg","images/triceps/triceps-19.jpg"],"desc":"ثني الرسغ بالدامبلز وإنت قاعد، بيقوّي الساعد وبيحسّن قبضة اليد.","local":true},
  {"id":"cap-biceps-16","cat":"biceps","name":"Single-Arm Dumbbell Wrist Curl","ar":"رسغ دامبل بدراع واحدة","level":"beginner","equipment":"dumbbell","mechanic":"isolation","force":"pull","primaryMuscles":["forearms"],"secondaryMuscles":[],"images":["images/triceps/triceps-20.jpg","images/triceps/triceps-21.jpg"],"desc":"ثني الرسغ بدراع واحدة، بيركّز على الساعد وقبضة اليد.","local":true},
  {"id":"cap-biceps-17","cat":"biceps","name":"Seated Barbell Wrist Curl","ar":"رسغ بار قاعد","level":"beginner","equipment":"barbell","mechanic":"isolation","force":"pull","primaryMuscles":["forearms"],"secondaryMuscles":[],"images":["images/triceps/triceps-22.jpg","images/triceps/triceps-28.jpg"],"desc":"ثني الرسغ بالبار على الفخذين، بيبني الساعد وبيزوّد قوة الإمساك.","local":true},
  {"id":"cap-abs-05","cat":"abs","name":"Battle Rope Waves","ar":"حبال المعركة (باتل روب)","level":"intermediate","equipment":"other","mechanic":"compound","force":"pull","primaryMuscles":["shoulders"],"secondaryMuscles":["abdominals","forearms"],"images":["images/abs/abs-07.jpg","images/abs/abs-08.jpg"],"desc":"موجات بالحبال التقيلة بترفع نبض القلب وتحرق سعرات وتشغّل الكتف والجذع والساعد.","local":true},
  {"id":"cap-abs-09","cat":"abs","name":"Seated Knee Tuck","ar":"ضم الركبة للصدر قاعد","level":"beginner","equipment":"body only","mechanic":"isolation","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":[],"images":["images/abs/abs-20.jpg","images/abs/abs-21.jpg"],"desc":"ضم الركبتين ناحية الصدر بيشغّل أسفل البطن بحركة بسيطة.","local":true},
  {"id":"cap-abs-11","cat":"abs","name":"Roman Chair Side Bend","ar":"ميل جانبي على الكرسي الروماني","level":"intermediate","equipment":"body only","mechanic":"isolation","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":["lower back"],"images":["images/abs/abs-28.jpg","images/abs/abs-29.jpg"],"desc":"ميل جانبي على الكرسي الروماني بيشغّل عضلات جوانب البطن (الأوبليك).","local":true},
  {"id":"cap-abs-12","cat":"abs","name":"Decline Sit-Up","ar":"سيت أب على بنش مائل","level":"intermediate","equipment":"body only","mechanic":"isolation","force":"pull","primaryMuscles":["abdominals"],"secondaryMuscles":[],"images":["images/abs/abs-30.jpg","images/abs/abs-31.jpg"],"desc":"سيت أب على بنش منحدر بيزوّد الصعوبة ويقوّي البطن بقوة.","local":true}
];

const CATEGORY_NAMES = { chest:"الصدر", back:"الظهر", legs:"الرجل", shoulders:"الكتف", biceps:"البايسبس", triceps:"الترايسبس", abs:"البطن", cardio:"الكارديو", warmup:"التسخين" };
const LEVEL_NAMES = { beginner:"مبتدئ", intermediate:"متوسط", expert:"متقدم" };
const MECHANIC_NAMES = { compound:"مركّب", isolation:"عزل" };
const FORCE_NAMES = { push:"دفع", pull:"سحب", static:"ثبات" };
const EQUIPMENT_NAMES = {
  dumbbell:"دامبل", barbell:"بار", machine:"جهاز", cable:"كابل", "body only":"وزن الجسم",
  kettlebells:"كيتل بل", bands:"أستك مقاومة", "e-z curl bar":"بار زد", "medicine ball":"كرة طبية",
  "exercise ball":"كرة سويسرية", "foam roll":"فوم رولر", other:"أداة أخرى"
};

const ARABIC_NAMES = {
  "Barbell Bench Press":"بنش بار","Barbell Squat":"سكوات بار","Deadlift":"ديدليفت","Barbell Deadlift":"ديدليفت بار",
  "Pull-Up":"عقلة","Chin-Up":"عقلة قبضة عكسية","Push-Up":"ضغط","Pushups":"ضغط","Dumbbell Bench Press":"بنش دامبل",
  "Incline Dumbbell Press":"بنش علوي دامبل","Incline Barbell Bench Press":"بنش علوي بار","Dumbbell Flyes":"فلاي دامبل",
  "Dumbbell Fly":"فلاي دامبل","Cable Crossover":"كروس أوفر","Barbell Curl":"باي بار","Dumbbell Curl":"باي دامبل",
  "Hammer Curls":"هامر كيرل","Hammer Curl":"هامر كيرل","Preacher Curl":"بريشر كيرل","Triceps Pushdown":"تراي كابل",
  "Skullcrusher":"سكل كراشر","Military Press":"ميلتري برس","Dumbbell Shoulder Press":"ضغط كتف دامبل",
  "Side Lateral Raise":"رفرفة جانبي","Lateral Raise":"رفرفة جانبي","Front Dumbbell Raise":"رفرفة أمامي",
  "Bent Over Barbell Row":"تجديف بار","Barbell Row":"تجديف بار","Dumbbell Row":"تجديف دامبل",
  "Seated Cable Rows":"سحب أرضي","Wide-Grip Lat Pulldown":"سحب عالي واسع","Lat Pulldown":"سحب عالي",
  "Leg Press":"ليج برس","Leg Extensions":"ليج إكستنشن","Leg Extension":"ليج إكستنشن","Lying Leg Curls":"ليج كيرل",
  "Leg Curl":"ليج كيرل","Romanian Deadlift":"رومانيان ديدليفت","Lunges":"لانجز","Crunches":"كرنش","Crunch":"كرنش",
  "Sit-Up":"سيت أب","Plank":"بلانك","Russian Twist":"روسيان تويست","Rope Jumping":"نط حبل","Jump Rope":"نط حبل",
  "Running, Treadmill":"جري على المشاية","Running":"جري","Treadmill":"جري على المشاية"
};

const MUSCLE_AR = {
  chest:"الصدر", shoulders:"الكتف", biceps:"البايسبس", triceps:"الترايسبس", forearms:"الساعد",
  abdominals:"البطن", quadriceps:"الفخذ الأمامي", hamstrings:"الفخذ الخلفي", glutes:"المؤخرة",
  calves:"السمانة", adductors:"الفخذ الداخلي", abductors:"الفخذ الخارجي", lats:"المجانص (اللاتس)",
  "middle back":"منتصف الظهر", "lower back":"أسفل الظهر", traps:"الترابيس", neck:"الرقبة"
};

const MUSCLE_BENEFIT = {
  chest:"بيقوّي ويكبّر عضلة الصدر ويحسّن قوة الدفع في الحياة اليومية وباقي التمارين.",
  shoulders:"بيبني أكتاف أعرض وأقوى ويحسّن ثبات مفصل الكتف وشكل الجزء العلوي.",
  biceps:"بيكبّر ويقوّي البايسبس ويحسّن قوة السحب وثني الكوع.",
  triceps:"بيقوّي الترايسبس، وده أكبر جزء في الذراع، وبيحسّن قوة الدفع.",
  forearms:"بيقوّي الساعد وقبضة اليد، وده بيساعدك تمسك أوزان أتقل.",
  abdominals:"بيقوّي البطن والجذع (الكور) ويحسّن ثبات الجسم ويحمي أسفل الظهر.",
  quadriceps:"بيقوّي الفخذ الأمامي ويحسّن قوة الرجل في المشي والجري والطلوع.",
  hamstrings:"بيقوّي الفخذ الخلفي ويحسّن السرعة ويقلّل إصابات الركبة.",
  glutes:"بيقوّي ويشكّل المؤخرة ويحسّن قوة الحوض وثبات الجسم.",
  calves:"بيقوّي السمانة ويحسّن ثبات الكاحل والقفز والجري.",
  adductors:"بيقوّي الفخذ الداخلي ويحسّن ثبات الحوض والركبة.",
  abductors:"بيقوّي الفخذ الخارجي ويحسّن توازن الحوض أثناء الحركة.",
  lats:"بيعرّض الظهر (شكل V) ويقوّي حركات السحب ويحسّن القوام.",
  "middle back":"بيزوّد سُمك منتصف الظهر ويحسّن وضعية الكتفين.",
  "lower back":"بيقوّي أسفل الظهر ويحمي العمود الفقري.",
  traps:"بيقوّي الترابيس ويحسّن ثبات الكتفين والرقبة.",
  neck:"بيقوّي عضلات الرقبة ويحسّن ثباتها."
};

const EQUIP_SETUP = {
  barbell:"حمّل البار بوزن مناسب لمستواك وامسكه بقبضة ثابتة ومتساوية من الناحيتين.",
  dumbbell:"اختار دامبلز بوزن مناسب وامسك واحد في كل إيد بقبضة ثابتة.",
  "e-z curl bar":"امسك البار الزد من الانحناءات بقبضة مريحة للرسغ.",
  cable:"اضبط البكرة على الارتفاع المناسب واختار الوزن وركّب المقبض المناسب.",
  machine:"اضبط المقعد والوسادات على مقاس جسمك عشان المفصل يكون على محور الجهاز.",
  "body only":"اتخذ الوضع الصحيح مع الانتباه لوضع اليدين والرجلين.",
  kettlebells:"امسك الكيتل بل من المقبض بقبضة ثابتة ووقف بثبات.",
  bands:"ثبّت الأستك كويس واختار مقاومة مناسبة لمستواك.",
  "medicine ball":"امسك الكرة الطبية بالإيدين الاتنين قريب من جسمك.",
  "exercise ball":"استخدم الكرة السويسرية كقاعدة ثابتة واتأكد إنها منفوخة كويس.",
  "foam roll":"حط الفوم رولر تحت العضلة المطلوبة واتحكّم في وزنك بإيديك.",
  other:"جهّز الأداة المطلوبة في مكان آمن واتخذ وضعية ثابتة."
};

const CUSTOM_EXERCISES_USER_KEY = "cap_elite_custom_user_exercises";
const state = { coach:"", coachSport:"gym", currentSport:"gym", all:[], selected:[], cat:"", visible:30, loading:false, photo:"", detailId:null, dbLoaded:false };
const imgCache = new Map();
const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const esc = v => String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const safeName = v => String(v || "").trim().replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g,"-") || "workout";
const findEx = id => state.all.find(e => e.id === id);
const isSel = id => state.selected.some(s => s.id === id);
const levelName = () => LEVEL_NAMES[$("#levelSelect").value] || "مبتدئ";
const arName = ex => ex.ar || ARABIC_NAMES[ex.name] || ex.name;

let toastT = null;
function toast(msg){
  const t = $("#toast");
  if(!t) return;
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
}

const FALLBACK_IMAGE = (() => {
  try{
    const c = document.createElement("canvas"); c.width = 160; c.height = 120;
    const x = c.getContext("2d");
    x.fillStyle = "#18181e"; x.fillRect(0,0,160,120);
    x.fillStyle = "#e0b83f"; x.font = "bold 30px Arial"; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText("CAP", 80, 60);
    return c.toDataURL("image/png");
  }catch(e){ return ""; }
})();

function imgUrl(ex, i = 0, base = 0){
  const p = ex && ex.images && (ex.images[i] || ex.images[0]);
  if (!p) return "";
  if (typeof p === "string" && (p.startsWith("data:") || p.startsWith("blob:"))) return p;
  if (ex && ex.local){
    if (typeof window !== "undefined" && window.CAP_IMAGES_DATA && window.CAP_IMAGES_DATA[p]) {
      return window.CAP_IMAGES_DATA[p];
    }
    try { return new URL(p.replace(/^\.\//, ""), document.baseURI).href; }
    catch(e) { return p; }
  }
  if (i === 0 && CUSTOM_IMAGES[ex.id]) return CUSTOM_IMAGES[ex.id];
  return /^https?:\/\//i.test(p) ? p : IMG_BASES[base] + p;
}

function imgAttrs(ex, i = 0){
  return `src="${esc(imgUrl(ex,i,0))}" data-alt="${esc(imgUrl(ex,i,1))}" data-fb="1" alt="" loading="lazy"`;
}

function exVisualHTML(ex, attr = "", i = 0) {
  if (ex && ex.images && ex.images.length && (ex.sport === "gym" || !ex.sport)) {
    return `<img ${imgAttrs(ex, i)} ${attr}>`;
  }
  const sportId = (ex && ex.sport) || state.currentSport || "gym";
  const cfg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs && window.CAP_SPORTS_DATA.configs[sportId]) || { icon: "fa-dumbbell", name: "رياضة" };
  const icon = cfg.icon || "fa-dumbbell";
  return `<div class="pk-icon-badge" ${attr}><i class="fa-solid ${icon}"></i></div>`;
}

document.addEventListener("error", e => {
  const img = e.target;
  if (!img || img.tagName !== "IMG" || img.dataset.fb !== "1") return;
  if (img.dataset.alt && !img.dataset.triedAlt){ img.dataset.triedAlt = "1"; img.src = img.dataset.alt; }
  else if (FALLBACK_IMAGE && img.src !== FALLBACK_IMAGE){ img.src = FALLBACK_IMAGE; }
}, true);

/* خريطة العضلات */
const BW = 120, BH = 225, BGAP = 8;
function sym(m,x,y,rx,ry,rot=0){ return [{t:"e",m,x,y,rx,ry,rot},{t:"e",m,x:BW-x,y,rx,ry,rot:-rot}]; }
const BODY_FRONT = [
  {t:"e",m:null,x:60,y:18,rx:12,ry:15},
  {t:"r",m:"neck",x:54,y:31,w:12,h:11,r:4},
  ...sym("traps",47,42,9,4,-0.3),
  ...sym("shoulders",36,51,11,10),
  ...sym("chest",48,61,12,10),
  ...sym("biceps",29,76,7,13,0.15),
  ...sym("forearms",24,103,6,14,0.12),
  ...sym(null,21,124,5,7),
  {t:"r",m:"abdominals",x:50,y:73,w:20,h:38,r:6},
  ...sym("abdominals",43,91,5,14),
  ...sym("abductors",38,134,4,14),
  ...sym("quadriceps",47,145,10,27),
  ...sym("adductors",55,132,4,14),
  ...sym(null,47,176,6,5),
  ...sym("calves",46,196,7,19),
  ...sym(null,46,219,7,4)
];
const BODY_BACK = [
  {t:"e",m:null,x:60,y:18,rx:12,ry:15},
  {t:"r",m:"neck",x:54,y:31,w:12,h:11,r:4},
  {t:"e",m:"traps",x:60,y:50,rx:19,ry:11},
  ...sym("shoulders",36,51,11,10),
  ...sym("triceps",29,77,7,13,0.15),
  ...sym("forearms",24,103,6,14,0.12),
  ...sym(null,21,124,5,7),
  ...sym("lats",46,80,10,20,0.15),
  {t:"e",m:"middle back",x:60,y:70,rx:8,ry:13},
  {t:"r",m:"lower back",x:51,y:88,w:18,h:18,r:6},
  ...sym("abductors",39,118,4,10),
  ...sym("glutes",50,119,11,11),
  ...sym("hamstrings",47,151,9,23),
  ...sym("adductors",55,142,3,11),
  ...sym(null,47,176,6,5),
  ...sym("calves",46,196,8,18),
  ...sym(null,46,219,7,4)
];
const FRONT_ONLY = ["chest","biceps","abdominals","quadriceps"];
const BACK_ONLY  = ["triceps","lats","middle back","lower back","glutes","hamstrings"];
const mapCache = new Map();

function shapePath(ctx,s){
  ctx.beginPath();
  if(s.t==="e"){ ctx.ellipse(s.x,s.y,s.rx,s.ry,s.rot||0,0,Math.PI*2); return; }
  const {x,y,w,h,r}=s;
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
}

function muscleViews(ex){
  const primary=new Set((ex.primaryMuscles||[]).filter(m=>MUSCLE_AR[m]));
  const secondary=new Set((ex.secondaryMuscles||[]).filter(m=>MUSCLE_AR[m]&&!primary.has(m)));
  if(!primary.size&&!secondary.size) return null;
  const all=[...primary,...secondary];
  let front=all.some(m=>FRONT_ONLY.includes(m));
  let back=all.some(m=>BACK_ONLY.includes(m));
  if(!front&&!back){front=true;back=true;}
  const views=[];
  if(front) views.push({shapes:BODY_FRONT,label:"أمام"});
  if(back)  views.push({shapes:BODY_BACK,label:"خلف"});
  return{primary,secondary,views,width:views.length*BW+(views.length-1)*BGAP,height:BH+16};
}

function drawMuscleViews(ctx,mv){
  mv.views.forEach((v,i)=>{
    ctx.save(); ctx.translate(i*(BW+BGAP),0);
    v.shapes.forEach(s=>{
      shapePath(ctx,s);
      ctx.fillStyle=(s.m&&mv.primary.has(s.m))?"#dc2626":(s.m&&mv.secondary.has(s.m))?"#fb923c":"#d5dae0";
      ctx.fill(); ctx.lineWidth=1; ctx.strokeStyle="#8f98a3"; ctx.stroke();
    });
    ctx.fillStyle="#64748b"; ctx.font="bold 10px Cairo, Arial"; ctx.textAlign="center";
    ctx.fillText(v.label,BW/2,BH+11);
    ctx.restore();
  });
}

function muscleImage(ex){
  const mv=muscleViews(ex);
  if(!mv) return "";
  const key=[...mv.primary].sort().join(",")+"|"+[...mv.secondary].sort().join(",")+"|"+mv.views.length;
  if(mapCache.has(key)) return mapCache.get(key);
  try{
    const sc=3,c=document.createElement("canvas");
    c.width=mv.width*sc; c.height=mv.height*sc;
    const ctx=c.getContext("2d"); ctx.scale(sc,sc);
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,mv.width,mv.height);
    drawMuscleViews(ctx,mv);
    const url=c.toDataURL("image/png");
    mapCache.set(key,url);
    return url;
  }catch(e){return "";}
}

function mapHTML(ex,size=""){
  return "";
}

function tagsHTML(ex){
  const p=(ex.primaryMuscles||[]).filter(m=>MUSCLE_AR[m]).map(m=>`<span class="tag p">${MUSCLE_AR[m]}</span>`).join("");
  const s=(ex.secondaryMuscles||[]).filter(m=>MUSCLE_AR[m]).map(m=>`<span class="tag s">${MUSCLE_AR[m]}</span>`).join("");
  return(p||s)?`<div class="tags">${p}${s}</div>`:"";
}

function arList(arr){
  const n=[...new Set((arr||[]).filter(m=>MUSCLE_AR[m]).map(m=>MUSCLE_AR[m]))];
  if(n.length<=1) return n[0]||"";
  return n.slice(0,-1).join("، ")+" و"+n[n.length-1];
}

function typeSentence(ex){
  const c=String(ex.category||"").toLowerCase();
  if(ex.cat==="cardio"||c==="cardio") return "تمرين كارديو بيرفع معدل ضربات القلب، ويحسّن اللياقة والتحمّل، ويساعد على حرق الدهون.";
  if(ex.cat==="warmup"||c==="stretching") return "تمرين إطالة وتسخين بيحسّن المرونة ومدى الحركة، ويجهّز العضلات، ويقلّل خطر الإصابة.";
  if(c==="plyometrics") return "تمرين بلايومتري (انفجاري) بيطوّر القوة الانفجارية والسرعة والرشاقة.";
  if(c==="olympic weightlifting"||c==="powerlifting"||c==="strongman") return "تمرين قوة ثقيل بيطوّر القوة القصوى والتناسق بين عضلات الجسم كله.";
  if(ex.mechanic==="compound") return "تمرين مركّب بيشغّل أكتر من مفصل في نفس الوقت، فبيبني قوة وكتلة عضلية ويحرق سعرات أعلى.";
  if(ex.mechanic==="isolation") return "تمرين عزل بيركّز على عضلة واحدة، ممتاز لتشكيل العضلة وتحسين تفاصيلها.";
  return "تمرين مقاومة بيقوّي العضلات المستهدفة ويحسّن التحكّم في الحركة.";
}

function benefit(ex){
  if(ex.desc){
    const p0=arList(ex.primaryMuscles);
    const s0=arList((ex.secondaryMuscles||[]).filter(m=>!(ex.primaryMuscles||[]).includes(m)));
    return ex.desc+(p0?` بيستهدف بشكل أساسي ${p0}${s0?`، وبيشارك معاه ${s0}`:""}.`:"");
  }
  const p=arList(ex.primaryMuscles);
  const s=arList((ex.secondaryMuscles||[]).filter(m=>!(ex.primaryMuscles||[]).includes(m)));
  let t=p?`بيستهدف بشكل أساسي ${p}${s?`، وبيشارك معاه ${s}`:""}. `:"";
  t+=typeSentence(ex);
  const main=(ex.primaryMuscles||[]).find(m=>MUSCLE_BENEFIT[m]);
  if(main&&ex.cat!=="cardio"&&ex.cat!=="warmup") t+=" "+MUSCLE_BENEFIT[main];
  return t;
}

function shortBenefit(ex){
  if(ex.desc) return ex.desc;
  if(ex.cat==="cardio"||ex.cat==="warmup") return typeSentence(ex);
  const main=(ex.primaryMuscles||[]).find(m=>MUSCLE_BENEFIT[m]);
  return main?MUSCLE_BENEFIT[main]:typeSentence(ex);
}

function howTo(ex){
  if(Array.isArray(ex.howto) && ex.howto.length) return ex.howto;
  const c=String(ex.category||"").toLowerCase();
  const setup=EQUIP_SETUP[ex.equipment]||EQUIP_SETUP.other;
  if(ex.cat==="cardio"||c==="cardio") return[
    "ابدأ بـ 3 إلى 5 دقائق بسرعة هادية كتسخين.",setup,
    "زوّد السرعة أو المقاومة تدريجيًا لحد مجهود متوسط تقدر تتكلم فيه بصعوبة.",
    "حافظ على ظهر مستقيم وتنفّس منتظم.",
    "كمّل المدة المطلوبة، وبعدها هدّي السرعة 3 دقائق قبل ما تقف."
  ];
  if(ex.cat==="warmup"||c==="stretching") return[
    "اتخذ الوضعية المطلوبة بهدوء ومن غير اندفاع.",
    "ادخل في الإطالة تدريجيًا لحد ما تحس بشدّ خفيف، مش ألم.",
    "اثبت 20 إلى 30 ثانية مع تنفّس عميق وبطيء.",
    "ارجع ببطء وكرّر على الناحية التانية لو التمرين من ناحية واحدة.",
    "كرّر 2 إلى 3 مرات."
  ];
  const st=[setup,"شدّ عضلات البطن، وخلّي ظهرك في وضعه الطبيعي وصدرك مفتوح وكتافك لورا."];
  if(ex.force==="push") st.push("ادفع الوزن بتحكّم مع الزفير لحد نهاية الحركة من غير ما تقفل المفصل تمامًا.");
  else if(ex.force==="pull") st.push("اسحب الوزن مع الزفير وركّز إنك تعصر العضلة المستهدفة في نهاية الحركة.");
  else if(ex.force==="static") st.push("اثبت في الوضع المطلوب مع تنفّس منتظم للمدة المحددة.");
  else st.push("نفّذ الحركة بتحكّم كامل مع الزفير في الجزء الصعب منها.");
  if(ex.force!=="static"){
    st.push("اثبت ثانية في نهاية الحركة، وارجع ببطء (2 إلى 3 ثواني) لنقطة البداية مع الشهيق.");
    st.push("كرّر العدد المطلوب بنفس الأداء، ولو الأداء بدأ يبوظ خفّف الوزن.");
  }
  return st;
}

function tips(ex){
  if(Array.isArray(ex.tips) && ex.tips.length) return ex.tips;
  const t=["ابدأ بوزن خفيف وركّز على الأداء الصحيح قبل ما تزوّد الوزن.","ركّز ذهنيًا على العضلة المستهدفة وحسّ بيها وهي بتشتغل."];
  if(ex.mechanic==="compound") t.push("سخّن بمجموعة أو اتنين خفاف قبل المجموعات الأساسية.");
  if(ex.equipment==="barbell") t.push("استخدم مساعد (سبوتر) أو حواجز أمان مع الأوزان التقيلة.");
  if(ex.cat==="cardio") t.push("اشرب مياه كفاية قبل التمرين وبعده.");
  if(ex.cat==="warmup") t.push("الإطالة الثابتة أحسن بعد التمرين، والديناميكية أحسن قبله.");
  return t;
}

function mistakes(ex){
  if(Array.isArray(ex.mistakes) && ex.mistakes.length) return ex.mistakes;
  if(ex.cat==="warmup") return["الشدّ لدرجة الألم.","الحركات المفاجئة أو الارتداد.","حبس النفس."];
  if(ex.cat==="cardio") return["البدء بسرعة عالية من غير تسخين.","انحناء الظهر أو الاستناد الكامل على الجهاز.","إهمال التهدئة في الآخر."];
  const m=["وزن تقيل لدرجة إن الجسم كله يتمرجح.","النزول بسرعة من غير تحكّم.","حبس النفس أثناء المجهود."];
  if(ex.force==="push") m.push("قفل المفصل بقوة في نهاية الدفع.");
  if(ex.force==="pull") m.push("السحب بالإيدين بس من غير ما تشغّل العضلة المستهدفة.");
  return m;
}

function detectCategory(ex){
  const name=String(ex.name||"").toLowerCase();
  const type=String(ex.category||"").toLowerCase();
  const text=name+" "+(ex.primaryMuscles||[]).join(" ").toLowerCase();
  if(type==="cardio"||/treadmill|running|cycling|bike|bicycle|elliptical|stair|jump rope|rope jumping|walking/.test(name)) return"cardio";
  if(type==="stretching"||/stretch|mobility|warm.?up|arm circle|shoulder roll/.test(name)) return"warmup";
  if(/abdominals|crunch|sit.?up|plank|russian twist|leg raise/.test(text)) return"abs";
  if(/chest|bench press|push.?up|pushup|fly|flye|crossover/.test(text)) return"chest";
  if(/lats|middle back|lower back|pulldown|pull.?up|row|deadlift/.test(text)) return"back";
  if(/quadriceps|hamstrings|glutes|calves|adductors|abductors|squat|leg press|lunge/.test(text)) return"legs";
  if(/shoulder|traps|neck|military press|lateral raise|deltoid/.test(text)) return"shoulders";
  if(/triceps|pushdown|skullcrusher/.test(text)) return"triceps";
  if(/biceps|forearms|curl/.test(text)) return"biceps";
  return"legs";
}

/* =========================================================
   4) نظام إدارة الرياضات الـ 18 وتسجيل الدخول المباشر
   ========================================================= */
function getCatName(catId) {
  if (CATEGORY_NAMES[catId]) return CATEGORY_NAMES[catId];
  if (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.categories) {
    for (const sp in window.CAP_SPORTS_DATA.categories) {
      const found = window.CAP_SPORTS_DATA.categories[sp].find(c => c.id === catId);
      if (found) return found.name;
    }
  }
  return catId;
}

function getAllInitialExercises() {
  const map = new Map();
  // 1. التمارين الأساسية المحلية للجيم (117 تمرين)
  CUSTOM_EXERCISES.forEach(ex => { if(ex && ex.id) map.set(ex.id, ex); });
  // 2. تمارين الكارديو والتسخين الإضافية المحلية (159 تمرين لإكمال الـ 276 تمرين بالكامل)
  if (window.GYM_EXTRA_EXERCISES && Array.isArray(window.GYM_EXTRA_EXERCISES)) {
    window.GYM_EXTRA_EXERCISES.forEach(ex => { if(ex && ex.id) map.set(ex.id, ex); });
  }
  // 3. تمارين الرياضات الشاملة (18 رياضة)
  if (window.CAP_SPORTS_DATA && Array.isArray(window.CAP_SPORTS_DATA.exercises)) {
    window.CAP_SPORTS_DATA.exercises.forEach(ex => { if(ex && ex.id) map.set(ex.id, ex); });
  }
  // 4. تمارين المدربين المخصصة المحفوظة محلياً
  try {
    const userCustom = JSON.parse(localStorage.getItem(CUSTOM_EXERCISES_USER_KEY)) || [];
    if (Array.isArray(userCustom)) {
      userCustom.forEach(ex => { if(ex && ex.id) map.set(ex.id, ex); });
    }
  } catch(e) {}
  return Array.from(map.values());
}

function renderSportCategories(sportId) {
  const catsBox = $("#cats");
  if (!catsBox) return;
  const cfg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs && window.CAP_SPORTS_DATA.configs[sportId]) || { name: "تمارين رياضية", icon: "fa-dumbbell" };
  const catList = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.categories && window.CAP_SPORTS_DATA.categories[sportId]) || [];
  
  if (sportId === "gym" || !catList.length) {
    const gymCats = [
      { id:"chest", name:"الصدر", icon:"fa-heart-pulse" },
      { id:"back", name:"الظهر", icon:"fa-dumbbell" },
      { id:"legs", name:"الرجل", icon:"fa-person-walking" },
      { id:"shoulders", name:"الكتف", icon:"fa-shield-halved" },
      { id:"biceps", name:"بايسبس", icon:"fa-hand-fist" },
      { id:"triceps", name:"ترايسبس", icon:"fa-bolt" },
      { id:"abs", name:"بطن", icon:"fa-fire" }
    ];
    catsBox.innerHTML = gymCats.map((c, i) => `
      <button class="cat" type="button" data-cat="${c.id}">
        <span class="cat-no">${String(i+1).padStart(2,"0")}</span>
        <span class="ci"><i class="fa-solid ${c.icon}"></i></span>
        <b>${c.name}</b>
        <span class="cn" data-count="${c.id}">—</span>
        <i class="fa-solid fa-arrow-left go"></i>
      </button>
    `).join("");
  } else {
    catsBox.innerHTML = catList.map((c, i) => `
      <button class="cat" type="button" data-cat="${c.id}">
        <span class="cat-no">${String(i+1).padStart(2,"0")}</span>
        <span class="ci"><i class="fa-solid ${c.icon}"></i></span>
        <b>${c.name}</b>
        <span class="cn" data-count="${c.id}">—</span>
        <i class="fa-solid fa-arrow-left go"></i>
      </button>
    `).join("");
  }
  
  const titleEl = $("#secCatsTitle");
  if (titleEl) titleEl.textContent = `أقسام: ${cfg.name}`;
  const subEl = $("#secCatsSub");
  if (subEl) subEl.textContent = `SPORT: ${sportId.toUpperCase()} • CHOOSE CATEGORY`;

  updateCounts();
}

function renderSportSwitcher() {
  const pillsBox = document.getElementById("sportPills");
  if (!pillsBox) return;

  const cfgs = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs) || {};
  pillsBox.innerHTML = Object.keys(cfgs).map(id => {
    const s = cfgs[id];
    const active = state.currentSport === id;
    return `
      <button type="button" class="sport-pill ${active ? 'active' : ''}" data-sport="${id}">
        <i class="fa-solid ${s.icon}"></i>
        <span>${s.name}</span>
      </button>
    `;
  }).join("");

  const activeCfg = cfgs[state.currentSport] || { name: "رياضة", icon: "fa-dumbbell" };
  const titleEl = document.getElementById("activeSportTitle");
  if (titleEl) {
    titleEl.innerHTML = `<i class="fa-solid ${activeCfg.icon} gold"></i> <span>رياضة: ${activeCfg.name}</span>`;
  }
}

function setSport(sportId) {
  if (state.coach !== "MASTER ADMIN" && state.coachSport && state.coachSport !== "all") {
    sportId = state.coachSport;
  }
  state.currentSport = sportId || "gym";
  renderSportSwitcher();
  renderSportCategories(state.currentSport);
  updateCounts();
}

document.addEventListener("click", e => {
  const pill = e.target.closest(".sport-pill");
  if (pill && pill.dataset.sport) {
    setSport(pill.dataset.sport);
  }
});

function updateCoachSubscriptionDisplay(info){
  const el = document.getElementById("coachSubInfo");
  if (!el) return;
  if (!info) {
    if (state.coach === "MASTER ADMIN") {
      el.innerHTML = '<span style="color:var(--gold2);"><i class="fa-solid fa-crown"></i> حساب الأدمن الرئيسي</span>';
    } else {
      el.innerHTML = '<span style="color:#86efac;"><i class="fa-solid fa-circle-check"></i> حساب مدرب معتمد</span>';
    }
  } else {
    el.innerHTML = `<span style="color:#86efac;"><i class="fa-solid fa-clock"></i> اشتراك نشط (باقي ${info.daysLeft} يوم)</span>`;
  }
}

function showApp(name){
  state.coach=name;
  $$(".js-coach").forEach(el=>el.textContent=name);
  $("#loginScreen").hidden=true;
  $("#app").hidden=false;
  window.scrollTo(0,0);

  // الكشف عن رياضة وتخصص المدرب
  let coachSport = "gym";
  if (name !== "MASTER ADMIN") {
    try {
      const custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || [];
      const tc = custom.find(c => c.name.toUpperCase() === name.toUpperCase());
      if (tc && tc.sport) coachSport = tc.sport;
    } catch(e) {}
  }
  state.coachSport = coachSport;

  // عزل التخصص: إخفاء شريط اختيار الرياضات للمدرب المتخصص وإظهاره للأدمن فقط
  const sportBar = document.getElementById("sportBarWrap");
  if (sportBar) {
    sportBar.style.display = (name === "MASTER ADMIN" || coachSport === "all") ? "block" : "none";
  }

  // تخصيص عناوين التبويبات حسب تخصص المدرب
  const cfgs = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs) || {};
  const activeCfg = cfgs[coachSport] || { name: "كمال أجسام وجيم", icon: "fa-dumbbell" };

  const navGymBtn = document.querySelector('.nav-tab-btn[data-tab="gym"]');
  if (navGymBtn) {
    navGymBtn.innerHTML = (name === "MASTER ADMIN" || coachSport === "all")
      ? '<i class="fa-solid fa-dumbbell"></i> تمارين الجيم والرياضات'
      : `<i class="fa-solid ${activeCfg.icon}"></i> تمارين ${activeCfg.name}`;
  }

  const hubGymTab = document.querySelector('.hub-tab[data-tab="gym"]');
  if (hubGymTab) {
    const iconEl = hubGymTab.querySelector(".hub-tab-icon");
    if (iconEl) iconEl.innerHTML = `<i class="fa-solid ${(name === "MASTER ADMIN" || coachSport === "all") ? "fa-dumbbell" : activeCfg.icon}"></i>`;
    const h3El = hubGymTab.querySelector(".hub-tab-info h3");
    if (h3El) h3El.textContent = (name === "MASTER ADMIN" || coachSport === "all")
      ? "تمارين الجيم والرياضات وجدول التدريب"
      : `تمارين ${activeCfg.name} وجدول التدريب`;
    const pEl = hubGymTab.querySelector(".hub-tab-info p");
    if (pEl) pEl.textContent = (name === "MASTER ADMIN" || coachSport === "all")
      ? "الأقسام الـ 9، بناء الجدول، والمعاينة الحية والتصدير"
      : `أقسام وتكنيكات ${activeCfg.name}، بناء الجدول، والتصدير`;
  }

  const dockGymBtn = document.querySelector('[data-dock="gym"]');
  if (dockGymBtn) {
    dockGymBtn.innerHTML = `<i class="fa-solid ${(name === "MASTER ADMIN" || coachSport === "all") ? "fa-dumbbell" : activeCfg.icon}"></i>التمارين`;
  }

  // تحديث حالة الاشتراك في كارت الكابتن
  try {
    const custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || [];
    const tc = custom.find(c => c.name.toUpperCase() === name.toUpperCase());
    if (tc && tc.expiresAt) {
      const now = new Date();
      const exp = new Date(tc.expiresAt);
      const daysLeft = Math.max(0, Math.ceil((exp - now) / (1000 * 60 * 60 * 24)));
      updateCoachSubscriptionDisplay({ daysLeft, expiresAt: tc.expiresAt });
    } else {
      updateCoachSubscriptionDisplay(null);
    }
  } catch(e) {
    updateCoachSubscriptionDisplay(null);
  }

  // زر فتح لوحة تحكم الأدمن إذا كان المستخدم MASTER ADMIN
  const existingAdminBtn = document.getElementById("adminDirectPanelBtn");
  if (name === "MASTER ADMIN") {
    if (!existingAdminBtn) {
      const adminBtn = document.createElement("button");
      adminBtn.id = "adminDirectPanelBtn";
      adminBtn.type = "button";
      adminBtn.className = "btn btn-outline btn-sm btn-block";
      adminBtn.style.cssText = "margin-top:10px;font-size:11.5px;padding:9px;border-style:dashed;";
      adminBtn.innerHTML = '<i class="fa-solid fa-users-gear gold"></i> لوحة إدارة المدربين (الأدمن)';
      adminBtn.onclick = () => {
        window.__adminAuthorized = true;
        const modal = document.getElementById("adminPanelModal");
        if (modal) {
          document.getElementById("adminAuthStep").style.display = "none";
          document.getElementById("adminManageStep").style.display = "block";
          document.getElementById("adminAuthError").textContent = "";
          modal.classList.add("show");
          syncLock();
          if (typeof renderTrainersList === "function") renderTrainersList();
        }
      };
      const sideNav = document.querySelector(".nav");
      if (sideNav) sideNav.appendChild(adminBtn);
    } else {
      existingAdminBtn.style.display = "block";
    }
  } else if (existingAdminBtn) {
    existingAdminBtn.style.display = "none";
  }

  // تحميل التمارين وتفعيل التخصص الرياضي
  state.all = getAllInitialExercises();
  setSport(coachSport === "all" ? "gym" : coachSport);
  renderAll();
  if(!state.dbLoaded&&!state.loading) loadDatabase();
}

function resetProgramAndNutritionSession() {
  try {
    state.selected = [];
    if (typeof renderAll === "function") renderAll();
    const cName = $("#clientName"); if (cName) cName.value = "";
    const pTitle = $("#workoutName"); if (pTitle) pTitle.value = "";
    const cNotes = $("#coachNotes"); if (cNotes) cNotes.value = "";
    
    // مسح خطة التغذية بالكامل من الذاكرة والـ localStorage
    try { localStorage.removeItem("capEliteNutrition_v1"); } catch(e) {}
    if (typeof window.CAP_RESET_NUTRITION === "function") {
      window.CAP_RESET_NUTRITION();
    }
  } catch(e) {}
}

function showLogin(){
  resetProgramAndNutritionSession();
  $("#app").hidden=true;
  $("#loginScreen").hidden=false;
  $("#accessCode").value="";
  $("#loginError").textContent="";
}

$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const raw = ($("#accessCode").value || "").trim();
  const code = raw.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).trim(); // دعم الأرقام العربي

  // 1. الدخول كأدمن رئيسي باستخدام باسورد الأدمن المعتمد
  if (code === ADMIN_MASTER_PASS) {
    try { sessionStorage.setItem(SESSION_KEY, "MASTER ADMIN"); } catch(err) {}
    showApp("MASTER ADMIN");
    updateCoachSubscriptionDisplay(null);
    toast("مرحباً بك يا كابتن ثروت (الأدمن) 👑");
    return;
  }

  // 2. فحص المدربين المضافين مع التحقق الصارم من انتهاء الصلاحية
  let custom = [];
  try { custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || []; } catch(err) {}
  const customCoach = custom.find(c => c.code.toLowerCase() === code.toLowerCase());

  if (customCoach) {
    const now = new Date();
    const expiry = customCoach.expiresAt ? new Date(customCoach.expiresAt) : null;
    if (expiry && expiry < now) {
      const expDateStr = formatArDate(customCoach.expiresAt);
      $("#loginError").innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> عذراً يا كابتن ${customCoach.name}، انتهت صلاحية اشتراك حسابك بتاريخ (${expDateStr}).<br>يرجى التواصل مع الأدمن لتجديد الاشتراك.`;
      return;
    }
    const daysLeft = expiry ? Math.max(0, Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))) : 30;
    try { sessionStorage.setItem(SESSION_KEY, customCoach.name); } catch(err) {}
    showApp(customCoach.name);
    updateCoachSubscriptionDisplay({ daysLeft, expiresAt: customCoach.expiresAt });
    toast(`أهلاً كابتن ${customCoach.name} • اشتراكك ساري (متبقي ${daysLeft} يوم) ✅`);
    return;
  }

  // 3. فحص المدربين الأساسيين
  let demoCoach = DEMO_COACHES.find(c => c.code.toLowerCase() === code.toLowerCase());
  if (demoCoach) {
    try { sessionStorage.setItem(SESSION_KEY, demoCoach.name); } catch(err) {}
    showApp(demoCoach.name);
    updateCoachSubscriptionDisplay(null);
    return;
  }

  $("#loginError").textContent = "رمز الدخول غير صحيح. تأكد من إدخال الرمز الخاص بك بشكل سليم.";
});

$("#toggleCode").addEventListener("click",()=>{
  const i=$("#accessCode"),show=i.type==="password";
  i.type=show?"text":"password";
  $("#toggleCode i").className=show?"fa-solid fa-eye-slash":"fa-solid fa-eye";
});

$$(".js-logout").forEach(b=>b.addEventListener("click",()=>{
  try{sessionStorage.removeItem(SESSION_KEY);}catch(err){}
  resetProgramAndNutritionSession();
  showLogin();
  toast("تم تسجيل الخروج بنجاح 👋");
}));

function switchMainTab(tab){
  const gymView = document.getElementById("viewGym");
  const nutView = document.getElementById("viewNutrition");
  if (!gymView || !nutView) return;

  const isGym = tab === "gym";
  gymView.style.display = isGym ? "block" : "none";
  nutView.style.display = isGym ? "none" : "block";

  document.querySelectorAll(".hub-tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
  document.querySelectorAll("[data-dock]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.dock === tab);
  });
}

function setActiveNav(id){
  $$("[data-go]").forEach(b=>b.classList.toggle("active",b.dataset.go===id));
}

document.addEventListener("click", e => {
  const hubBtn = e.target.closest(".hub-tab");
  if (hubBtn && hubBtn.dataset.tab) {
    e.preventDefault();
    switchMainTab(hubBtn.dataset.tab);
    return;
  }
  const sideTabBtn = e.target.closest(".nav-tab-btn");
  if (sideTabBtn && sideTabBtn.dataset.tab) {
    e.preventDefault();
    switchMainTab(sideTabBtn.dataset.tab);
    return;
  }
  const dockBtn = e.target.closest("[data-dock]");
  if (dockBtn && dockBtn.dataset.dock) {
    e.preventDefault();
    switchMainTab(dockBtn.dataset.dock);
    return;
  }
});

$$("[data-go]").forEach(b=>b.addEventListener("click",()=>{
  const targetId = b.dataset.go;
  if(targetId === "secNutrition") {
    switchMainTab("nutrition");
  } else {
    switchMainTab("gym");
  }
  setTimeout(()=>{
    const sec=document.getElementById(targetId);
    if(sec) sec.scrollIntoView({behavior:"smooth",block:"start"});
    setActiveNav(targetId);
  }, 50);
}));
$$(".js-top").forEach(b=>b.addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"});setActiveNav("secCats");}));
$$(".js-export").forEach(b=>b.addEventListener("click",()=>$("#exportBtn").click()));
$$(".js-pdf").forEach(b=>b.addEventListener("click",()=>$("#exportPdfBtn").click()));

function setDb(text,type){
  $("#dbText").textContent=text;
  $("#dbDot").className="dot"+(type?" "+type:"");
  $("#dbRetry").hidden=type!=="err";
}

function updateCounts(){
  const counts={};
  state.all.forEach(ex=>{
    if (state.currentSport === "gym") {
      if (!ex.sport || ex.sport === "gym") counts[ex.cat]=(counts[ex.cat]||0)+1;
    } else {
      if (ex.sport === state.currentSport) counts[ex.cat]=(counts[ex.cat]||0)+1;
    }
  });
  $$("[data-count]").forEach(el=>el.textContent=(counts[el.dataset.count]||0)+" تمرين");
  const gymCount = state.all.filter(e => !e.sport || e.sport === "gym").length;
  const currentSportCount = state.currentSport === "gym" ? gymCount : state.all.filter(e => e.sport === state.currentSport).length;
  const hc=$("#heroCount"); if(hc) hc.textContent = currentSportCount;
}

async function loadDatabase(){
  if(state.loading) return;
  state.loading=true;
  setDb("جاري فحص وتحديث التمارين...","");
  let data=null;
  for(const url of DB_URLS){
    try{
      const res=await fetch(url,{cache:"force-cache"});
      if(!res.ok) throw new Error("HTTP "+res.status);
      data=await res.json();
      if(data) break;
    }catch(err){}
  }
  state.loading=false;
  if(!data){
    if(!state.all.length) state.all=getAllInitialExercises();
    state.dbLoaded=true;
    updateCounts();
    setDb(`التمارين جاهزة ومحمّلة محلياً بالكامل (${state.all.length} تمرين) — اضغط على أي قسم.`,"ok");
    if($("#picker").classList.contains("show")) renderPicker();
    return;
  }
  const list=Array.isArray(data)?data:(data.exercises||[]);
  const fetched=list
    .filter(ex=>ex&&ex.id&&ex.name&&Array.isArray(ex.images)&&ex.images.length)
    .map(ex=>Object.assign({},ex,{cat:detectCategory(ex)}))
    .filter(ex=>ex.cat==="cardio"||ex.cat==="warmup");
  const currentMap = new Map();
  getAllInitialExercises().forEach(ex => currentMap.set(ex.id, ex));
  fetched.forEach(ex => {
    if(!currentMap.has(ex.id)) currentMap.set(ex.id, ex);
  });
  state.all = Array.from(currentMap.values());
  state.dbLoaded=true;
  updateCounts();
  setDb(`التمارين جاهزة (${state.all.length} تمرين) — اضغط على أي قسم.`,"ok");
  renderAll();
  if($("#picker").classList.contains("show")) renderPicker();
}
$("#dbRetry").addEventListener("click",loadDatabase);

function syncLock(){
  const po=document.getElementById("pdfOut");
  const open=$("#picker").classList.contains("show")||$("#detail").classList.contains("show")||!$("#viewer").hidden||!!(po&&!po.hidden);
  document.body.classList.toggle("lock",open);
}
function openPicker(cat){
  state.cat=cat; state.visible=30;
  $("#pickerTitle").textContent="تمارين "+getCatName(cat);
  $("#pickerSearch").value="";
  $("#picker").classList.add("show");
  syncLock();
  renderPicker();
  $("#pickerList").scrollTop=0;
}
function closePicker(){$("#picker").classList.remove("show");syncLock();}
function closeDetail(){$("#detail").classList.remove("show");state.detailId=null;syncLock();}
function closeViewer(){$("#viewer").hidden=true;syncLock();}

$("#cats").addEventListener("click",e=>{
  const b=e.target.closest("[data-cat]");
  if(b) openPicker(b.dataset.cat);
});
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>b.dataset.close==="picker"?closePicker():closeDetail()));
$("#picker").addEventListener("click",e=>{if(e.target===e.currentTarget) closePicker();});
$("#detail").addEventListener("click",e=>{if(e.target===e.currentTarget) closeDetail();});
$("#viewerClose").addEventListener("click",closeViewer);

function renderPicker(){
  const box=$("#pickerList");
  if(!state.all.length){
    box.innerHTML=`<div class="empty"><i class="fa-solid fa-circle-notch fa-spin"></i> جاري تحميل التمارين...</div>`;
    $("#pickerCount").textContent="";
    return;
  }
  const q=$("#pickerSearch").value.trim().toLowerCase();
  const matches=state.all.filter(ex=>ex.cat===state.cat&&(!q||(ex.name+" "+arName(ex)).toLowerCase().includes(q)));
  $("#pickerCount").textContent=matches.length+" تمرين متاح في هذا القسم";
  if(!matches.length){
    box.innerHTML=`<div class="empty"><i class="fa-solid fa-magnifying-glass"></i> لا توجد تمارين مطابقة</div>`;
    return;
  }
  let html=matches.slice(0,state.visible).map(ex=>{
    const added=isSel(ex.id);
    const lvl=ex.level?`<span class="pk-lvl">${LEVEL_NAMES[ex.level]||esc(ex.level)}${EQUIPMENT_NAMES[ex.equipment]?" • "+EQUIPMENT_NAMES[ex.equipment]:""}</span>`:"";
    return`<div class="pk">
      ${exVisualHTML(ex, `data-act="detail" data-id="${esc(ex.id)}"`)}
      ${ex.sport && ex.sport !== "gym" ? "" : mapHTML(ex)}
      <div style="min-width:0">
        <div class="pk-name">${esc(arName(ex))}</div>
        <div class="pk-en">${esc(ex.name)}</div>
        ${lvl}
        ${tagsHTML(ex)}
        <div class="pk-ben">${esc(shortBenefit(ex))}</div>
      </div>
      <div class="pk-btns">
        <button class="btn btn-gold btn-sm" type="button" data-act="add" data-id="${esc(ex.id)}" ${added?"disabled":""}>${added?'<i class="fa-solid fa-check"></i> تم':'<i class="fa-solid fa-plus"></i> إضافة'}</button>
        <button class="btn btn-ghost btn-sm" type="button" data-act="detail" data-id="${esc(ex.id)}"><i class="fa-solid fa-circle-info"></i> تفاصيل</button>
      </div>
    </div>`;
  }).join("");
  if(matches.length>state.visible){
    html+=`<button class="btn btn-outline more" type="button" data-act="more">عرض المزيد (${matches.length-state.visible} متبقي)</button>`;
  }
  box.innerHTML=html;
}

$("#pickerList").addEventListener("click",e=>{
  const el=e.target.closest("[data-act]");
  if(!el) return;
  const act=el.dataset.act,id=el.dataset.id;
  if(act==="add") addEx(id);
  else if(act==="detail") openDetail(id);
  else if(act==="more"){state.visible+=30;renderPicker();}
});
$("#pickerSearch").addEventListener("input",()=>{state.visible=30;renderPicker();});

function openDetail(id){
  const ex=findEx(id);
  if(!ex) return;
  state.detailId=id;
  $("#detailTitle").textContent=arName(ex);
  $("#detailSub").textContent=ex.name;
  const imgN=(ex.images||[]).length;
  const map=muscleImage(ex);
  const infos=[
    ex.level&&`<span class="info"><i class="fa-solid fa-signal"></i><small>المستوى:</small> ${LEVEL_NAMES[ex.level]||esc(ex.level)}</span>`,
    ex.equipment&&`<span class="info"><i class="fa-solid fa-dumbbell"></i><small>الأداة:</small> ${EQUIPMENT_NAMES[ex.equipment]||esc(ex.equipment)}</span>`,
    ex.mechanic&&`<span class="info"><i class="fa-solid fa-gears"></i><small>النوع:</small> ${MECHANIC_NAMES[ex.mechanic]||esc(ex.mechanic)}</span>`,
    `<span class="info"><i class="fa-solid fa-layer-group"></i><small>القسم:</small> ${getCatName(ex.cat)||"تمرين"}</span>`
  ].filter(Boolean).join("");
  const li=arr=>arr.map(s=>`<li>${esc(s)}</li>`).join("");
  const hasImgs = Boolean(ex.images && ex.images.length && (ex.sport === "gym" || !ex.sport));
  const sportId = (ex && ex.sport) || state.currentSport || "gym";
  const cfg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs && window.CAP_SPORTS_DATA.configs[sportId]) || { icon: "fa-dumbbell", name: "رياضة" };
  const dimgsHTML = hasImgs
    ? `<div class="dimgs ${imgN>1?"":"one"}">
        ${(ex.images||[]).slice(0,2).map((_,k)=>`<figure><img ${imgAttrs(ex,k)}><figcaption>وضعية ${k+1}</figcaption></figure>`).join("")}
      </div>`
    : `<div class="dimgs one">
        <div class="pk-icon-badge" style="width:100%;height:180px;border-radius:12px;font-size:48px;display:flex;flex-direction:column;gap:8px;"><i class="fa-solid ${cfg.icon}"></i><span style="font-size:14px;font-weight:700;">${cfg.name}</span></div>
      </div>`;

  $("#detailBody").innerHTML=`
    <div class="dtop">
      ${dimgsHTML}
      <div>
        ${(hasImgs && map)?`<div class="dmap"><img src="${map}" alt=""></div><div class="legend"><span class="p">عضلة أساسية</span><span class="s">عضلة مساعدة</span></div>`:""}
        ${tagsHTML(ex)}
      </div>
    </div>
    <div class="infos">${infos}</div>
    <div class="dsec"><h3><i class="fa-solid fa-bullseye"></i> التمرين ده بيعمل إيه في الجسم؟</h3>${esc(benefit(ex))}</div>
    <div class="dsec"><h3><i class="fa-solid fa-person-chalkboard"></i> طريقة الأداء خطوة بخطوة</h3><ol>${li(howTo(ex))}</ol></div>
    <div class="dsec"><h3><i class="fa-solid fa-lightbulb"></i> نصائح مهمة</h3><ul class="ok">${li(tips(ex))}</ul></div>
    <div class="dsec"><h3><i class="fa-solid fa-triangle-exclamation"></i> أخطاء شائعة تجنّبها</h3><ul class="bad">${li(mistakes(ex))}</ul></div>
  `;
  updateDetailAction();
  $("#detail").classList.add("show");
  $("#detailBody").scrollTop=0;
  syncLock();
}

function updateDetailAction(){
  if(!state.detailId) return;
  const b=$("#detailAction"),added=isSel(state.detailId);
  b.className="btn btn-block "+(added?"btn-danger":"btn-gold");
  b.innerHTML=added?'<i class="fa-solid fa-trash"></i> إزالة من البرنامج':'<i class="fa-solid fa-plus"></i> إضافة للبرنامج';
}
$("#detailAction").addEventListener("click",()=>{
  const id=state.detailId;
  if(!id) return;
  if(isSel(id)) removeEx(id); else addEx(id);
});

function addEx(id){
  if(!id||isSel(id)) return;
  state.selected.push({id,sets:3,reps:12,rest:60});
  renderAll();
  toast("تمت إضافة التمرين 🔥");
}
function removeEx(id){
  state.selected=state.selected.filter(s=>s.id!==id);
  renderAll();
}
function moveEx(i,dir){
  const j=i+dir;
  if(j<0||j>=state.selected.length) return;
  const a=state.selected;
  [a[i],a[j]]=[a[j],a[i]];
  renderAll();
}

function renderSelected(){
  const box=$("#selList");
  $("#clearAll").hidden=!state.selected.length;
  if(!state.selected.length){
    box.innerHTML=`<div class="empty"><i class="fa-solid fa-dumbbell"></i> لم تضف أي تمرين بعد<small>اختر قسمًا من الأعلى ثم أضف التمارين.</small></div>`;
    return;
  }
  const last=state.selected.length-1;
  box.innerHTML=state.selected.map((it,i)=>{
    const ex=findEx(it.id);
    if(!ex) return"";
    return`<div class="sel">
      ${exVisualHTML(ex)}
      <div style="min-width:0">
        <div class="sel-name"><span class="num">${i+1}</span><span>${esc(arName(ex))}</span></div>
        <div class="ctrls">
          <label>مجموعات <input class="mini" type="number" min="1" inputmode="numeric" data-i="${i}" data-f="sets" value="${it.sets}"></label>
          <label>تكرار <input class="mini" type="number" min="1" inputmode="numeric" data-i="${i}" data-f="reps" value="${it.reps}"></label>
          <label>راحة (ث) <input class="mini" type="number" min="0" inputmode="numeric" data-i="${i}" data-f="rest" value="${it.rest}"></label>
        </div>
      </div>
      <div class="sel-acts">
        <button class="icon-btn" type="button" data-act="up" data-i="${i}" ${i===0?"disabled":""} aria-label="لفوق"><i class="fa-solid fa-arrow-up"></i></button>
        <button class="icon-btn" type="button" data-act="info" data-i="${i}" aria-label="تفاصيل"><i class="fa-solid fa-circle-info"></i></button>
        <button class="icon-btn" type="button" data-act="down" data-i="${i}" ${i===last?"disabled":""} aria-label="لتحت"><i class="fa-solid fa-arrow-down"></i></button>
        <button class="icon-btn del" type="button" data-act="del" data-i="${i}" aria-label="حذف"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }).join("");
}

$("#selList").addEventListener("click",e=>{
  const b=e.target.closest("[data-act]");
  if(!b||b.disabled) return;
  const i=+b.dataset.i,it=state.selected[i];
  if(!it) return;
  if(b.dataset.act==="up") moveEx(i,-1);
  else if(b.dataset.act==="down") moveEx(i,1);
  else if(b.dataset.act==="del") removeEx(it.id);
  else if(b.dataset.act==="info") openDetail(it.id);
});

$("#selList").addEventListener("input",e=>{
  const inp=e.target.closest(".mini");
  if(!inp) return;
  const it=state.selected[+inp.dataset.i];
  if(!it) return;
  const f=inp.dataset.f,n=parseInt(inp.value,10);
  it[f]=f==="rest"?Math.max(0,isNaN(n)?0:n):Math.max(1,isNaN(n)?1:n);
  renderPreview();
});

$("#clearAll").addEventListener("click",()=>{
  if(!state.selected.length) return;
  if(!confirm("متأكد إنك عايز تمسح كل التمارين؟")) return;
  state.selected=[];
  renderAll();
  toast("تم مسح كل التمارين");
});

function getStats(){
  return { total: state.selected.length, cardio: 0, strength: state.selected.length };
}

function renderStats(){
  const s=getStats();
  $("#stTotal").textContent=s.total;
  $("#stStrength").textContent=s.strength;
  $("#stCardio").textContent=s.cardio;
  $$(".js-count").forEach(el=>el.textContent=s.total);
  $$(".js-count-badge").forEach(el=>{el.textContent=s.total;el.hidden=!s.total;});
  const bar=$("#sideBar");
  if(bar) bar.style.width=Math.min(100,(s.total/TARGET_EXERCISES)*100)+"%";
}

function renderPhoto(){
  const html=state.photo?`<img src="${state.photo}" alt="">`:"ع";
  $("#avatarIn").innerHTML=html;
  $("#pvAvatar").innerHTML=html;
}

function handlePhoto(file){
  if(!file||!/^image\//.test(file.type)) return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      try{
        const r=Math.min(1,400/Math.max(img.width,img.height));
        const c=document.createElement("canvas");
        c.width=Math.round(img.width*r); c.height=Math.round(img.height*r);
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        state.photo=c.toDataURL("image/jpeg",0.9);
      }catch(err){state.photo=ev.target.result;}
      renderPhoto();
    };
    img.onerror=()=>{state.photo=ev.target.result;renderPhoto();};
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}

$("#avatarBtn").addEventListener("click",()=>$("#photoInput").click());
$("#choosePhoto").addEventListener("click",()=>$("#photoInput").click());
$("#photoInput").addEventListener("change",e=>{handlePhoto(e.target.files&&e.target.files[0]);e.target.value="";});
$("#removePhoto").addEventListener("click",()=>{state.photo="";renderPhoto();});

function renderPreview(){
  $("#pvWorkout").textContent=$("#workoutName").value.trim()||"برنامج تدريبي";
  $("#pvClient").textContent=$("#clientName").value.trim()||"برنامج تدريبي احترافي";
  $("#pvLevel").textContent="المستوى: "+levelName();
  const pvDateEl = $("#pvDateText");
  if (pvDateEl) pvDateEl.textContent = formatArFullDate(new Date());
  const box=$("#pvList");
  if(!state.selected.length){
    box.innerHTML=`<div class="empty" style="margin-top:14px"><i class="fa-solid fa-clipboard-list"></i> أضف تمارين لعرض البرنامج هنا</div>`;
    return;
  }
  box.innerHTML=state.selected.map((it,i)=>{
    const ex=findEx(it.id);
    if(!ex) return"";
    const hasImgs = Boolean(ex.images && ex.images.length && (ex.sport === "gym" || !ex.sport));
    return`<div class="pv">
      ${exVisualHTML(ex)}
      ${hasImgs ? mapHTML(ex,"lg") : ""}
      <div style="min-width:0">
        <div class="pv-name"><b>${i+1}.</b> ${esc(arName(ex))}</div>
        <div class="pv-sub">${CATEGORY_NAMES[ex.cat]||"تمرين"} • راحة ${it.rest} ث • <span class="en">${esc(ex.name)}</span></div>
        ${tagsHTML(ex)}
      </div>
      <div class="pv-val">${it.sets} × ${it.reps}<small>مجموعات × تكرار</small></div>
      <div class="pv-more">
        <div class="box"><h4><i class="fa-solid fa-bullseye"></i> بيعمل إيه في الجسم؟</h4>${esc(benefit(ex))}</div>
        <div class="box"><details><summary><i class="fa-solid fa-person-chalkboard"></i> طريقة الأداء <i class="fa-solid fa-chevron-down arr"></i></summary><ol>${howTo(ex).map(s=>`<li>${esc(s)}</li>`).join("")}</ol></details></div>
      </div>
    </div>`;
  }).join("");
}

function renderAll(){
  renderSelected();
  renderStats();
  renderPhoto();
  renderPreview();
  if($("#picker").classList.contains("show")) renderPicker();
  if($("#detail").classList.contains("show")) updateDetailAction();
}

$("#clientName").addEventListener("input",renderPreview);
$("#workoutName").addEventListener("input",renderPreview);
$("#levelSelect").addEventListener("change",renderPreview);

/* =========================================================
   5) محرك التصدير المحسّن (حل مشكلة الصور والتصدير نهائياً)
   ========================================================= */
function setStatus(msg,type){
  const el=$("#exportStatus");
  if(!el) return;
  el.textContent=msg||"";
  el.className="status"+(type?" "+type:"");
}

function rr(ctx,x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}

function txt(ctx,font,color,align,dir){
  ctx.font=font; ctx.fillStyle=color; ctx.textAlign=align||"right";
  try{ctx.direction=dir||"rtl";}catch(e){}
}

function fit(ctx,text,maxW){
  text=String(text||"");
  if(ctx.measureText(text).width<=maxW) return text;
  while(text.length>1&&ctx.measureText(text+"…").width>maxW) text=text.slice(0,-1);
  return text+"…";
}

function wrap(ctx,text,maxW,maxLines){
  const words=String(text||"").split(/\s+/).filter(Boolean),lines=[];
  let line="";
  for(let i=0;i<words.length;i++){
    const test=line?line+" "+words[i]:words[i];
    if(!line||ctx.measureText(test).width<=maxW) line=test;
    else{
      lines.push(line); line=words[i];
      if(lines.length===maxLines-1){line=words.slice(i).join(" ");break;}
    }
  }
  if(line) lines.push(line);
  lines.length=Math.min(lines.length,maxLines);
  if(lines.length) lines[lines.length-1]=fit(ctx,lines[lines.length-1],maxW);
  return lines;
}

async function loadFonts(){
  try{
    if(!document.fonts) return;
    await Promise.all(["900 36px Cairo","800 16px Cairo","700 14px Cairo","600 14px Cairo","900 56px Inter","800 14px Inter"]
      .map(f=>document.fonts.load(f,"CAP أبجد 123")));
  }catch(e){}
}

function isSameOrigin(url){
  try{
    const u = new URL(url, document.baseURI);
    return u.origin === window.location.origin;
  }catch(e){ return true; }
}

function loadImgElement(url, useCors){
  return new Promise(resolve=>{
    const img=new Image();
    let done=false;
    const finish=v=>{if(done)return;done=true;clearTimeout(tm);resolve(v);};
    const tm=setTimeout(()=>finish(null),10000);
    if(useCors) img.crossOrigin="anonymous";
    img.onload=()=>finish(img.naturalWidth?img:null);
    img.onerror=()=>finish(null);
    img.src=url;
  });
}

async function loadImg(urls){
  for(const url of urls){
    if(!url) continue;
    if(imgCache.has(url)) return imgCache.get(url);
    let img=null;
    if(/^data:|^blob:/i.test(url)){
      img=await loadImgElement(url, false);
    } else if(isSameOrigin(url)){
      // صورة محلية: تحميلها بـ Blob لضمان رسم الـ Canvas بدون قيود
      try{
        const res = await fetch(url, {cache:"force-cache"});
        if(res.ok){
          const blob = await res.blob();
          if(blob && blob.size > 0){
            img = await loadImgElement(URL.createObjectURL(blob), false);
          }
        }
      }catch(e){}
      if(!img) img = await loadImgElement(url, false);
    } else {
      img = await loadImgElement(url, true);
    }
    if(img){ imgCache.set(url, img); return img; }
  }
  return null;
}

/* رسم صورة التمرين كاملة 100% بدون أي قص (Contain) داخل إطار أبيض واضح */
function drawExerciseImage(ctx, img, x, y, w, h, r, label=""){
  ctx.save();
  rr(ctx, x, y, w, h, r);
  ctx.clip();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, w, h);
  if(img){
    const pad = 4;
    const k = Math.min((w - pad * 2) / img.width, (h - pad * 2) / img.height);
    const iw = img.width * k, ih = img.height * k;
    ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih);
  } else {
    ctx.fillStyle = "#18181e";
    ctx.fillRect(x, y, w, h);
    txt(ctx, "900 24px Inter, Arial", "#e0b83f", "center", "ltr");
    ctx.textBaseline = "middle";
    ctx.fillText("CAP", x + w / 2, y + h / 2);
    ctx.textBaseline = "alphabetic";
  }
  if(label){
    const bw = 54, bh = 22, bx = x + w - bw - 6, by = y + h - bh - 6;
    rr(ctx, bx, by, bw, bh, 6);
    ctx.fillStyle = "rgba(10,10,14,0.88)";
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(224,184,63,0.5)";
    ctx.stroke();
    txt(ctx, "800 10.5px Cairo, Arial", "#e0b83f", "center", "rtl");
    ctx.textBaseline = "middle";
    ctx.fillText(label, bx + bw / 2, by + bh / 2 + 1);
    ctx.textBaseline = "alphabetic";
  }
  ctx.restore();

  ctx.save();
  rr(ctx, x, y, w, h, r);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.stroke();
  ctx.restore();
}

function drawCover(ctx,img,x,y,w,h,r){
  drawExerciseImage(ctx,img,x,y,w,h,r);
}

function drawMap(ctx,ex,rightX,y,h){
  return 0;
}

function drawTags(ctx,ex,rightX,leftX,y,maxLines){
  const tags=[
    ...(ex.primaryMuscles||[]).filter(m=>MUSCLE_AR[m]).map(m=>({t:MUSCLE_AR[m],p:true})),
    ...(ex.secondaryMuscles||[]).filter(m=>MUSCLE_AR[m]).map(m=>({t:MUSCLE_AR[m],p:false}))
  ];
  const H=24,PAD=10,GAP=6;
  let cx=rightX,line=0;
  txt(ctx,"800 12px Cairo, Arial","#fff","center","rtl");
  ctx.textBaseline="middle";
  for(const tg of tags){
    const w=ctx.measureText(tg.t).width+PAD*2;
    if(cx-w<leftX&&cx!==rightX){line++;if(line>=maxLines) break;cx=rightX;}
    const ty=y+line*(H+5);
    rr(ctx,cx-w,ty,w,H,H/2); ctx.fillStyle=tg.p?"#dc2626":"#fed7aa"; ctx.fill();
    ctx.fillStyle=tg.p?"#fff":"#7c2d12"; ctx.fillText(tg.t,cx-w/2,ty+H/2+1);
    cx-=w+GAP;
  }
  ctx.textBaseline="alphabetic";
}

async function renderPage(pageItems,pageNum,totalPages,photo,allImgs,globalOffset){
  const W=1200,P=40,COVER=260,ROW=175,GAP=12;
  const statsY=COVER+18,statsH=76,rowsY=statsY+statsH+18;
  const H=rowsY+pageItems.length*(ROW+GAP)+55;
  let scale=Math.min(2,Math.sqrt((IS_IOS?12e6:32e6)/(W*H)));
  scale=Math.max(0.3,Math.min(scale,16000/H));
  const canvas=document.createElement("canvas");
  canvas.width=Math.round(W*scale); canvas.height=Math.round(H*scale);
  const ctx=canvas.getContext("2d");
  if(!ctx) throw new Error("Canvas غير مدعوم");
  ctx.scale(scale,scale);
  const client=$("#clientName").value.trim()||"عميل";
  const workout=$("#workoutName").value.trim()||"برنامج تدريبي";
  const R=W-P;

  ctx.fillStyle="#08080a"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#111114"; ctx.fillRect(0,0,W,COVER);
  const g=ctx.createRadialGradient(W*0.05,0,0,W*0.05,0,W*0.55);
  g.addColorStop(0,"rgba(224,184,63,0.22)"); g.addColorStop(1,"rgba(224,184,63,0)");
  ctx.fillStyle=g; ctx.fillRect(0,0,W,COVER);
  ctx.fillStyle="#e0b83f"; ctx.fillRect(0,COVER-3,W,3);

  const fullDateStr = formatArFullDate(new Date());
  txt(ctx,"900 13px Inter, Arial","#e0b83f","right","ltr");
  ctx.fillText("PERSONAL TRAINING PROGRAM",R,55);
  txt(ctx,"700 13px Cairo, Arial","#cbd5e1","left","rtl");
  ctx.fillText(fullDateStr,P,55);

  ctx.font="900 46px Inter, Arial";
  const a="CAP ",b="/ "+state.coach;
  const wa=ctx.measureText(a).width;
  const x0=Math.max(P,R-wa-ctx.measureText(b).width);
  txt(ctx,"900 46px Inter, Arial","#fff","left","ltr");
  ctx.fillText(a,x0,110);
  ctx.fillStyle="#e0b83f";
  ctx.fillText(fit(ctx,b,R-x0-wa),x0+wa,110);
  ctx.fillRect(R-70,130,70,3);

  txt(ctx,"900 28px Cairo, Arial","#fff","right","rtl");
  ctx.fillText(fit(ctx,workout,W-P*2-130),R-120,175);

  if(totalPages>1){
    txt(ctx,"800 13px Inter, Arial","#e0b83f","right","ltr");
    ctx.fillText(`PAGE ${pageNum} / ${totalPages}`,R,202);
  }

  const pcx=R-40,pcy=224,pr=34;
  ctx.save(); ctx.beginPath(); ctx.arc(pcx,pcy,pr,0,Math.PI*2); ctx.fillStyle="#18181e"; ctx.fill(); ctx.clip();
  if(photo){
    const k=Math.max(pr*2/photo.width,pr*2/photo.height),iw=photo.width*k,ih=photo.height*k;
    ctx.drawImage(photo,pcx-iw/2,pcy-ih/2,iw,ih);
  }else{
    txt(ctx,"900 26px Cairo, Arial","#e0b83f","center","rtl");
    ctx.textBaseline="middle"; ctx.fillText("ع",pcx,pcy+2); ctx.textBaseline="alphabetic";
  }
  ctx.restore();
  ctx.beginPath(); ctx.arc(pcx,pcy,pr,0,Math.PI*2); ctx.lineWidth=3; ctx.strokeStyle="#e0b83f"; ctx.stroke();

  txt(ctx,"900 19px Cairo, Arial","#fff","right","rtl");
  ctx.fillText(fit(ctx,"اللاعب: "+client,W-P*2-130),R-90,218);
  txt(ctx,"800 13.5px Cairo, Arial","#ffe08a","right","rtl");
  ctx.fillText("المستوى: "+levelName() + " • " + fullDateStr,R-90,240);

  const st=getStats();
  const stList=[{v:st.total,l:"التمارين"},{v:st.strength,l:"تمارين البرنامج"},{v:totalPages,l:"الصفحات"}];
  const sg=14,sw=(W-P*2-sg*2)/3;
  stList.forEach((s,i)=>{
    const sx=R-(i+1)*sw-i*sg;
    rr(ctx,sx,statsY,sw,statsH,12); ctx.fillStyle="#141418"; ctx.fill();
    ctx.lineWidth=1; ctx.strokeStyle="#333"; ctx.stroke();
    txt(ctx,"900 26px Inter, Arial","#e0b83f","center","ltr"); ctx.fillText(String(s.v),sx+sw/2,statsY+38);
    txt(ctx,"700 12px Cairo, Arial","#aaa","center","rtl"); ctx.fillText(s.l,sx+sw/2,statsY+60);
  });

  pageItems.forEach((o,localIdx)=>{
    const{it,ex}=o;
    const globalIdx=globalOffset+localIdx;
    const imgs=(allImgs&&allImgs[globalOffset+localIdx])||{};
    const img1=imgs.img1||imgs;
    const img2=imgs.img2||null;
    const y=rowsY+localIdx*(ROW+GAP),cy=y+ROW/2;

    rr(ctx,P,y,W-P*2,ROW,14); ctx.fillStyle="#141418"; ctx.fill();
    ctx.lineWidth=1; ctx.strokeStyle="#2d2d38"; ctx.stroke();

    const nSize=42;
    const nX=R-14-nSize;
    rr(ctx,nX,cy-nSize/2,nSize,nSize,10); ctx.fillStyle="#e0b83f"; ctx.fill();
    txt(ctx,"900 20px Inter, Arial","#0a0a0a","center","ltr");
    ctx.textBaseline="middle"; ctx.fillText(String(globalIdx+1),nX+nSize/2,cy+1); ctx.textBaseline="alphabetic";

    const vW=115,vH=70,vX=P+14;
    rr(ctx,vX,cy-vH/2,vW,vH,12); ctx.fillStyle="rgba(224,184,63,0.08)"; ctx.fill();
    ctx.strokeStyle="rgba(224,184,63,0.4)"; ctx.lineWidth=1.5; ctx.stroke();
    txt(ctx,"900 20px Inter, Arial","#ffe08a","center","ltr");
    ctx.fillText(`${it.sets} × ${it.reps}`,vX+vW/2,cy+2);
    txt(ctx,"700 12px Cairo, Arial","#aaa","center","rtl");
    ctx.fillText(`راحة ${it.rest} ث`,vX+vW/2,cy+24);

    const iw=145,ih=145;
    const img1X=vX+vW+14;
    const img2X=img1X+iw+10;

    const hasTwoPostures=Boolean(img2 && img2!==img1);
    if(hasTwoPostures){
      drawExerciseImage(ctx,img1,img1X,cy-ih/2,iw,ih,12,"وضعية 1");
      drawExerciseImage(ctx,img2,img2X,cy-ih/2,iw,ih,12,"وضعية 2");
    } else {
      const singleW=160;
      drawExerciseImage(ctx,img1,img1X,cy-ih/2,singleW,ih,12,"وضعية التمرين");
    }

    const tL=(hasTwoPostures?(img2X+iw):(img1X+160))+18;
    const tR=nX-16;
    const tW=Math.max(60,tR-tL);

    txt(ctx,"900 21px Cairo, Arial","#fff","right","rtl");
    ctx.fillText(fit(ctx,arName(ex),tW),tR,y+36);
    txt(ctx,"600 12px Inter, Arial","#999","right","ltr");
    ctx.fillText(fit(ctx,ex.name,tW),tR,y+56);
    drawTags(ctx,ex,tR,tL,y+68,2);
    txt(ctx,"600 12.5px Cairo, Arial","#bdbdbd","right","rtl");
    wrap(ctx,shortBenefit(ex),tW,2).forEach((ln,k)=>ctx.fillText(ln,tR,y+130+k*20));
  });

  txt(ctx,"700 12.5px Inter, Arial","#666","center","ltr");
  ctx.fillText(`CAP / ${state.coach} • PERSONAL TRAINING${totalPages>1?" • PAGE "+pageNum+"/"+totalPages:""}`,W/2,H-20);
  return canvas;
}

function dataURLToBlob(d){
  const parts=d.split(","),mime=(parts[0].match(/:(.*?);/)||[])[1]||"image/png";
  const bin=atob(parts[1]),arr=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) arr[i]=bin.charCodeAt(i);
  return new Blob([arr],{type:mime});
}

function canvasToBlob(c){
  return new Promise((res,rej)=>{
    try{
      if(c.toBlob){
        c.toBlob(b=>{
          if(b) res(b);
          else{
            try{ res(dataURLToBlob(c.toDataURL("image/png"))); }
            catch(e){ rej(new Error("تعذر تحويل الـ Canvas لملف")); }
          }
        },"image/png");
      }else{
        res(dataURLToBlob(c.toDataURL("image/png")));
      }
    }catch(e){
      try{ res(dataURLToBlob(c.toDataURL("image/png"))); }
      catch(err2){ rej(e); }
    }
  });
}

/* نافذة نتيجة التصدير الموحدة للـ PNG والـ PDF */
const outBox = document.createElement("div");
outBox.id = "pdfOut";
outBox.className = "pdf-out";
outBox.hidden = true;
document.body.appendChild(outBox);
let outUrls = [];

function closeOut(){
  outBox.hidden = true; outBox.innerHTML = "";
  outUrls.forEach(u => { try{ URL.revokeObjectURL(u); }catch(e){} });
  outUrls = [];
  syncLock();
}

function showOut(cfg){
  outUrls.forEach(u => { try{ URL.revokeObjectURL(u); }catch(e){} });
  outUrls = cfg.urls || [];
  let canShare = false;
  try{ canShare = !!(navigator.canShare && navigator.share && navigator.canShare({ files: cfg.files })); }catch(e){}
  const acts = [];
  if(canShare) acts.push(`<button class="btn btn-gold" type="button" data-oact="share"><i class="fa-solid fa-share-nodes"></i> مشاركة / حفظ في الملفات</button>`);
  
  if(cfg.kind === "pdf"){
    acts.push(`<a class="btn btn-outline" href="${cfg.fileUrl}" target="_blank" rel="noopener"><i class="fa-solid fa-up-right-from-square"></i> فتح الـ PDF</a>`);
    acts.push(`<a class="btn btn-ghost" href="${cfg.fileUrl}" download="${esc(cfg.files[0].name)}"><i class="fa-solid fa-download"></i> تحميل الـ PDF</a>`);
  } else {
    acts.push(`<button class="btn btn-outline" type="button" data-oact="dlAll"><i class="fa-solid fa-download"></i> تحميل كل الصور</button>`);
  }

  const prevHtml = cfg.previews.map((s, i) => `
    <div class="pdf-page-card">
      <img src="${s}" alt="صفحة ${i + 1}">
      ${cfg.kind === "png" ? `<a class="btn btn-ghost btn-sm" href="${s}" download="${esc(cfg.files[i].name)}"><i class="fa-solid fa-download"></i> تحميل صفحة ${i + 1}</a>` : ''}
    </div>
  `).join("");

  outBox.innerHTML = `<div class="pdf-outbox">
    <button class="mclose" type="button" data-oact="close" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>
    <h3>${esc(cfg.title)}</h3>
    <p>${esc(cfg.hint)}</p>
    <div class="pdf-outacts">${acts.join("")}</div>
    <div class="pdf-prev">${prevHtml}</div>
  </div>`;

  outBox.onclick = e => {
    const b = e.target.closest("[data-oact]");
    if(e.target === outBox){ closeOut(); return; }
    if(!b) return;
    const a = b.dataset.oact;
    if(a === "close") closeOut();
    else if(a === "share"){
      navigator.share({ files: cfg.files, title: cfg.files[0].name }).catch(err => {
        if(!err || err.name !== "AbortError") toast("تعذرت المشاركة، استخدم أزرار التحميل المباشرة.");
      });
    } else if(a === "dlAll"){
      cfg.files.forEach((f, idx) => {
        setTimeout(()=>{
          const u = URL.createObjectURL(f), el = document.createElement("a");
          el.href = u; el.download = f.name; el.style.display = "none";
          document.body.appendChild(el); el.click(); el.remove();
          setTimeout(()=>URL.revokeObjectURL(u), 15000);
        }, idx * 400);
      });
    }
  };
  outBox.hidden = false; outBox.scrollTop = 0;
  syncLock();
}

async function generatePagesCanvases(){
  await loadFonts();
  const items = state.selected.map(it=>({it,ex:findEx(it.id)})).filter(o=>o.ex);
  const photo = state.photo ? await loadImg([state.photo]) : null;
  const allImgs = await Promise.all(items.map(async o => {
    const candidateUrls1 = [imgUrl(o.ex, 0, 0), imgUrl(o.ex, 0, 1)];
    const candidateUrls2 = (o.ex.images && o.ex.images.length > 1)
      ? [imgUrl(o.ex, 1, 0), imgUrl(o.ex, 1, 1)]
      : candidateUrls1;
    const [img1, img2] = await Promise.all([loadImg(candidateUrls1), loadImg(candidateUrls2)]);
    return { img1, img2 };
  }));

  const totalPages = Math.ceil(items.length / EXERCISES_PER_PAGE);
  const canvases = [];
  for(let p = 0; p < totalPages; p++){
    const pageItems = items.slice(p * EXERCISES_PER_PAGE, (p + 1) * EXERCISES_PER_PAGE);
    const canvas = await renderPage(pageItems, p + 1, totalPages, photo, allImgs, p * EXERCISES_PER_PAGE);
    canvases.push(canvas);
  }
  return canvases;
}

async function exportPNG(){
  if(!state.selected.length){ toast("أضف تمارين أولاً"); return; }
  setStatus("جاري تجهيز صور البرنامج...", "work");
  try{
    const canvases = await generatePagesCanvases();
    const baseName = `CAP-${safeName(state.coach)}-${safeName($("#clientName").value)}`;
    const blobs = [], urls = [], files = [];

    for(let i = 0; i < canvases.length; i++){
      const blob = await canvasToBlob(canvases[i]);
      const name = canvases.length > 1 ? `${baseName}-page${i+1}.png` : `${baseName}.png`;
      const url = URL.createObjectURL(blob);
      blobs.push(blob);
      urls.push(url);
      files.push(new File([blob], name, { type: "image/png" }));
      canvases[i].width = 1; canvases[i].height = 1;
    }

    // تنزيل فوري على الكمبيوتر
    if(!IS_IOS){
      files.forEach((f, idx) => {
        setTimeout(() => {
          const u = URL.createObjectURL(f), el = document.createElement("a");
          el.href = u; el.download = f.name; el.style.display = "none";
          document.body.appendChild(el); el.click(); el.remove();
          setTimeout(() => URL.revokeObjectURL(u), 15000);
        }, idx * 350);
      });
    }

    showOut({
      kind: "png",
      title: blobs.length > 1 ? `البرنامج جاهز وتم التحميل ✅ (${blobs.length} صفحات)` : "البرنامج جاهز وتم التحميل ✅",
      hint: IS_IOS 
        ? "على iPhone: اضغط «مشاركة / حفظ في الملفات» أو اضغط مطولاً على أي صفحة لحفظها في الصور."
        : "تم بدء تنزيل الصور تلقائياً! يمكنك أيضاً تحميل كل صفحة منفردة من المعاينة بالأسفل.",
      previews: urls,
      urls,
      files
    });
    setStatus(`✅ جاهز (${blobs.length} صفحات)`, "ok");
    toast(blobs.length > 1 ? `تم تجهيز وتحميل ${blobs.length} صور ✅` : "تم تجهيز وتحميل الصورة ✅");
  }catch(err){
    console.error(err);
    setStatus("❌ تعذر تجهيز الصور: " + (err && err.message || err), "err");
    toast("❌ تعذر تجهيز الصور: " + (err && err.message || err));
  }
}

async function getJsPDF(){
  if(window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
  const sources = [
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js"
  ];
  for(const src of sources){
    try{
      await new Promise((res,rej)=>{
        const sc=document.createElement("script");
        sc.src=src; sc.async=true; sc.onload=res; sc.onerror=rej;
        document.head.appendChild(sc);
      });
      if(window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    }catch(e){}
  }
  return null;
}

async function exportPDF(){
  if(!state.selected.length){ toast("أضف تمارين أولاً"); return; }
  const lib = await getJsPDF();
  if(!lib){ toast("❌ تأكد من الاتصال بالإنترنت لتحميل مكتبة PDF"); return; }
  setStatus("جاري تجهيز ملف PDF...", "work");
  try{
    const canvases = await generatePagesCanvases();
    const previews = [];
    let pdf = null;

    for(let i = 0; i < canvases.length; i++){
      const c = canvases[i];
      const w = c.width, h = c.height;
      if(i === 0){
        pdf = new lib({ orientation: "portrait", unit: "px", format: [w, h], compress: true });
      } else {
        pdf.addPage([w, h], "portrait");
      }
      const dataUrl = c.toDataURL("image/jpeg", 0.94);
      pdf.addImage(dataUrl, "JPEG", 0, 0, w, h, undefined, "FAST");
      previews.push(dataUrl);
      c.width = 1; c.height = 1;
    }

    const fileName = `CAP-${safeName(state.coach)}-${safeName($("#clientName").value)}.pdf`;
    const blob = pdf.output("blob");
    const file = new File([blob], fileName, { type: "application/pdf" });
    const fileUrl = URL.createObjectURL(blob);

    // تنزيل فوري لملف الـ PDF على الكمبيوتر
    if(!IS_IOS){
      const el = document.createElement("a");
      el.href = fileUrl; el.download = fileName; el.style.display = "none";
      document.body.appendChild(el); el.click(); el.remove();
    }

    showOut({
      kind: "pdf",
      title: "ملف الـ PDF جاهز وتم التحميل ✅",
      hint: IS_IOS
        ? "اضغط «مشاركة / حفظ في الملفات» ثم Save to Files لحفظه على هاتفك."
        : "تم بدء تنزيل ملف PDF تلقائياً! يمكنك أيضاً فتحه أو إعادة تحميله من الأزرار.",
      previews,
      urls: [fileUrl],
      files: [file],
      fileUrl
    });
    setStatus("✅ PDF جاهز", "ok");
    toast("تم تجهيز وتحميل ملف الـ PDF بنجاح ✅");
  }catch(err){
    console.error(err);
    setStatus("❌ تعذر تجهيز PDF: " + (err && err.message || err), "err");
    toast("❌ تعذر تجهيز PDF: " + (err && err.message || err));
  }
}

async function withBusy(btn,fn){
  if(!state.selected.length){toast("أضف تمارين أولاً");return;}
  btn.classList.add("busy");
  try{await fn();}finally{btn.classList.remove("busy");}
}

if($("#exportBtn")) $("#exportBtn").addEventListener("click",()=>withBusy($("#exportBtn"),exportPNG));
if($("#exportPdfBtn")) $("#exportPdfBtn").addEventListener("click",()=>withBusy($("#exportPdfBtn"),exportPDF));
if($("#downloadBtn")) $("#downloadBtn").addEventListener("click",()=>withBusy($("#downloadBtn"),exportPNG));
if($("#shareBtn")) $("#shareBtn").addEventListener("click",()=>withBusy($("#shareBtn"),exportPNG));
if($("#openBtn")) $("#openBtn").addEventListener("click",()=>withBusy($("#openBtn"),exportPNG));

/* =========================================================
   6) موديول الأدمن وإدارة المدربين وتفعيل الاشتراكات
   ========================================================= */
function initIntegratedAdmin(){
  const loginCard = document.querySelector(".login-card");
  if(loginCard && !document.getElementById("openAdminModalBtn")){
    const box = document.createElement("div");
    box.id = "adminTriggerBox";
    box.style.cssText = "margin-top: 14px; text-align: center;";
    box.innerHTML = `
      <button type="button" id="openAdminModalBtn" class="btn btn-ghost btn-sm" style="width: 100%; font-size: 12px; padding: 10px; border: 1px dashed rgba(224,184,63,0.4); border-radius: 12px; color: var(--gold2);">
        <i class="fa-solid fa-user-shield gold"></i> لوحة إدارة وإضافة المدربين (للأدمن)
      </button>
    `;
    loginCard.appendChild(box);

    document.getElementById("openAdminModalBtn").onclick = () => {
      openAdminModal();
    };
  }

  if(document.getElementById("adminPanelModal")) return;

  const adminModal = document.createElement("div");
  adminModal.id = "adminPanelModal";
  adminModal.className = "modal top";
  adminModal.innerHTML = `
    <div class="mbox" style="max-width: 480px;">
      <button class="mclose" type="button" id="closeAdminModal" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>

      <!-- 1. شاشة التحقق بباسورد الأدمن -->
      <div id="adminAuthStep">
        <div class="mhead">
          <h2><i class="fa-solid fa-shield-halved gold"></i> لوحة تحكم الأدمن</h2>
          <p>أدخل كلمة سر الأدمن لإدارة وتفعيل اشتراكات المدربين</p>
        </div>
        <div style="padding: 20px;">
          <div class="field">
            <label><i class="fa-solid fa-lock gold"></i> كلمة سر الأدمن</label>
            <div class="pass-wrap">
              <i class="fa-solid fa-key"></i>
              <input type="password" id="adminMasterPass" placeholder="••••••••" autocomplete="off">
              <button id="toggleAdminPass" class="eye" type="button"><i class="fa-solid fa-eye"></i></button>
            </div>
          </div>
          <button class="btn btn-gold btn-block" type="button" id="verifyAdminBtn" style="margin-top: 14px; padding: 13px;">
            <i class="fa-solid fa-right-to-bracket"></i> تحقق ودخول اللوحة
          </button>
          <p id="adminAuthError" class="login-err" style="text-align: center; margin-top: 10px;"></p>
        </div>
      </div>

      <!-- 2. شاشة إدارة وإضافة المدربين بعد التحقق -->
      <div id="adminManageStep" style="display: none;">
        <div class="mhead" style="display: flex; align-items: center; justify-content: space-between; padding-inline-end: 45px;">
          <div>
            <h2><i class="fa-solid fa-users-gear gold"></i> إدارة وتفعيل المدربين</h2>
            <p>أهلاً بالأدمن (ثروت) 👑 • تحكم في الحسابات والاشتراكات</p>
          </div>
          <button type="button" id="adminLockBtn" class="btn btn-ghost btn-sm" style="font-size: 11px; padding: 4px 10px; color: #f87171;">
            <i class="fa-solid fa-lock"></i> قفل اللوحة
          </button>
        </div>

        <div style="padding: 16px 20px 24px; max-height: 75vh; overflow-y: auto;">
          <!-- فورم إضافة مدرب جديد -->
          <div style="background: #111116; border: 1px solid var(--line2); border-radius: 16px; padding: 16px; margin-bottom: 18px;">
            <h4 style="margin: 0 0 12px; color: var(--gold2); font-size: 14px; display: flex; align-items: center; gap: 7px;">
              <i class="fa-solid fa-user-plus gold"></i> إضافة مدرب جديد وتحديد الاشتراك
            </h4>

            <div class="field" style="margin-bottom: 10px;">
              <label>اسم المدرب</label>
              <input type="text" id="newCoachName" placeholder="مثال: COACH KHALED">
            </div>

            <div class="field" style="margin-bottom: 10px;">
              <label>رمز (كود) دخول المدرب</label>
              <input type="text" id="newCoachCode" placeholder="مثال: KHALED@1">
            </div>

            <div class="field" style="margin-bottom: 10px;">
              <label><i class="fa-solid fa-phone gold"></i> رقم هاتف المدرب (خاص بجرد الإدارة)</label>
              <input type="tel" id="newCoachPhone" placeholder="مثال: 01012345678" dir="ltr" style="text-align: right;">
            </div>

            <div class="field" style="margin-bottom: 10px;">
              <label><i class="fa-solid fa-trophy gold"></i> تخصص الرياضة للمدرب</label>
              <select id="newCoachSport" style="font-size: 13px;">
                <option value="gym">كمال أجسام وجيم (Gym & Fitness)</option>
                <option value="swimming">سباحة (Swimming)</option>
                <option value="kickboxing">كيك بوكسينج (Kickboxing)</option>
                <option value="boxing">ملاكمة (Boxing)</option>
                <option value="mma">فنون قتالية مختلطة (MMA)</option>
                <option value="taekwondo">تايكوندو (Taekwondo)</option>
                <option value="judo">جودو (Judo)</option>
                <option value="karate">كاراتيه (Karate)</option>
                <option value="wrestling">مصارعة (Wrestling)</option>
                <option value="football">كرة قدم (Football)</option>
                <option value="basketball">كرة سلة (Basketball)</option>
                <option value="handball">كرة يد (Handball)</option>
                <option value="volleyball">كرة طائرة (Volleyball)</option>
                <option value="tennis">تنس أرضي (Tennis)</option>
                <option value="tabletennis">تنس طاولة (Table Tennis)</option>
                <option value="weightlifting">رفع أثقال (Weightlifting)</option>
                <option value="track">مضمار وجري (Track & Running)</option>
                <option value="longjump">الوثب وألعاب قوى (Long Jump)</option>
                <option value="all">شامل جميع الرياضات (All Sports)</option>
              </select>
            </div>

            <div class="field" style="margin-bottom: 10px;">
              <label>مدة تفعيل الحساب (الاشتراك)</label>
              <select id="newCoachDuration" style="font-size: 13px;">
                <option value="30">1 شهر (30 يوم) — افتراضي</option>
                <option value="60">2 شهر (60 يوم)</option>
                <option value="90">3 شهور (90 يوم)</option>
                <option value="180">6 شهور (180 يوم)</option>
                <option value="365">1 سنة كاملة (365 يوم)</option>
                <option value="custom">مدة مخصصة بالأيام...</option>
              </select>
            </div>

            <div id="customDaysWrap" class="field" style="display: none; margin-bottom: 10px;">
              <label>عدد الأيام المخصصة</label>
              <input type="number" id="newCoachCustomDays" placeholder="اكتب عدد الأيام مثلاً 45" min="1" max="3650">
            </div>

            <div id="durationPreview" style="font-size: 11.5px; color: var(--gold); background: rgba(224,184,63,0.08); padding: 7px 12px; border-radius: 10px; margin-bottom: 12px; border: 1px solid rgba(224,184,63,0.25);">
              📅 سينتهي الاشتراك في: ...
            </div>

            <button class="btn btn-gold btn-block" type="button" id="saveCoachBtn" style="padding: 12px;">
              <i class="fa-solid fa-circle-check"></i> حفظ وإضافة المدرب وتفعيل الحساب
            </button>

            <div id="saveCoachStatus" style="margin-top: 10px; font-size: 12px; text-align: center; font-weight: 800;"></div>
          </div>

          <!-- زر تصدير تقرير شيت جرد المدربين PDF -->
          <button type="button" id="exportTrainersPdfBtn" class="btn btn-gold btn-block" style="margin-bottom: 16px; padding: 12px; font-weight: 700;">
            <i class="fa-solid fa-file-pdf"></i> تحميل شيت جرد المدربين والاشتراكات PDF
          </button>

          <!-- قائمة المدربين الحاليين -->
          <h4 style="margin: 0 0 10px; color: #fff; font-size: 13.5px; display: flex; align-items: center; justify-content: space-between;">
            <span><i class="fa-solid fa-list-check gold"></i> المدربين المعتمدين واشتراكاتهم</span>
            <small id="trainersCount" style="color: var(--muted); font-size: 11px;"></small>
          </h4>
          <div id="trainersList"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(adminModal);

  function openAdminModal(){
    document.getElementById("adminAuthError").textContent = "";
    document.getElementById("saveCoachStatus").textContent = "";
    document.getElementById("adminPanelModal").classList.add("show");
    syncLock();
    if(window.__adminAuthorized){
      showManageStep();
    } else {
      showAuthStep();
    }
  }

  function showAuthStep(){
    document.getElementById("adminAuthStep").style.display = "block";
    document.getElementById("adminManageStep").style.display = "none";
    document.getElementById("adminMasterPass").value = "";
    document.getElementById("adminAuthError").textContent = "";
  }

  function showManageStep(){
    document.getElementById("adminAuthStep").style.display = "none";
    document.getElementById("adminManageStep").style.display = "block";
    updateDurationPreview();
    renderTrainersList();
  }

  document.getElementById("closeAdminModal").onclick = () => {
    adminModal.classList.remove("show");
    syncLock();
  };
  adminModal.onclick = (e) => {
    if(e.target === adminModal){ adminModal.classList.remove("show"); syncLock(); }
  };

  document.getElementById("toggleAdminPass").onclick = () => {
    const inp = document.getElementById("adminMasterPass");
    const show = inp.type === "password";
    inp.type = show ? "text" : "password";
    document.querySelector("#toggleAdminPass i").className = show ? "fa-solid fa-eye-slash" : "fa-solid fa-eye";
  };

  document.getElementById("verifyAdminBtn").onclick = () => {
    const val = document.getElementById("adminMasterPass").value.trim();
    if(val === ADMIN_MASTER_PASS){
      window.__adminAuthorized = true;
      document.getElementById("adminAuthError").textContent = "";
      showManageStep();
      toast("تم التحقق بنجاح ✅ أهلاً بك في لوحة تحكم الأدمن");
    } else {
      document.getElementById("adminAuthError").textContent = "❌ كلمة سر الأدمن غير صحيحة! تأكد من إدخالها بالشكل السليم.";
    }
  };

  document.getElementById("adminMasterPass").addEventListener("keydown", e => {
    if(e.key === "Enter") document.getElementById("verifyAdminBtn").click();
  });

  document.getElementById("adminLockBtn").onclick = () => {
    window.__adminAuthorized = false;
    showAuthStep();
    toast("تم قفل لوحة الأدمن 🔒");
  };

  function getSelectedDays(){
    const sel = document.getElementById("newCoachDuration").value;
    if(sel === "custom"){
      const cVal = parseInt(document.getElementById("newCoachCustomDays").value, 10);
      return (isNaN(cVal) || cVal < 1) ? 30 : cVal;
    }
    return parseInt(sel, 10) || 30;
  }

  function getDurationLabel(days){
    if(days === 30) return "1 شهر (30 يوم)";
    if(days === 60) return "2 شهر (60 يوم)";
    if(days === 90) return "3 شهور (90 يوم)";
    if(days === 180) return "6 شهور (180 يوم)";
    if(days === 365) return "1 سنة (365 يوم)";
    return `${days} يوم`;
  }

  function updateDurationPreview(){
    const days = getSelectedDays();
    const expDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const box = document.getElementById("durationPreview");
    if(box){
      box.innerHTML = `📅 <b>سينتهي الاشتراك في:</b> ${formatArDate(expDate)} (بعد ${days} يوم)`;
    }
  }

  document.getElementById("newCoachDuration").addEventListener("change", e => {
    const isCustom = e.target.value === "custom";
    document.getElementById("customDaysWrap").style.display = isCustom ? "block" : "none";
    updateDurationPreview();
  });
  document.getElementById("newCoachCustomDays").addEventListener("input", updateDurationPreview);

  document.getElementById("saveCoachBtn").onclick = () => {
    const name = document.getElementById("newCoachName").value.trim().toUpperCase();
    const code = document.getElementById("newCoachCode").value.trim();
    const statusBox = document.getElementById("saveCoachStatus");

    if(!name || !code){
      statusBox.innerHTML = '<span style="color:#f87171;">❌ اكتب اسم المدرب ورمز الدخول أولاً!</span>';
      return;
    }

    let custom = [];
    try { custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || []; } catch(e){}

    if(custom.some(c => c.code.toLowerCase() === code.toLowerCase()) || DEMO_COACHES.some(c => c.code.toLowerCase() === code.toLowerCase())){
      statusBox.innerHTML = '<span style="color:#f87171;">❌ الرمز ده مسجل لمدرب آخر بالفعل، اختر رمزاً مختلفاً!</span>';
      return;
    }

    const days = getSelectedDays();
    const durationLabel = getDurationLabel(days);
    const now = new Date();
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    const sportEl = document.getElementById("newCoachSport");
    const sportVal = sportEl ? sportEl.value : "gym";
    const spCfg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs && window.CAP_SPORTS_DATA.configs[sportVal]) || { name: "رياضة" };
    const sportName = sportVal === "all" ? "شامل جميع الرياضات" : spCfg.name;

    const phone = (document.getElementById("newCoachPhone")?.value || "").trim();
    const newCoach = {
      name: name,
      phone: phone,
      code: code,
      sport: sportVal,
      sportName: sportName,
      durationDays: days,
      durationLabel: durationLabel,
      createdAt: now.toISOString(),
      expiresAt: expiresAt
    };

    custom.push(newCoach);
    localStorage.setItem(CUSTOM_TRAINERS_KEY, JSON.stringify(custom));
    syncCustomCoaches();

    document.getElementById("newCoachName").value = "";
    document.getElementById("newCoachPhone").value = "";
    document.getElementById("newCoachCode").value = "";
    document.getElementById("newCoachCustomDays").value = "";

    const expStr = formatArDate(expiresAt);
    statusBox.innerHTML = `<span style="color:#86efac;">🎉 تم إضافة المدرب (${name}) بنجاح!<br>✅ الرياضة: (${sportName}) • تم تفعيل حسابه لمدة (${durationLabel}) حتى تاريخ (${expStr}).</span>`;

    renderTrainersList();
    toast(`تم إضافة وتفعيل المدرب ${name} بنجاح! 🎉`);
  };

  function renderTrainersList(){
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || []; } catch(e){}
    const box = document.getElementById("trainersList");
    const countEl = document.getElementById("trainersCount");
    if(!box) return;

    if(countEl) countEl.textContent = `${custom.length} مدرب مسجل`;

    if(!custom.length){
      box.innerHTML = "<div style='color:#666; font-size:12px; text-align:center; padding:16px; border:1px dashed var(--line); border-radius:12px;'>لا يوجد مدربين إضافيين مضافين حتى الآن.<br>استخدم النموذج أعلاه لإضافة أول مدرب وتحديد مدة اشتراكه.</div>";
      return;
    }

    const now = new Date();
    box.innerHTML = "<div style='display:flex; flex-direction:column; gap:8px;'>" +
      custom.map((c, i) => {
        const exp = c.expiresAt ? new Date(c.expiresAt) : null;
        const isExpired = exp && exp < now;
        const daysLeft = exp ? Math.max(0, Math.ceil((exp - now) / (1000 * 60 * 60 * 24))) : 0;
        const expStr = exp ? formatArDate(c.expiresAt) : "غير محدد";
        const cSportCfg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs && window.CAP_SPORTS_DATA.configs[c.sport || 'gym']) || { icon: 'fa-dumbbell', name: 'جيم' };
        const badgeIcon = c.sport === 'all' ? 'fa-crown' : cSportCfg.icon;

        return `
          <div style="background:#15151c; border:1px solid ${isExpired ? 'rgba(239,68,68,0.4)' : 'var(--line)'}; border-radius:14px; padding:12px 14px;">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
              <div>
                <b style="font-size:14px; color:#fff;">${c.name}</b>
                <span style="font-size:12px; color:var(--gold2); margin-inline-start:8px; font-family:'Inter',sans-serif; background:#0b0b0f; padding:2px 8px; border-radius:6px; border:1px solid rgba(224,184,63,0.3);">
                  ${c.code}
                </span>
                <span class="coach-sport-badge" style="margin-inline-start:6px;">
                  <i class="fa-solid ${badgeIcon} gold"></i>
                  ${c.sportName || "كمال أجسام وجيم"}
                </span>
              </div>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn btn-outline btn-sm" style="font-size:10.5px; padding:3px 8px;" onclick="window.__renewTrainer(${i}, 30)" title="تجديد شهر إضافي">
                  <i class="fa-solid fa-rotate-right"></i> +شهر
                </button>
                <button type="button" class="btn btn-outline btn-sm" style="font-size:10.5px; padding:3px 8px;" onclick="window.__renewTrainer(${i}, 90)" title="تجديد 3 شهور">
                  <i class="fa-solid fa-rotate-right"></i> +3 شهور
                </button>
                <button type="button" style="border:none; background:rgba(239,68,68,0.15); color:#fca5a5; border-radius:8px; width:28px; height:28px; display:grid; place-items:center; cursor:pointer;" onclick="window.__delT(${i})" title="حذف المدرب">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <div style="font-size:12px; color:var(--text2); margin-top:6px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              ${c.phone ? `<span style="display:inline-flex;align-items:center;gap:4px;color:var(--gold2);"><i class="fa-solid fa-phone" style="font-size:11px;"></i> <span dir="ltr"><b>${c.phone}</b></span></span>` : '<span style="color:var(--muted); font-size:11px;">(بدون رقم هاتف)</span>'}
              <span style="color:var(--muted); font-size:11px;">• مسجل منذ ${Math.max(0, Math.floor((now - new Date(c.createdAt || now))/(1000*60*60*24)))} يوم (بتاريخ: ${c.createdAt ? formatArDate(c.createdAt) : "—"})</span>
            </div>

            <div style="margin-top:8px; display:flex; align-items:center; justify-content:space-between; font-size:11.5px; flex-wrap:wrap; gap:6px;">
              <div>
                ${isExpired 
                  ? `<span style="color:#f87171; font-weight:800;"><i class="fa-solid fa-circle-xmark"></i> منتهي الصلاحية</span> • انتهى في: ${expStr}`
                  : `<span style="color:#86efac; font-weight:800;"><i class="fa-solid fa-circle-check"></i> نشط (باقي ${daysLeft} يوم)</span> • ينتهي: ${expStr}`
                }
              </div>
              <span style="color:var(--muted); font-size:10.5px;">المدة: ${c.durationLabel || (c.durationDays + ' يوم')}</span>
            </div>
          </div>
        `;
      }).join("") + "</div>";

    const pdfBtn = document.getElementById("exportTrainersPdfBtn");
    if(pdfBtn) pdfBtn.onclick = exportTrainersInventoryPDF;
  }

  window.__renewTrainer = function(i, extraDays){
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || []; } catch(e){}
    if(!custom[i]) return;

    const currentExp = custom[i].expiresAt ? new Date(custom[i].expiresAt) : new Date();
    const baseDate = currentExp < new Date() ? new Date() : currentExp;
    const newExp = new Date(baseDate.getTime() + extraDays * 24 * 60 * 60 * 1000);

    custom[i].expiresAt = newExp.toISOString();
    custom[i].durationDays = (custom[i].durationDays || 0) + extraDays;
    custom[i].durationLabel = `${custom[i].durationDays} يوم`;

    localStorage.setItem(CUSTOM_TRAINERS_KEY, JSON.stringify(custom));
    syncCustomCoaches();
    renderTrainersList();
    toast(`تم تجديد اشتراك ${custom[i].name} لمدة ${extraDays} يوم حتى ${formatArDate(newExp)} ✅`);
  };

  window.__delT = function(i){
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || []; } catch(e){}
    if(!custom[i]) return;
    if(!confirm(`هل أنت متأكد من حذف المدرب (${custom[i].name}) نهائياً؟`)) return;

    const removedName = custom[i].name;
    custom.splice(i, 1);
    localStorage.setItem(CUSTOM_TRAINERS_KEY, JSON.stringify(custom));
    syncCustomCoaches();
    renderTrainersList();
    toast(`تم حذف المدرب ${removedName} بنجاح 🗑️`);
  };
}

/* =========================================================
   6.1) تصدير تقرير شيت جرد المدربين والاشتراكات PDF
   ========================================================= */
async function exportTrainersInventoryPDF() {
  let custom = [];
  try { custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || []; } catch(e){}
  
  const allCoaches = [
    { name: "ENGY ASHRAF", phone: "01020304050", code: "ENGY@2", sport: "gym", sportName: "كمال أجسام وجيم", durationLabel: "مدرب معتمد", createdAt: "2026-01-01T00:00:00.000Z", expiresAt: null },
    { name: "ABDO OSMAN", phone: "01122334455", code: "ABDO@1", sport: "gym", sportName: "كمال أجسام وجيم", durationLabel: "مدرب معتمد", createdAt: "2026-01-01T00:00:00.000Z", expiresAt: null },
    ...custom
  ];

  toast("جاري تجهيز وتوليد شيت جرد المدربين PDF... 📄");

  const W = 1200;
  const rowH = 46;
  const headerH = 220;
  const footerH = 60;
  const H = headerH + Math.max(1, allCoaches.length) * rowH + footerH + 40;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  // خلفية الشيت
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // هيدر فخم كحلي داكن
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, W, 140);

  // شريط ذهبي علوي
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#a27d12");
  grad.addColorStop(0.5, "#e0b83f");
  grad.addColorStop(1, "#ffe08a");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 6);

  // نصوص الهيدر
  ctx.font = "900 28px Cairo, Arial";
  ctx.fillStyle = "#e0b83f";
  ctx.textAlign = "right";
  try { ctx.direction = "rtl"; } catch(e) {}
  ctx.fillText("كشف جرد وسجل المدربين والاشتراكات — CAP ELITE", W - 40, 52);

  ctx.font = "700 14px Cairo, Arial";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("المشرف العام: كابتن ثروت (الأدمن الرئيسي) 👑  •  نظام إدارة وتفعيل الحسابات المعتمد", W - 40, 84);

  const now = new Date();
  const dateStr = formatArDate(now);
  ctx.font = "600 13px Cairo, Arial";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(`تاريخ استخراج التقرير: ${dateStr}`, W - 40, 114);

  // لوجو بالإنجليزية جهة اليسار
  ctx.font = "900 26px Inter, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  try { ctx.direction = "ltr"; } catch(e) {}
  ctx.fillText("CAP ELITE", 40, 56);
  ctx.font = "700 11px Inter, sans-serif";
  ctx.fillStyle = "#e0b83f";
  ctx.fillText("MASTER COACHES INVENTORY", 40, 80);

  // صناديق الإحصائيات (KPIs)
  const activeCount = allCoaches.filter(c => !c.expiresAt || new Date(c.expiresAt) >= now).length;
  const expiredCount = allCoaches.length - activeCount;

  const kpis = [
    { label: "إجمالي المدربين المسجلين", val: allCoaches.length, color: "#0f172a", bg: "#f1f5f9" },
    { label: "الاشتراكات النشطة والسارية", val: activeCount, color: "#16a34a", bg: "#f0fdf4" },
    { label: "الاشتراكات المنتهية", val: expiredCount, color: "#dc2626", bg: "#fef2f2" }
  ];

  const kw = (W - 80 - 40) / 3;
  kpis.forEach((k, idx) => {
    const kx = 40 + idx * (kw + 20);
    const ky = 155;
    ctx.fillStyle = k.bg;
    rr(ctx, kx, ky, kw, 48, 10);
    ctx.fill();
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = "800 13px Cairo, Arial";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "right";
    try { ctx.direction = "rtl"; } catch(e) {}
    ctx.fillText(k.label, kx + kw - 14, ky + 29);

    ctx.font = "900 18px Inter, Cairo, sans-serif";
    ctx.fillStyle = k.color;
    ctx.textAlign = "left";
    try { ctx.direction = "ltr"; } catch(e) {}
    ctx.fillText(String(k.val), kx + 16, ky + 31);
  });

  // رأس الجدول
  const thY = 220;
  ctx.fillStyle = "#1e293b";
  rr(ctx, 40, thY, W - 80, 36, 8);
  ctx.fill();

  const cols = [
    { title: "م", x: W - 60, align: "center", dir: "rtl" },
    { title: "اسم المدرب", x: W - 160, align: "right", dir: "rtl" },
    { title: "رقم الهاتف", x: W - 340, align: "center", dir: "ltr" },
    { title: "الرياضة والتخصص", x: W - 490, align: "right", dir: "rtl" },
    { title: "كود الدخول", x: W - 640, align: "center", dir: "ltr" },
    { title: "تاريخ التسجيل", x: W - 780, align: "center", dir: "rtl" },
    { title: "مدة التسجيل", x: W - 910, align: "center", dir: "rtl" },
    { title: "تاريخ الانتهاء", x: W - 1030, align: "center", dir: "rtl" },
    { title: "الحالة / المتبقي", x: W - 1130, align: "center", dir: "rtl" }
  ];

  ctx.font = "800 12px Cairo, Arial";
  ctx.fillStyle = "#ffffff";
  cols.forEach(col => {
    ctx.textAlign = col.align;
    try { ctx.direction = col.dir; } catch(e) {}
    ctx.fillText(col.title, col.x, thY + 23);
  });

  // صفوف الجدول
  let curY = thY + 36;
  allCoaches.forEach((c, i) => {
    const isEven = i % 2 === 0;
    ctx.fillStyle = isEven ? "#ffffff" : "#f8fafc";
    ctx.fillRect(40, curY, W - 80, rowH);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, curY, W - 80, rowH);

    const exp = c.expiresAt ? new Date(c.expiresAt) : null;
    const isExpired = exp && exp < now;
    const daysLeft = exp ? Math.max(0, Math.ceil((exp - now) / (1000 * 60 * 60 * 24))) : "دائم";
    const regDate = c.createdAt ? formatArDate(c.createdAt) : "—";
    const expDate = exp ? formatArDate(c.expiresAt) : "غير محدد";
    const daysSince = c.createdAt ? Math.max(0, Math.floor((now - new Date(c.createdAt)) / (1000 * 60 * 60 * 24))) : 0;
    const durationSince = daysSince > 0 ? `${daysSince} يوم` : "اليوم";

    ctx.font = "700 12px Cairo, Arial";
    ctx.fillStyle = "#0f172a";

    // 1. م
    ctx.textAlign = "center"; try { ctx.direction = "rtl"; } catch(e) {}
    ctx.fillText(String(i + 1), W - 60, curY + 28);

    // 2. اسم المدرب
    ctx.font = "800 13px Cairo, Arial";
    ctx.textAlign = "right"; try { ctx.direction = "rtl"; } catch(e) {}
    ctx.fillText(c.name, W - 100, curY + 28);

    // 3. رقم الهاتف
    ctx.font = "700 12px Inter, sans-serif";
    ctx.textAlign = "center"; try { ctx.direction = "ltr"; } catch(e) {}
    ctx.fillStyle = c.phone ? "#0f172a" : "#94a3b8";
    ctx.fillText(c.phone || "—", W - 340, curY + 28);

    // 4. الرياضة
    ctx.font = "700 12px Cairo, Arial";
    ctx.textAlign = "right"; try { ctx.direction = "rtl"; } catch(e) {}
    ctx.fillStyle = "#b45309";
    ctx.fillText(c.sportName || "كمال أجسام وجيم", W - 440, curY + 28);

    // 5. كود الدخول
    ctx.font = "800 12px Inter, sans-serif";
    ctx.textAlign = "center"; try { ctx.direction = "ltr"; } catch(e) {}
    ctx.fillStyle = "#0284c7";
    ctx.fillText(c.code, W - 640, curY + 28);

    // 6. تاريخ التسجيل
    ctx.font = "600 11.5px Cairo, Arial";
    ctx.textAlign = "center"; try { ctx.direction = "rtl"; } catch(e) {}
    ctx.fillStyle = "#334155";
    ctx.fillText(regDate, W - 780, curY + 28);

    // 7. مدة التسجيل
    ctx.font = "700 12px Cairo, Arial";
    ctx.textAlign = "center"; try { ctx.direction = "rtl"; } catch(e) {}
    ctx.fillStyle = "#475569";
    ctx.fillText(`منذ ${durationSince}`, W - 910, curY + 28);

    // 8. تاريخ الانتهاء
    ctx.font = "600 11.5px Cairo, Arial";
    ctx.textAlign = "center"; try { ctx.direction = "rtl"; } catch(e) {}
    ctx.fillStyle = isExpired ? "#dc2626" : "#334155";
    ctx.fillText(expDate, W - 1030, curY + 28);

    // 9. الحالة
    ctx.font = "800 11.5px Cairo, Arial";
    ctx.textAlign = "center"; try { ctx.direction = "rtl"; } catch(e) {}
    if (isExpired) {
      ctx.fillStyle = "#dc2626";
      ctx.fillText("منتهي الصلاحية ✕", W - 1130, curY + 28);
    } else {
      ctx.fillStyle = "#16a34a";
      ctx.fillText(typeof daysLeft === "number" ? `نشط (${daysLeft} يوم) ✓` : "نشط (دائم) ✓", W - 1130, curY + 28);
    }

    curY += rowH;
  });

  // فوتر التقرير
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(40, curY + 10, W - 80, 36);
  ctx.strokeStyle = "#e2e8f0";
  ctx.strokeRect(40, curY + 10, W - 80, 36);
  ctx.font = "700 11.5px Cairo, Arial";
  ctx.fillStyle = "#64748b";
  ctx.textAlign = "center";
  try { ctx.direction = "rtl"; } catch(e) {}
  ctx.fillText("CAP ELITE • تقرير سري داخلي مخصص لإدارة الكابتن ثروت فقط • صادر من نظام التدريب والاشتراكات", W / 2, curY + 33);

  // تصدير PDF عبر jsPDF
  const jsPDFClass = await getJsPDF();
  if (!jsPDFClass) {
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `CAP_ELITE_Trainers_Inventory_${Date.now()}.png`;
    a.click();
    toast("تم تحميل شيت الجرد كصورة عالية الدقة بنجاح ✅");
    return;
  }

  const pdf = new jsPDFClass({
    orientation: "landscape",
    unit: "pt",
    format: [W * 0.75, H * 0.75]
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(imgData, "JPEG", 0, 0, W * 0.75, H * 0.75);
  pdf.save(`CAP_ELITE_Trainers_Inventory_${Date.now()}.pdf`);
  toast("تم تصدير وتحميل شيت جرد المدربين PDF بنجاح! 📄🎉");
}

/* =========================================================
   7) برنامج التغذية المدمج كاملاً (قاعدة الأصناف والماكروز والتصدير)
   ========================================================= */
function initNutritionSystem() {
  const mainEl = document.querySelector(".main");
  if (!mainEl || document.getElementById("secNutrition")) return;

  const $q = (s, r) => (r || document).querySelector(s);
  const $qa = (s, r) => Array.from((r || document).querySelectorAll(s));
  const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? (d || 0) : n; };
  const fmt = v => String(Math.round(v * 10) / 10);
  const fmt0 = v => String(Math.round(v));
  const norm = s => String(s || "").toLowerCase().replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[\u064B-\u0652]/g, "").trim();
  const coachName = () => (state.coach || "COACH");
  const mainClient = () => { const el = document.getElementById("clientName"); return el ? el.value.trim() : ""; };

  const CATS = { prot: "بروتين", carb: "نشويات وعيش", legu: "فول وبقوليات", dairy: "ألبان وجبن", veg: "خضار وسلطة", fruit: "فواكه", fat: "دهون ومكسرات", other: "إضافات وسكريات", mine: "أصنافي" };
  const F = [
    ["egg", "بيض كامل", "prot", 143, 12.6, 0.7, 9.5, 100, "بيضة", 50],
    ["eggw", "بياض بيض", "prot", 52, 10.9, 0.7, 0.2, 100, "بياضة", 33],
    ["chk", "صدور فراخ مشوية", "prot", 165, 31, 0, 3.6, 150],
    ["quarter", "ربع فراخ مشوي (لحم صافي)", "prot", 190, 27, 0, 9, 200, "ربع فراخ", 200],
    ["chkthigh", "وراك فراخ مشوية بدون جلد", "prot", 209, 26, 0, 11, 150],
    ["turkey", "صدور ديك رومي", "prot", 135, 30, 0, 1, 150],
    ["beef", "لحم بقري مشوي", "prot", 217, 26, 0, 12, 150],
    ["kofta", "كفتة مشوية", "prot", 230, 22, 3, 14, 150],
    ["liver", "كبدة مشوية", "prot", 175, 27, 4, 5, 120],
    ["tilapia", "سمك بلطي مشوي", "prot", 128, 26, 0, 2.7, 200],
    ["salmon", "سلمون مشوي", "prot", 208, 20, 0, 13, 150],
    ["shrimp", "جمبري مسلوق", "prot", 99, 24, 0.2, 0.3, 150],
    ["tuna", "تونة معلبة بالماء", "prot", 116, 26, 0, 1, 120],
    ["whey", "بروتين واي (سكوب)", "prot", 400, 80, 8, 6, 30, "سكوب", 30],
    ["rice", "أرز أبيض مسلوق", "carb", 130, 2.7, 28, 0.3, 150],
    ["basmati", "أرز بسمتي مسلوق", "carb", 121, 3.5, 25, 0.4, 150],
    ["brown", "أرز بني مسلوق", "carb", 123, 2.7, 26, 1, 150],
    ["pasta", "مكرونة مسلوقة", "carb", 158, 5.8, 31, 0.9, 150],
    ["potato", "بطاطس مسلوقة", "carb", 87, 1.9, 20, 0.1, 200],
    ["sweetp", "بطاطا مشوية", "carb", 90, 2, 21, 0.2, 200],
    ["bulgur", "برغل مسلوق", "carb", 83, 3, 19, 0.2, 150],
    ["baladi", "عيش بلدي", "carb", 265, 9, 55, 1.5, 80, "رغيف", 80],
    ["fino", "عيش فينو", "carb", 280, 9, 55, 2, 55, "رغيف", 55],
    ["toastb", "توست أسمر", "carb", 250, 10, 43, 3.5, 56, "شريحة", 28],
    ["toastw", "توست أبيض", "carb", 265, 9, 49, 3.2, 56, "شريحة", 28],
    ["oats", "شوفان (وزن جاف)", "carb", 389, 17, 66, 7, 50],
    ["cornf", "كورن فليكس", "carb", 357, 7, 84, 0.4, 40],
    ["foul", "فول مدمس", "legu", 110, 7.6, 19, 0.4, 150],
    ["falafel", "طعمية (فلافل)", "legu", 333, 13, 32, 18, 100, "قرص", 25],
    ["lentil", "عدس مطبوخ", "legu", 116, 9, 20, 0.4, 150],
    ["chickpea", "حمص مسلوق", "legu", 164, 8.9, 27, 2.6, 100],
    ["beans", "فاصوليا بيضاء مطبوخة", "legu", 139, 9.7, 25, 0.5, 150],
    ["lobia", "لوبيا مطبوخة", "legu", 116, 7, 21, 0.5, 150],
    ["cottage", "جبنة قريش", "dairy", 90, 12, 3, 3, 100],
    ["fetaLow", "جبنة بيضاء قليلة الدسم", "dairy", 160, 18, 3, 8, 80],
    ["feta", "جبنة بيضاء (تلاجة)", "dairy", 264, 14, 4, 21, 50],
    ["ras", "جبنة رومي", "dairy", 380, 26, 2, 30, 40, "شريحة", 20],
    ["triangle", "جبنة مثلثات", "dairy", 250, 11, 6, 20, 36, "مثلث", 18],
    ["mozz", "جبنة موتزاريلا", "dairy", 254, 24, 3, 16, 50],
    ["milk", "لبن كامل الدسم", "dairy", 61, 3.2, 4.8, 3.3, 250, "كوب", 250],
    ["milkSkim", "لبن خالي الدسم", "dairy", 34, 3.4, 5, 0.1, 250, "كوب", 250],
    ["yogurt", "زبادي عادي", "dairy", 61, 3.5, 4.7, 3.3, 170, "علبة", 170],
    ["greek", "زبادي يوناني قليل الدسم", "dairy", 73, 10, 4, 2, 150, "علبة", 150],
    ["salad", "سلطة خضراء", "veg", 20, 1, 4, 0.2, 150],
    ["cucumber", "خيار", "veg", 15, 0.7, 3.6, 0.1, 100],
    ["tomato", "طماطم", "veg", 18, 0.9, 3.9, 0.2, 100],
    ["lettuce", "خس", "veg", 15, 1.4, 2.9, 0.2, 80],
    ["broccoli", "بروكلي مسلوق", "veg", 35, 2.4, 7, 0.4, 150],
    ["mixveg", "خضار مشكل مسلوق", "veg", 40, 2, 8, 0.3, 150],
    ["zucchini", "كوسة مطبوخة", "veg", 17, 1.2, 3.1, 0.3, 150],
    ["spinach", "سبانخ مطبوخة", "veg", 23, 3, 3.8, 0.3, 150],
    ["okra", "بامية مطبوخة", "veg", 33, 1.9, 7, 0.2, 150],
    ["molokhia", "ملوخية مطبوخة", "veg", 32, 3, 5, 0.4, 150],
    ["carrot", "جزر", "veg", 41, 0.9, 10, 0.2, 100],
    ["pepper", "فلفل رومي", "veg", 31, 1, 6, 0.3, 100],
    ["banana", "موز", "fruit", 89, 1.1, 23, 0.3, 120, "موزة", 120],
    ["apple", "تفاح", "fruit", 52, 0.3, 14, 0.2, 180, "تفاحة", 180],
    ["orange", "برتقال", "fruit", 47, 0.9, 12, 0.1, 150, "برتقالة", 150],
    ["strawberry", "فراولة", "fruit", 32, 0.7, 7.7, 0.3, 150],
    ["grapes", "عنب", "fruit", 69, 0.7, 18, 0.2, 150],
    ["guava", "جوافة", "fruit", 68, 2.6, 14, 1, 150],
    ["mango", "مانجو", "fruit", 60, 0.8, 15, 0.4, 150],
    ["watermelon", "بطيخ", "fruit", 30, 0.6, 7.6, 0.2, 250],
    ["dates", "تمر", "fruit", 282, 2.5, 75, 0.4, 24, "تمرة", 8],
    ["olive", "زيت زيتون", "fat", 884, 0, 0, 100, 13, "معلقة", 13],
    ["butter", "زبدة", "fat", 717, 0.9, 0.1, 81, 10, "قطعة", 10],
    ["pbutter", "زبدة فول سوداني", "fat", 588, 25, 20, 50, 16, "معلقة", 16],
    ["tahini", "طحينة", "fat", 595, 17, 21, 54, 15, "معلقة", 15],
    ["almond", "لوز", "fat", 579, 21, 22, 50, 25],
    ["walnut", "عين جمل", "fat", 654, 15, 14, 65, 25],
    ["peanut", "فول سوداني", "fat", 567, 26, 16, 49, 25],
    ["avocado", "أفوكادو", "fat", 160, 2, 9, 15, 100],
    ["honey", "عسل نحل", "other", 304, 0.3, 82, 0, 20, "معلقة", 20],
    ["jam", "مربى", "other", 250, 0.4, 65, 0.1, 20, "معلقة", 20],
    ["sugar", "سكر", "other", 387, 0, 100, 0, 5, "معلقة", 5],
    ["juice", "عصير برتقال طازج", "other", 45, 0.7, 10, 0.2, 250, "كوب", 250],
    ["tea", "شاي / قهوة سادة", "other", 2, 0.1, 0.3, 0, 200]
  ];
  const FOODS = F.map(a => ({ id: a[0], n: a[1], cat: a[2], k: a[3], p: a[4], c: a[5], f: a[6], g: a[7], pl: a[8] || "", pg: a[9] || 0 }));
  const FMAP = {};
  FOODS.forEach(f => FMAP[f.id] = f);

  const MEALS = [
    { id: "breakfast", n: "الفطار", icon: "fa-mug-hot" },
    { id: "lunch", n: "الغداء", icon: "fa-drumstick-bite" },
    { id: "dinner", n: "العشاء", icon: "fa-bowl-food" },
    { id: "snack", n: "سناك / قبل وبعد التمرين", icon: "fa-apple-whole" }
  ];

  const PRESETS = {
    breakfast: [
      { n: "فطار مصري (فول + بيض + عيش)", it: [["foul", 150], ["egg", 100], ["baladi", 80], ["tomato", 100]] },
      { n: "شوفان بروتين", it: [["oats", 50], ["milkSkim", 250], ["banana", 120], ["pbutter", 16]] },
      { n: "بيض وجبنة قريش وتوست", it: [["egg", 150], ["cottage", 100], ["toastb", 56], ["cucumber", 100]] }
    ],
    lunch: [
      { n: "فراخ مشوية وأرز وسلطة", it: [["chk", 200], ["rice", 200], ["salad", 150], ["olive", 13]] },
      { n: "ربع فراخ مشوي وأرز", it: [["quarter", 200], ["rice", 150], ["salad", 150]] },
      { n: "سمك مشوي وبطاطس وخضار", it: [["tilapia", 200], ["potato", 200], ["broccoli", 150]] },
      { n: "لحمة ومكرونة وسلطة", it: [["beef", 150], ["pasta", 200], ["salad", 150]] },
      { n: "كفتة وأرز بني وخضار", it: [["kofta", 150], ["brown", 150], ["mixveg", 150]] }
    ],
    dinner: [
      { n: "جبنة تلاجة وعيش وخضار", it: [["fetaLow", 80], ["baladi", 80], ["cucumber", 100], ["tomato", 100]] },
      { n: "تونة وسلطة وتوست", it: [["tuna", 120], ["salad", 200], ["toastb", 56]] },
      { n: "زبادي يوناني وشوفان وموز", it: [["greek", 200], ["oats", 40], ["banana", 100]] }
    ],
    snack: [
      { n: "واي بروتين وموزة", it: [["whey", 30], ["banana", 120]] },
      { n: "لوز وتمر", it: [["almond", 25], ["dates", 24]] },
      { n: "زبادي وتفاحة", it: [["yogurt", 170], ["apple", 180]] }
    ]
  };

  const GOALS = { cut: "تنشيف / خسارة دهون", maintain: "ثبات الوزن", bulk: "زيادة كتلة عضلية" };
  const KEY = "capEliteNutrition_v1";
  const NS = {
    plan: { breakfast: [], lunch: [], dinner: [], snack: [] },
    times: { breakfast: "8:00 ص", lunch: "2:00 م", dinner: "9:00 م", snack: "" },
    target: { k: 0, p: 0, c: 0, f: 0 },
    notes: "", client: "",
    calc: { w: "", h: "", a: "", sex: "m", act: "1.55", goal: "maintain" },
    custom: [],
    pm: "breakfast", cat: "all"
  };

  function saveNut() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ plan: NS.plan, times: NS.times, target: NS.target, notes: NS.notes, client: NS.client, calc: NS.calc, custom: NS.custom }));
    } catch (e) {}
  }
  function registerFood(o) {
    if (!o || !o.id || FMAP[o.id]) return;
    const f = { id: o.id, n: o.n, cat: "mine", k: num(o.k), p: num(o.p), c: num(o.c), f: num(o.f), g: num(o.g, 100), pl: "", pg: 0 };
    FOODS.push(f); FMAP[f.id] = f;
  }
  function loadNut() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!d) return;
      (d.custom || []).forEach(o => { NS.custom.push(o); registerFood(o); });
      if (d.plan) MEALS.forEach(m => { NS.plan[m.id] = (d.plan[m.id] || []).filter(it => it && FMAP[it.id]).map(it => ({ id: it.id, g: num(it.g) })); });
      if (d.times) Object.assign(NS.times, d.times);
      if (d.target) Object.assign(NS.target, d.target);
      if (d.calc) Object.assign(NS.calc, d.calc);
      NS.notes = d.notes || ""; NS.client = d.client || "";
    } catch (e) {}
  }

  const calcItem = it => {
    const f = FMAP[it.id];
    if (!f) return null;
    const m = it.g / 100;
    return { f, k: f.k * m, p: f.p * m, c: f.c * m, fat: f.f * m };
  };
  const sumCalc = arr => arr.reduce((a, c) => ({ k: a.k + c.k, p: a.p + c.p, c: a.c + c.c, f: a.f + c.fat }), { k: 0, p: 0, c: 0, f: 0 });
  const mealTotals = id => sumCalc(NS.plan[id].map(calcItem).filter(Boolean));
  const dayTotals = () => MEALS.reduce((a, m) => { const t = mealTotals(m.id); return { k: a.k + t.k, p: a.p + t.p, c: a.c + t.c, f: a.f + t.f }; }, { k: 0, p: 0, c: 0, f: 0 });
  const hasItems = () => MEALS.some(m => NS.plan[m.id].length);
  const pieceText = (f, g) => (!f.pg || !f.pl) ? "" : ("≈ " + Math.round((g / f.pg) * 2) / 2 + " " + f.pl);
  const stepOf = f => (f.pg && f.pg <= 60) ? f.pg : (f.g <= 30 ? 5 : 10);

  const sec = document.createElement("section");
  sec.id = "secNutrition";
  sec.className = "card card-pad section";
  sec.innerHTML = `
    <div class="head">
      <div class="ic"><i class="fa-solid fa-utensils"></i></div>
      <div><h2>برنامج التغذية</h2><p>STEP 04 • NUTRITION PLAN</p></div>
      <div class="grow"></div>
      <span class="step-tag">04</span>
    </div>

    <div class="nut-block">
      <h3 class="nut-h"><i class="fa-solid fa-calculator"></i> حاسبة الاحتياج اليومي <small>(اختياري)</small></h3>
      <div class="nut-grid">
        <div class="field"><label><i class="fa-solid fa-weight-scale"></i> الوزن (كجم)</label><input type="number" inputmode="decimal" data-calc="w" placeholder="80"></div>
        <div class="field"><label><i class="fa-solid fa-ruler-vertical"></i> الطول (سم)</label><input type="number" inputmode="decimal" data-calc="h" placeholder="175"></div>
        <div class="field"><label><i class="fa-solid fa-cake-candles"></i> السن</label><input type="number" inputmode="numeric" data-calc="a" placeholder="25"></div>
        <div class="field"><label><i class="fa-solid fa-venus-mars"></i> النوع</label>
          <select data-calc="sex"><option value="m">ذكر</option><option value="f">أنثى</option></select></div>
        <div class="field"><label><i class="fa-solid fa-person-running"></i> النشاط</label>
          <select data-calc="act">
            <option value="1.2">قليل جدًا (بدون تمرين)</option>
            <option value="1.375">خفيف (1-3 أيام)</option>
            <option value="1.55">متوسط (3-5 أيام)</option>
            <option value="1.725">عالي (6-7 أيام)</option>
            <option value="1.9">مكثف جدًا</option>
          </select></div>
        <div class="field"><label><i class="fa-solid fa-bullseye"></i> الهدف</label>
          <select data-calc="goal">
            <option value="cut">تنشيف / خسارة دهون</option>
            <option value="maintain">ثبات الوزن</option>
            <option value="bulk">زيادة كتلة عضلية</option>
          </select></div>
      </div>
      <button id="nutCalcBtn" class="btn btn-outline btn-block" type="button" style="margin-top:12px"><i class="fa-solid fa-wand-magic-sparkles"></i> احسب واضبط الأهداف تلقائي</button>
      <h3 class="nut-h" style="margin-top:16px"><i class="fa-solid fa-flag-checkered"></i> الأهداف اليومية <small>(تقدر تعدلها بإيدك)</small></h3>
      <div class="nut-targets">
        <div class="field"><label>سعرات</label><input type="number" inputmode="numeric" data-t="k" placeholder="2400"></div>
        <div class="field"><label>بروتين (جم)</label><input type="number" inputmode="numeric" data-t="p" placeholder="160"></div>
        <div class="field"><label>كارب (جم)</label><input type="number" inputmode="numeric" data-t="c" placeholder="280"></div>
        <div class="field"><label>دهون (جم)</label><input type="number" inputmode="numeric" data-t="f" placeholder="70"></div>
      </div>
      <p id="nutCalcInfo" class="hint" style="margin-top:10px"></p>
    </div>

    <div id="nutDash" class="nut-dash"></div>
    <p id="nutSplit" class="nut-split"></p>
    <div id="nutMeals"></div>

    <div class="nut-block">
      <div class="field"><label><i class="fa-solid fa-user"></i> اسم العميل <small style="color:#6e6e79">(لو فاضي بيتاخد من بيانات البرنامج)</small></label><input id="nutClient" placeholder="أحمد محمد"></div>
      <div class="field" style="margin-bottom:0"><label><i class="fa-solid fa-note-sticky"></i> ملاحظات المدرب</label><textarea id="nutNotes" placeholder="مثال: اشرب مياه كتير، الأكل بعد التمرين بساعة..."></textarea></div>
      <div class="nut-acts">
        <button id="nutPngBtn" class="btn btn-gold" type="button"><i class="fa-solid fa-file-image"></i> تصدير التغذية PNG</button>
        <button id="nutPdfBtn" class="btn btn-outline" type="button"><i class="fa-solid fa-file-pdf"></i> تصدير التغذية PDF</button>
        <button id="nutCopyBtn" class="btn btn-ghost" type="button"><i class="fa-solid fa-copy"></i> نسخ كنص</button>
        <button id="nutWaBtn" class="btn btn-ghost" type="button"><i class="fa-brands fa-whatsapp"></i> إرسال واتساب</button>
      </div>
      <p id="nutStatus" class="status"></p>
      <button id="nutResetBtn" class="btn btn-ghost btn-sm btn-block" type="button"><i class="fa-solid fa-broom"></i> مسح برنامج التغذية كله</button>
    </div>
  `;
  const targetView = document.getElementById("viewNutrition") || mainEl;
  if (targetView === mainEl) {
    const footer = $q(".footer", mainEl);
    if (footer) mainEl.insertBefore(sec, footer); else mainEl.appendChild(sec);
  } else {
    targetView.appendChild(sec);
  }

  /* نافذة الأصناف والتصدير */
  const picker = document.createElement("div");
  picker.id = "nutPicker";
  picker.className = "modal top";
  picker.innerHTML = `
    <div class="mbox">
      <button class="mclose" type="button" data-nclose="picker" aria-label="إغلاق"><i class="fa-solid fa-xmark"></i></button>
      <div class="mhead"><h2 id="nutPickTitle">أضف أصناف</h2><p>اضغط «إضافة» وبعدين عدّل الجرامات من الوجبة نفسها</p></div>
      <div class="search"><i class="fa-solid fa-magnifying-glass"></i><input id="nutSearch" type="search" placeholder="ابحث عن صنف (فراخ، رز، فول...)"></div>
      <div id="nutChips" class="nut-chips"></div>
      <div class="nut-ptools"><button id="nutCToggle" class="btn btn-outline btn-sm" type="button"><i class="fa-solid fa-circle-plus"></i> صنف مخصص</button></div>
      <div id="nutCForm" class="nut-cform">
        <div class="nut-grid">
          <div class="field" style="grid-column:1/-1"><label>اسم الصنف</label><input id="nutCN" placeholder="مثال: أرز بالخلطة"></div>
          <div class="field"><label>سعرات /100جم</label><input id="nutCK" type="number" inputmode="decimal"></div>
          <div class="field"><label>بروتين /100جم</label><input id="nutCP" type="number" inputmode="decimal"></div>
          <div class="field"><label>كارب /100جم</label><input id="nutCC" type="number" inputmode="decimal"></div>
          <div class="field"><label>دهون /100جم</label><input id="nutCF" type="number" inputmode="decimal"></div>
          <div class="field"><label>الجرام الافتراضي</label><input id="nutCG" type="number" inputmode="decimal" placeholder="100"></div>
        </div>
        <button id="nutCSave" class="btn btn-gold btn-block" type="button" style="margin-top:10px"><i class="fa-solid fa-check"></i> حفظ وإضافة للوجبة</button>
      </div>
      <div id="nutCount" class="pcount"></div>
      <div id="nutPlist" class="plist"></div>
    </div>`;
  document.body.appendChild(picker);

  const out = document.createElement("div");
  out.id = "nutOut";
  out.className = "nut-out";
  out.hidden = true;
  document.body.appendChild(out);

  function goNut() {
    if (typeof switchMainTab === "function") switchMainTab("nutrition");
    sec.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof setActiveNav === "function") setActiveNav("secNutrition");
  }
  const nav = $q(".side .nav");
  if (nav && !nav.querySelector('[data-go="secNutrition"]') && !nav.querySelector('[data-tab="nutrition"]')) {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.go = "secNutrition";
    b.innerHTML = '<i class="fa-solid fa-utensils"></i> برنامج التغذية';
    const ref = $q(".js-export", nav);
    if (ref) nav.insertBefore(b, ref); else nav.appendChild(b);
    b.addEventListener("click", goNut);
  }
  const dock = $q(".dock");
  if (dock && !dock.querySelector('[data-go="secNutrition"]') && !dock.querySelector('[data-dock="nutrition"]')) {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.go = "secNutrition";
    b.innerHTML = '<i class="fa-solid fa-utensils"></i>التغذية';
    const ref = $q('[data-go="secPreview"]', dock);
    if (ref) ref.insertAdjacentElement("afterend", b); else dock.appendChild(b);
    b.addEventListener("click", goNut);
  }

  const elMeals = $q("#nutMeals", sec), elDash = $q("#nutDash", sec), elSplit = $q("#nutSplit", sec);

  function rowHTML(mId, it, i) {
    const f = FMAP[it.id];
    if (!f) return "";
    return `<div class="nut-row" data-m="${mId}" data-i="${i}">
      <div class="nut-rname"><b>${esc(f.n)}</b><small class="nut-piece"></small></div>
      <div class="nut-gram">
        <button class="icon-btn" type="button" data-nact="dec" aria-label="نقص"><i class="fa-solid fa-minus"></i></button>
        <input class="mini nut-g" type="number" inputmode="decimal" min="0" value="${esc(it.g)}">
        <span>جم</span>
        <button class="icon-btn" type="button" data-nact="inc" aria-label="زيادة"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div class="nut-macros">
        <span class="nk"><b data-r="k">0</b> سعرة</span>
        <span class="np">P <b data-r="p">0</b></span>
        <span class="nc">C <b data-r="c">0</b></span>
        <span class="nf">F <b data-r="f">0</b></span>
      </div>
      <button class="icon-btn del" type="button" data-nact="del" aria-label="حذف"><i class="fa-solid fa-trash"></i></button>
    </div>`;
  }

  function renderMeals() {
    elMeals.innerHTML = MEALS.map(m => {
      const items = NS.plan[m.id];
      const rows = items.length ? items.map((it, i) => rowHTML(m.id, it, i)).join("")
        : `<div class="nut-empty"><i class="fa-solid fa-plate-wheat" style="color:var(--gold);margin-inline-end:6px"></i>لسه مفيش أصناف في ${esc(m.n)}</div>`;
      const opts = (PRESETS[m.id] || []).map((p, i) => `<option value="${i}">${esc(p.n)}</option>`).join("");
      return `<div class="nut-meal" data-meal="${m.id}">
        <div class="nut-mh">
          <span class="nut-mi"><i class="fa-solid ${m.icon}"></i></span>
          <div class="nut-mt"><b>${esc(m.n)}</b><input class="nut-time" data-time="${m.id}" value="${esc(NS.times[m.id] || "")}" placeholder="الوقت"></div>
          <div class="grow"></div>
          <div class="nut-msum"><b data-ms="${m.id}">0</b> <small>سعرة</small></div>
        </div>
        <div class="nut-items">${rows}</div>
        <div class="nut-mm" data-mm="${m.id}"></div>
        <div class="nut-macts">
          <button class="btn btn-gold btn-sm" type="button" data-nact="add" data-meal="${m.id}"><i class="fa-solid fa-plus"></i> إضافة صنف</button>
          <select class="nut-preset" data-meal="${m.id}"><option value="">✨ وجبات جاهزة...</option>${opts}</select>
          <button class="btn btn-ghost btn-sm" type="button" data-nact="clear" data-meal="${m.id}"><i class="fa-solid fa-eraser"></i> مسح الوجبة</button>
        </div>
      </div>`;
    }).join("");
    updateNumbers();
  }

  function renderDash(day) {
    const t = NS.target;
    const cards = [
      { l: "السعرات", v: day.k, t: t.k, u: "سعرة" },
      { l: "البروتين", v: day.p, t: t.p, u: "جم" },
      { l: "الكارب", v: day.c, t: t.c, u: "جم" },
      { l: "الدهون", v: day.f, t: t.f, u: "جم" }
    ];
    elDash.innerHTML = cards.map(c => {
      const pct = c.t > 0 ? Math.min(100, (c.v / c.t) * 100) : 0;
      const over = c.t > 0 && c.v > c.t * 1.05;
      return `<div class="nut-dcard ${over ? "over" : ""}"><span>${c.l}</span>
        <strong>${fmt0(c.v)}<small>${c.t > 0 ? "/ " + fmt0(c.t) + " " + c.u : c.u}</small></strong>
        <div class="bar"><span style="width:${pct}%"></span></div></div>`;
    }).join("");
    const cal = day.p * 4 + day.c * 4 + day.f * 9;
    elSplit.textContent = cal > 0
      ? `توزيع السعرات: بروتين ${Math.round(day.p * 4 / cal * 100)}% • كارب ${Math.round(day.c * 4 / cal * 100)}% • دهون ${Math.round(day.f * 9 / cal * 100)}%`
      : "";
  }

  function updateNumbers() {
    MEALS.forEach(m => {
      const t = { k: 0, p: 0, c: 0, f: 0 };
      NS.plan[m.id].forEach((it, i) => {
        const c = calcItem(it);
        if (!c) return;
        t.k += c.k; t.p += c.p; t.c += c.c; t.f += c.fat;
        const row = $q(`.nut-row[data-m="${m.id}"][data-i="${i}"]`, elMeals);
        if (row) {
          $q('[data-r="k"]', row).textContent = fmt0(c.k);
          $q('[data-r="p"]', row).textContent = fmt(c.p);
          $q('[data-r="c"]', row).textContent = fmt(c.c);
          $q('[data-r="f"]', row).textContent = fmt(c.fat);
          $q(".nut-piece", row).textContent = pieceText(c.f, it.g);
        }
      });
      const ms = $q(`[data-ms="${m.id}"]`, elMeals), mm = $q(`[data-mm="${m.id}"]`, elMeals);
      if (ms) ms.textContent = fmt0(t.k);
      if (mm) mm.textContent = NS.plan[m.id].length ? `بروتين ${fmt(t.p)} جم • كارب ${fmt(t.c)} جم • دهون ${fmt(t.f)} جم` : "";
    });
    renderDash(dayTotals());
    saveNut();
  }

  function fillInputs() {
    $qa("[data-calc]", sec).forEach(el => { el.value = NS.calc[el.dataset.calc] != null ? NS.calc[el.dataset.calc] : ""; });
    $qa("[data-t]", sec).forEach(el => { const v = NS.target[el.dataset.t]; el.value = v ? v : ""; });
    $q("#nutClient", sec).value = NS.client;
    $q("#nutNotes", sec).value = NS.notes;
  }

  function doCalc() {
    const c = NS.calc, w = num(c.w), h = num(c.h), a = num(c.a);
    const info = $q("#nutCalcInfo", sec);
    if (!(w > 0 && h > 0 && a > 0)) { info.textContent = "اكتب الوزن والطول والسن الأول."; return; }
    const bmr = 10 * w + 6.25 * h - 5 * a + (c.sex === "f" ? -161 : 5);
    const tdee = bmr * num(c.act, 1.55);
    const k = Math.round(tdee * ({ cut: 0.8, maintain: 1, bulk: 1.15 }[c.goal] || 1) / 10) * 10;
    const p = Math.round(w * ({ cut: 2.2, maintain: 1.8, bulk: 2 }[c.goal] || 1.8));
    const f = Math.round(k * 0.25 / 9);
    const cc = Math.max(0, Math.round((k - p * 4 - f * 9) / 4));
    NS.target = { k, p, c: cc, f };
    fillInputs();
    info.textContent = `احتياج الثبات ≈ ${Math.round(tdee)} سعرة • الهدف المقترح: ${k} سعرة (بروتين ${p} جم • كارب ${cc} جم • دهون ${f} جم)`;
    updateNumbers();
    toast("تم ضبط الأهداف ✅");
  }

  sec.addEventListener("click", e => {
    const b = e.target.closest("[data-nact]");
    if (!b) return;
    const act = b.dataset.nact;
    if (act === "add") { openNutPicker(b.dataset.meal); return; }
    if (act === "clear") {
      const id = b.dataset.meal;
      if (!NS.plan[id].length) return;
      if (!confirm("مسح كل أصناف الوجبة دي؟")) return;
      NS.plan[id] = []; renderMeals(); return;
    }
    const row = b.closest(".nut-row");
    if (!row) return;
    const mId = row.dataset.m, i = +row.dataset.i, it = NS.plan[mId][i];
    if (!it) return;
    if (act === "del") { NS.plan[mId].splice(i, 1); renderMeals(); return; }
    if (act === "inc" || act === "dec") {
      const st = stepOf(FMAP[it.id]);
      it.g = Math.max(0, Math.round((it.g + (act === "inc" ? st : -st)) * 10) / 10);
      $q(".nut-g", row).value = it.g;
      updateNumbers();
    }
  });

  sec.addEventListener("change", e => {
    const sel = e.target.closest(".nut-preset");
    if (!sel) return;
    const meal = sel.dataset.meal, idx = sel.value;
    sel.value = "";
    if (idx === "") return;
    const pr = (PRESETS[meal] || [])[+idx];
    if (!pr) return;
    NS.plan[meal] = pr.it.filter(a => FMAP[a[0]]).map(a => ({ id: a[0], g: a[1] }));
    renderMeals();
    toast("تم تطبيق الوجبة ✅");
  });

  sec.addEventListener("input", e => {
    const t = e.target;
    if (t.matches(".nut-g")) {
      const row = t.closest(".nut-row");
      const it = row && NS.plan[row.dataset.m][+row.dataset.i];
      if (it) { it.g = Math.max(0, num(t.value)); updateNumbers(); }
    } else if (t.matches("[data-time]")) {
      NS.times[t.dataset.time] = t.value; saveNut();
    } else if (t.matches("[data-calc]")) {
      NS.calc[t.dataset.calc] = t.value; saveNut();
    } else if (t.matches("[data-t]")) {
      NS.target[t.dataset.t] = Math.max(0, num(t.value)); updateNumbers();
    } else if (t.id === "nutClient") {
      NS.client = t.value; saveNut();
    } else if (t.id === "nutNotes") {
      NS.notes = t.value; saveNut();
    }
  });

  $q("#nutCalcBtn", sec).addEventListener("click", doCalc);
  $q("#nutResetBtn", sec).addEventListener("click", () => {
    if (!confirm("مسح برنامج التغذية كله؟")) return;
    MEALS.forEach(m => NS.plan[m.id] = []);
    NS.target = { k: 0, p: 0, c: 0, f: 0 }; NS.notes = "";
    fillInputs(); renderMeals(); toast("تم مسح التغذية");
  });

  function openNutPicker(meal) {
    NS.pm = meal; NS.cat = "all";
    const m = MEALS.find(x => x.id === meal);
    $q("#nutPickTitle").textContent = "أضف أصناف لـ " + (m ? m.n : "");
    $q("#nutSearch").value = "";
    $q("#nutCForm").classList.remove("show");
    renderNutChips(); renderNutFoodList();
    picker.classList.add("show");
    document.body.classList.add("lock");
    $q("#nutPlist").scrollTop = 0;
  }
  function closeNutPicker() {
    picker.classList.remove("show");
    document.body.classList.remove("lock");
  }
  function renderNutChips() {
    const hasMine = FOODS.some(f => f.cat === "mine");
    const keys = ["all"].concat(Object.keys(CATS).filter(k => k !== "mine" || hasMine));
    $q("#nutChips").innerHTML = keys.map(k =>
      `<button type="button" class="nut-chip ${NS.cat === k ? "on" : ""}" data-chip="${k}">${k === "all" ? "الكل" : CATS[k]}</button>`).join("");
  }
  function renderNutFoodList() {
    const q = norm($q("#nutSearch").value);
    const list = FOODS.filter(f => (NS.cat === "all" || f.cat === NS.cat) && (!q || norm(f.n).includes(q)));
    $q("#nutCount").textContent = list.length + " صنف";
    const box = $q("#nutPlist"), keep = box.scrollTop;
    if (!list.length) { box.innerHTML = `<div class="empty"><i class="fa-solid fa-magnifying-glass"></i> مفيش أصناف مطابقة</div>`; return; }
    const cur = NS.plan[NS.pm] || [];
    box.innerHTML = list.map(f => {
      const added = cur.some(it => it.id === f.id);
      return `<div class="nut-fk">
        <div style="min-width:0"><b>${esc(f.n)}</b>
          <small>لكل 100 جم: <em>${fmt0(f.k)}</em> سعرة • P ${fmt(f.p)} • C ${fmt(f.c)} • F ${fmt(f.f)}</small></div>
        <button class="btn btn-gold btn-sm" type="button" data-pick="${esc(f.id)}" ${added ? "disabled":""}>${added ? '<i class="fa-solid fa-check"></i> تم':'<i class="fa-solid fa-plus"></i> إضافة'}</button>
      </div>`;
    }).join("");
    box.scrollTop = keep;
  }
  function addNutFood(id) {
    const f = FMAP[id];
    if (!f) return false;
    const cur = NS.plan[NS.pm];
    if (cur.some(it => it.id === id)) return false;
    cur.push({ id, g: f.g });
    renderMeals();
    return true;
  }
  picker.addEventListener("click", e => {
    if (e.target === picker || e.target.closest('[data-nclose="picker"]')) { closeNutPicker(); return; }
    const chip = e.target.closest("[data-chip]");
    if (chip) { NS.cat = chip.dataset.chip; renderNutChips(); renderNutFoodList(); return; }
    const pk = e.target.closest("[data-pick]");
    if (pk && !pk.disabled) { if (addNutFood(pk.dataset.pick)) { renderNutFoodList(); toast("تمت الإضافة ✅"); } }
  });
  $q("#nutSearch").addEventListener("input", renderNutFoodList);
  $q("#nutCToggle").addEventListener("click", () => $q("#nutCForm").classList.toggle("show"));
  $q("#nutCSave").addEventListener("click", () => {
    const n = $q("#nutCN").value.trim();
    const p = num($q("#nutCP").value), c = num($q("#nutCC").value), f = num($q("#nutCF").value);
    let k = num($q("#nutCK").value);
    if (!n) { toast("اكتب اسم الصنف"); return; }
    if (!k) k = p * 4 + c * 4 + f * 9;
    const o = { id: "c_" + Date.now(), n, k, p, c, f, g: num($q("#nutCG").value, 100) || 100 };
    NS.custom.push(o); registerFood(o);
    $q("#nutCForm").classList.remove("show");
    addNutFood(o.id); renderNutChips(); renderNutFoodList(); saveNut();
    toast("تم حفظ الصنف وإضافته ✅");
  });

  /* نسخ كنص أو إرسال واتساب */
  function buildNutText() {
    const client = (NS.client || mainClient()).trim() || "عميل";
    const day = dayTotals();
    let t = `🍽 برنامج التغذية — CAP / ${coachName()}\n👤 اللاعب: ${client}\n`;
    if (NS.target.k > 0) t += `🎯 الهدف: ${GOALS[NS.calc.goal]} (${fmt0(NS.target.k)} سعرة)\n`;
    MEALS.forEach(m => {
      const items = NS.plan[m.id].map(it => ({ it, c: calcItem(it) })).filter(o => o.c);
      if (!items.length) return;
      const tot = sumCalc(items.map(o => o.c));
      t += `\n━━━━━━━━━━━━\n🔸 ${m.n}${NS.times[m.id] ? " (" + NS.times[m.id] + ")" : ""}\n`;
      items.forEach(o => {
        t += `• ${o.c.f.n} — ${fmt(o.it.g)} جم — ${fmt0(o.c.k)} سعرة\n`;
      });
      t += `المجموع: ${fmt0(tot.k)} سعرة | P ${fmt(tot.p)} | C ${fmt(tot.c)} | F ${fmt(tot.f)}\n`;
    });
    t += `\n━━━━━━━━━━━━\n📊 إجمالي اليوم: ${fmt0(day.k)} سعرة (P ${fmt(day.p)} | C ${fmt(day.c)} | F ${fmt(day.f)})\n`;
    if (NS.notes.trim()) t += `\n📝 ملاحظات: ${NS.notes.trim()}\n`;
    return t;
  }
  $q("#nutCopyBtn", sec).addEventListener("click", async () => {
    if (!hasItems()) { toast("أضف أصناف أولاً"); return; }
    const text = buildNutText();
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = text;
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    toast("تم نسخ البرنامج ✅");
  });
  $q("#nutWaBtn", sec).addEventListener("click", () => {
    if (!hasItems()) { toast("أضف أصناف أولاً"); return; }
    window.open("https://wa.me/?text=" + encodeURIComponent(buildNutText()), "_blank");
  });

  /* =========================================================
     تصدير برنامج التغذية متعدد الصفحات (كل وجبة في صفحة منفصلة)
     مع التاريخ واليوم وتصميم رياضي فخم
     ========================================================= */
  async function renderSingleMealPageCanvas(m, mealIdx, totalMeals, day, client, coach, fullDateStr) {
    const W = 1200, H = 1650, P = 48, R = W - P, CW = W - P * 2;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas غير مدعوم");

    // خلفية الصفحة الداكنة الرياضية
    ctx.fillStyle = "#09090b"; ctx.fillRect(0, 0, W, H);

    // هيدر الصفحة
    const COVER = 260;
    ctx.fillStyle = "#121217"; ctx.fillRect(0, 0, W, COVER);
    const grad = ctx.createRadialGradient(W * 0.05, 0, 0, W * 0.05, 0, W * 0.6);
    grad.addColorStop(0, "rgba(224,184,63,0.22)"); grad.addColorStop(1, "rgba(224,184,63,0)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, COVER);
    ctx.fillStyle = "#e0b83f"; ctx.fillRect(0, COVER - 4, W, 4);

    // شعار المنصة والتاريخ واليوم
    txt(ctx, "900 13px Inter, Arial", "#e0b83f", "right", "ltr");
    ctx.fillText("NUTRITION & MEAL PLAN", R, 55);

    txt(ctx, "700 14px Cairo, Arial", "#cbd5e1", "left", "rtl");
    ctx.fillText(fullDateStr, P, 55);

    // اسم الكابتن
    ctx.font = "900 44px Inter, Arial";
    const a = "CAP ", b = "/ " + coach;
    const wa = ctx.measureText(a).width;
    const x0 = Math.max(P, R - wa - ctx.measureText(b).width);
    txt(ctx, "900 44px Inter, Arial", "#fff", "left", "ltr"); ctx.fillText(a, x0, 110);
    ctx.fillStyle = "#e0b83f"; ctx.fillText(fit(ctx, b, R - x0 - wa), x0 + wa, 110);
    ctx.fillRect(R - 70, 130, 70, 3);

    // اسم اللاعب والهدف
    txt(ctx, "900 28px Cairo, Arial", "#fff", "right", "rtl");
    ctx.fillText(fit(ctx, "اللاعب: " + client, CW - 100), R, 175);

    const goalName = GOALS[NS.calc.goal] || "خطة غذائية متوازنة";
    txt(ctx, "800 16px Cairo, Arial", "#ffe08a", "right", "rtl");
    ctx.fillText("الهدف الرياضي: " + goalName + (NS.target.k > 0 ? ` (المستهدف: ${fmt0(NS.target.k)} سعرة)` : ""), R, 210);

    txt(ctx, "800 13px Inter, Arial", "#94a3b8", "left", "ltr");
    ctx.fillText(`PAGE ${mealIdx + 1} OF ${totalMeals}`, P, 210);

    // كروت أهداف اليوم الأربعة (Calories, Protein, Carbs, Fats)
    const by = COVER + 20, gap = 14, bw = (CW - gap * 3) / 4, t = NS.target;
    const macroCards = [
      { l: "سعرات اليوم", v: fmt0(day.k), t: t.k, u: "سعرة", col: "#e0b83f" },
      { l: "بروتين اليوم", v: fmt(day.p), t: t.p, u: "جم", col: "#38bdf8" },
      { l: "كارب اليوم", v: fmt(day.c), t: t.c, u: "جم", col: "#34d399" },
      { l: "دهون اليوم", v: fmt(day.f), t: t.f, u: "جم", col: "#fb923c" }
    ];
    macroCards.forEach((c, i) => {
      const x = R - (i + 1) * bw - i * gap;
      rr(ctx, x, by, bw, 80, 12); ctx.fillStyle = "#141418"; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = "#27272a"; ctx.stroke();
      txt(ctx, "700 12.5px Cairo, Arial", "#94a3b8", "center", "rtl"); ctx.fillText(c.l, x + bw / 2, by + 26);
      txt(ctx, "900 24px Inter, Arial", c.col, "center", "ltr"); ctx.fillText(c.v + " " + c.u, x + bw / 2, by + 56);
    });

    // بنر الوجبة الحالية البارز
    const items = NS.plan[m.id].map(it => ({ it, c: calcItem(it) })).filter(o => o.c);
    const mTot = sumCalc(items.map(o => o.c));

    const mY = by + 80 + 24;
    rr(ctx, P, mY, CW, 96, 16);
    ctx.fillStyle = "#18181f"; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "#e0b83f"; ctx.stroke();

    txt(ctx, "900 30px Cairo, Arial", "#ffffff", "right", "rtl");
    ctx.fillText(`${m.n} ${NS.times[m.id] ? " • " + NS.times[m.id] : ""}`, R - 24, mY + 44);

    txt(ctx, "700 15px Cairo, Arial", "#ffe08a", "right", "rtl");
    ctx.fillText(`إجمالي الوجبة: ${fmt0(mTot.k)} سعرة  (بروتين: ${fmt(mTot.p)} جم • كارب: ${fmt(mTot.c)} جم • دهون: ${fmt(mTot.f)} جم)`, R - 24, mY + 76);

    txt(ctx, "900 16px Inter, Arial", "#e0b83f", "left", "ltr");
    ctx.fillText(`MEAL 0${mealIdx + 1}`, P + 24, mY + 54);

    // جدول الأصناف للوجبة
    const tableY = mY + 96 + 24;
    const thH = 46;
    rr(ctx, P, tableY, CW, thH, 10); ctx.fillStyle = "#27272a"; ctx.fill();

    txt(ctx, "900 15px Cairo, Arial", "#ffffff", "right", "rtl");
    ctx.fillText("الصنف الغذائي والمواصفات", R - 20, tableY + 28);

    txt(ctx, "900 14px Cairo, Arial", "#cbd5e1", "center", "rtl");
    ctx.fillText("الوزن (جم)", P + 430, tableY + 28);
    ctx.fillText("السعرات", P + 310, tableY + 28);
    ctx.fillText("بروتين", P + 210, tableY + 28);
    ctx.fillText("كارب", P + 120, tableY + 28);
    ctx.fillText("دهون", P + 40, tableY + 28);

    let curY = tableY + thH + 8;
    const rowH = 62;
    items.forEach((o, rIdx) => {
      rr(ctx, P, curY, CW, rowH, 10);
      ctx.fillStyle = (rIdx % 2 === 0) ? "#141418" : "#18181f"; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = "#27272a"; ctx.stroke();

      // اسم الصنف
      txt(ctx, "800 17px Cairo, Arial", "#ffffff", "right", "rtl");
      ctx.fillText(fit(ctx, o.c.f.n, 380), R - 20, curY + 36);

      // الوزن بالجرام
      txt(ctx, "900 16px Inter, Arial", "#e2e8f0", "center", "ltr");
      ctx.fillText(fmt(o.it.g) + " g", P + 430, curY + 37);

      // السعرات
      txt(ctx, "900 17px Inter, Arial", "#e0b83f", "center", "ltr");
      ctx.fillText(fmt0(o.c.k), P + 310, curY + 37);

      // الماكروز
      txt(ctx, "800 15px Inter, Arial", "#38bdf8", "center", "ltr");
      ctx.fillText(fmt(o.c.p), P + 210, curY + 37);

      txt(ctx, "800 15px Inter, Arial", "#34d399", "center", "ltr");
      ctx.fillText(fmt(o.c.c), P + 120, curY + 37);

      txt(ctx, "800 15px Inter, Arial", "#fb923c", "center", "ltr");
      ctx.fillText(fmt(o.c.fat), P + 40, curY + 37);

      curY += rowH + 6;
    });

    // كارت مجموع الوجبة التفصيلي في نهاية الجدول
    curY += 12;
    rr(ctx, P, curY, CW, 80, 12);
    ctx.fillStyle = "rgba(224,184,63,0.08)"; ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = "rgba(224,184,63,0.4)"; ctx.stroke();

    txt(ctx, "900 18px Cairo, Arial", "#ffffff", "right", "rtl");
    ctx.fillText(`إجمالي وجبة ${m.n}:`, R - 20, curY + 46);

    txt(ctx, "900 19px Inter, Arial", "#ffe08a", "left", "ltr");
    ctx.fillText(`${fmt0(mTot.k)} kcal  •  P: ${fmt(mTot.p)}g  •  C: ${fmt(mTot.c)}g  •  F: ${fmt(mTot.f)}g`, P + 20, curY + 48);

    curY += 80 + 20;

    // كارت الماء والملاحظات إن وجدت
    const wKg = num(NS.calc.w);
    const waterLiters = wKg > 0 ? (wKg * 0.035).toFixed(1) : "3.0";
    const notesText = (NS.notes || "").trim();

    const boxH = notesText ? 130 : 66;
    rr(ctx, P, curY, CW, boxH, 12);
    ctx.fillStyle = "#141418"; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = "#27272a"; ctx.stroke();

    txt(ctx, "800 15px Cairo, Arial", "#7dd3fc", "right", "rtl");
    ctx.fillText(`💧 شرب الماء الموصى به: حوالي ${waterLiters} لتر على مدار اليوم لترطيب مثالي وتحسين الأيض`, R - 20, curY + 38);

    if (notesText) {
      txt(ctx, "800 14px Cairo, Arial", "#fbbf24", "right", "rtl");
      ctx.fillText("📝 ملاحظات الكابتن: " + fit(ctx, notesText, CW - 60), R - 20, curY + 84);
    }

    // فوتر الصفحة
    txt(ctx, "700 13px Inter, Arial", "#71717a", "center", "ltr");
    ctx.fillText(`CAP ELITE PERSONAL TRAINING • ${m.n} • PAGE ${mealIdx + 1} OF ${totalMeals}`, W / 2, H - 28);

    return canvas;
  }

  async function exportNut(kind, btn) {
    const activeMeals = MEALS.filter(m => (NS.plan[m.id] || []).length > 0);
    if (!activeMeals.length) { toast("أضف أصناف للوجبات أولاً"); return; }
    if (btn) btn.classList.add("busy");
    toast("جاري إعداد صفحات التغذية... ⏳");

    try {
      await loadFonts();
      const client = (NS.client || mainClient()).trim() || "عميل";
      const coach = coachName();
      const day = dayTotals();
      const fullDateStr = formatArFullDate(new Date());

      // رسم كل وجبة في صفحة خاصة بها
      const canvases = [];
      for (let i = 0; i < activeMeals.length; i++) {
        const c = await renderSingleMealPageCanvas(activeMeals[i], i, activeMeals.length, day, client, coach, fullDateStr);
        canvases.push(c);
      }

      const baseName = `CAP-Nutrition-${safeName(coach)}-${safeName(client)}`;

      if (kind === "pdf") {
        const jsPDF = await getJsPDF();
        const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
        const pdfW = pdf.internal.pageSize.getWidth();
        const pdfH = pdf.internal.pageSize.getHeight();

        canvases.forEach((c, idx) => {
          if (idx > 0) pdf.addPage();
          const imgData = c.toDataURL("image/jpeg", 0.94);
          pdf.addImage(imgData, "JPEG", 0, 0, pdfW, pdfH);
        });

        const pdfBlob = pdf.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const fileName = `${baseName}.pdf`;

        // تنزيل فوري للملف
        const el = document.createElement("a");
        el.href = pdfUrl; el.download = fileName; el.style.display = "none";
        document.body.appendChild(el); el.click(); el.remove();
        setTimeout(() => URL.revokeObjectURL(pdfUrl), 15000);

        toast(`تم تنزيل ملف التغذية PDF (${canvases.length} صفحات) بنجاح ✅`);
      } else {
        // PNG export
        for (let i = 0; i < canvases.length; i++) {
          const blob = await canvasToBlob(canvases[i]);
          const mName = activeMeals[i].n || `وجبة-${i+1}`;
          const fileName = `${baseName}-${safeName(mName)}.png`;
          const url = URL.createObjectURL(blob);

          setTimeout(() => {
            const el = document.createElement("a");
            el.href = url; el.download = fileName; el.style.display = "none";
            document.body.appendChild(el); el.click(); el.remove();
            setTimeout(() => URL.revokeObjectURL(url), 15000);
          }, i * 350);
        }

        toast(`تم تنزيل صور التغذية (${canvases.length} وجبات) بنجاح ✅`);
      }
    } catch(err) {
      console.error(err);
      toast("❌ تعذر تصدير التغذية: " + (err && err.message || err));
    } finally {
      if (btn) btn.classList.remove("busy");
    }
  }

  // ربط أزرار التصدير
  const btnNutPng = $q("#nutPngBtn", sec);
  if (btnNutPng) btnNutPng.addEventListener("click", e => exportNut("png", e.currentTarget));
  const btnNutPdf = $q("#nutPdfBtn", sec);
  if (btnNutPdf) btnNutPdf.addEventListener("click", e => exportNut("pdf", e.currentTarget));

  // إتاحة مسح التغذية للجلسة
  window.CAP_RESET_NUTRITION = function() {
    MEALS.forEach(m => { NS.plan[m.id] = []; });
    NS.target = { k: 0, p: 0, c: 0, f: 0 };
    NS.notes = "";
    NS.client = "";
    const elC = $q("#nutClient", sec); if (elC) elC.value = "";
    const elN = $q("#nutNotes", sec); if (elN) elN.value = "";
    renderMeals();
  };

  loadNut();
  fillInputs();
  renderMeals();
}

/* =========================================================
   8) موديول إضافة التمارين المخصصة (Custom Exercises Engine)
   ========================================================= */
function initCustomExerciseEngine() {
  const modal = document.getElementById("customExModal");
  const sportSel = document.getElementById("cExSport");
  const catSel = document.getElementById("cExCat");
  if (!modal || !sportSel || !catSel) return;

  function populateSportsAndCats() {
    const cfgs = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs) || {};
    sportSel.innerHTML = Object.keys(cfgs).map(id => `
      <option value="${id}" ${state.currentSport === id ? "selected" : ""}>${cfgs[id].name}</option>
    `).join("");

    updateCatOptions();
  }

  function updateCatOptions() {
    const sp = sportSel.value || "gym";
    const cats = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.categories && window.CAP_SPORTS_DATA.categories[sp]) || [];
    if (sp === "gym" || !cats.length) {
      catSel.innerHTML = `
        <option value="chest">الصدر</option>
        <option value="back">الظهر</option>
        <option value="legs">الرجل</option>
        <option value="shoulders">الكتف</option>
        <option value="biceps">بايسبس</option>
        <option value="triceps">ترايسبس</option>
        <option value="abs">بطن</option>
      `;
    } else {
      catSel.innerHTML = cats.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    }
  }

  sportSel.addEventListener("change", updateCatOptions);

  function openCustomExModal() {
    populateSportsAndCats();
    const nAr = document.getElementById("cExNameAr"); if (nAr) nAr.value = "";
    const nEn = document.getElementById("cExNameEn"); if (nEn) nEn.value = "";
    const desc = document.getElementById("cExDesc"); if (desc) desc.value = "";
    const howto = document.getElementById("cExHowto"); if (howto) howto.value = "";
    const tips = document.getElementById("cExTips"); if (tips) tips.value = "";
    const mistakes = document.getElementById("cExMistakes"); if (mistakes) mistakes.value = "";
    const stBox = document.getElementById("saveCustomExStatus"); if (stBox) stBox.textContent = "";
    modal.classList.add("show");
    syncLock();
  }

  const openBtn1 = document.getElementById("openAddCustomExBtn");
  if (openBtn1) openBtn1.onclick = openCustomExModal;
  const openBtn2 = document.getElementById("btnQuickAddEx");
  if (openBtn2) openBtn2.onclick = openCustomExModal;

  document.querySelectorAll('[data-close="customExModal"]').forEach(b => {
    b.onclick = () => { modal.classList.remove("show"); syncLock(); };
  });

  const saveBtn = document.getElementById("saveCustomExBtn");
  if (saveBtn) {
    saveBtn.onclick = () => {
      const nameAr = (document.getElementById("cExNameAr")?.value || "").trim();
      const nameEn = (document.getElementById("cExNameEn")?.value || "").trim() || nameAr;
      const sp = sportSel.value || "gym";
      const cat = catSel.value;
      const level = document.getElementById("cExLevel")?.value || "intermediate";
      const desc = (document.getElementById("cExDesc")?.value || "").trim() || `تمرين مخصص لتقوية وتحسين أداء ${nameAr}.`;
      const howtoRaw = (document.getElementById("cExHowto")?.value || "").trim();
      const tipsRaw = (document.getElementById("cExTips")?.value || "").trim();
      const mistakesRaw = (document.getElementById("cExMistakes")?.value || "").trim();

      if (!nameAr) {
        toast("❌ يرجى كتابة اسم التمرين بالعربي أولاً!");
        return;
      }

      const howto = howtoRaw ? howtoRaw.split("\n").map(s => s.trim()).filter(Boolean) : [
        "التمركز بالوضعية الصحيحة والثبات قبل بدء الحركة.",
        "التنفيذ بمدى حركي كامل وتحكم عضلي سليم.",
        "الزفير عند بذل المجهود والشهيق عند العودة لنقطة البداية."
      ];
      const tips = tipsRaw ? [tipsRaw] : ["ابدأ بوزن مناسب وركز على التكنيك السليم."];
      const mistakes = mistakesRaw ? [mistakesRaw] : ["الحركة السريعة العشوائية أو حبس النفس."];

      const exId = `user-ex-${Date.now()}`;
      const spCfg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs && window.CAP_SPORTS_DATA.configs[sp]) || { name: "رياضة" };

      // إنشاء صور الوضعيات الفيكتور النقية 100%
      const phase1Svg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.makePostureSvg)
        ? window.CAP_SPORTS_DATA.makePostureSvg(spCfg.name, nameAr, 1, "الاستعداد والتمركز والانطلاق", "fight")
        : FALLBACK_IMAGE;
      const phase2Svg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.makePostureSvg)
        ? window.CAP_SPORTS_DATA.makePostureSvg(spCfg.name, nameAr, 2, "التنفيذ الكامل وإنهاء الحركة", "fight")
        : FALLBACK_IMAGE;

      const newEx = {
        id: exId,
        sport: sp,
        cat: cat,
        name: nameEn,
        ar: nameAr,
        level: level,
        equipment: "أداة التمرين",
        mechanic: "compound",
        force: "push",
        primaryMuscles: [cat],
        secondaryMuscles: [],
        desc: desc,
        howto: howto,
        tips: tips,
        mistakes: mistakes,
        images: [phase1Svg, phase2Svg],
        local: true,
        userCustom: true
      };

      let userCustomList = [];
      try { userCustomList = JSON.parse(localStorage.getItem(CUSTOM_EXERCISES_USER_KEY)) || []; } catch(e) {}
      userCustomList.push(newEx);
      localStorage.setItem(CUSTOM_EXERCISES_USER_KEY, JSON.stringify(userCustomList));

      state.all.unshift(newEx);
      updateCounts();
      modal.classList.remove("show");
      syncLock();

      if (state.currentSport === sp) {
        renderSportCategories(sp);
      }
      toast(`✅ تم حفظ التمرين (${nameAr}) وإضافته بنجاح!`);
    };
  }
}

/* =========================================================
   9) موديول المساعد الذكي AI (CAP AI Assistant Engine)
   ========================================================= */
function initAiAssistantEngine() {
  const modal = document.getElementById("aiModal");
  const openBtn = document.getElementById("openAiBtn");
  if (!modal || !openBtn) return;

  openBtn.onclick = () => {
    openAiModal();
  };

  document.querySelectorAll('[data-close="aiModal"]').forEach(b => {
    b.onclick = () => { modal.classList.remove("show"); syncLock(); };
  });

  // التبديل بين تبويبات المساعد الذكي
  document.querySelectorAll(".ai-tab").forEach(tabBtn => {
    tabBtn.onclick = () => {
      const tab = tabBtn.dataset.aitab;
      document.querySelectorAll(".ai-tab").forEach(b => b.classList.toggle("active", b === tabBtn));
      document.querySelectorAll(".ai-pane").forEach(p => p.style.display = "none");
      if (tab === "generator") document.getElementById("aiTabGenerator").style.display = "block";
      else if (tab === "nutrition") {
        document.getElementById("aiTabNutrition").style.display = "block";
        updateAiNutView();
      }
      else if (tab === "chat") document.getElementById("aiTabChat").style.display = "block";
    };
  });

  function openAiModal() {
    populateAiSportSelects();
    modal.classList.add("show");
    syncLock();
  }

  function populateAiSportSelects() {
    const cfgs = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs) || {};
    let sportKeys = Object.keys(cfgs);
    if (state.coach !== "MASTER ADMIN" && state.coachSport && state.coachSport !== "all") {
      sportKeys = [state.coachSport];
    }
    const sportsOptions = sportKeys.map(id => `
      <option value="${id}" ${state.currentSport === id ? "selected" : ""}>${(cfgs[id]||{}).name || id}</option>
    `).join("");

    const s1 = document.getElementById("aiSportSelect");
    if (s1) s1.innerHTML = sportsOptions;
    const s2 = document.getElementById("aiNutSportSelect");
    if (s2) s2.innerHTML = sportsOptions;
  }

  // 1. توليد البرنامج الذكي
  const genBtn = document.getElementById("aiGenerateBtn");
  if (genBtn) {
    genBtn.onclick = () => {
      const sp = document.getElementById("aiSportSelect").value || "gym";
      const lvl = document.getElementById("aiLevelSelect").value || "intermediate";
      const goal = document.getElementById("aiGoalSelect").value || "strength";
      const resBox = document.getElementById("aiPlanResult");

      const spCfg = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.configs && window.CAP_SPORTS_DATA.configs[sp]) || { name: "رياضة" };
      const plans = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.ai && window.CAP_SPORTS_DATA.ai.plans) || {};
      const sportPlan = (plans[sp] && plans[sp][lvl]) || (plans[sp] && plans[sp].intermediate) || [];

      let exList = sportPlan.map(id => findEx(id)).filter(Boolean);
      if (!exList.length) {
        exList = state.all.filter(e => e.sport === sp || (sp === "gym" && e.cat === "chest")).slice(0, 4);
      }

      if (!exList.length) {
        resBox.style.display = "block";
        resBox.innerHTML = `<p style="color:#f87171;">لم يتم العثور على تمارين كافية لهذا التخصص.</p>`;
        return;
      }

      const sets = goal === "strength" ? 4 : (goal === "endurance" ? 3 : 4);
      const reps = goal === "strength" ? 8 : (goal === "endurance" ? 15 : 10);
      const rest = goal === "strength" ? 90 : 60;

      resBox.style.display = "block";
      resBox.innerHTML = `
        <h4><i class="fa-solid fa-sparkles"></i> البرنامج المقترح لـ ${spCfg.name} (${LEVEL_NAMES[lvl] || lvl})</h4>
        <p style="font-size:12px;color:#94a3b8;margin:0 0 10px;">
          🎯 <b>الهدف:</b> ${document.getElementById("aiGoalSelect").selectedOptions[0]?.text || goal} • مجموعات: ${sets} • تكرارات: ${reps} • راحة: ${rest} ث
        </p>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">
          ${exList.map((ex, idx) => `
            <div style="display:flex;align-items:center;justify-content:space-between;background:#16161f;padding:8px 12px;border-radius:10px;border:1px solid var(--line2);font-size:12.5px;">
              <span><b>${idx+1}.</b> ${esc(arName(ex))}</span>
              <span style="color:var(--gold2);font-weight:700;">${sets} × ${reps}</span>
            </div>
          `).join("")}
        </div>
        <button type="button" id="aiApplyPlanBtn" class="btn btn-gold btn-block" style="padding:11px;">
          <i class="fa-solid fa-plus-circle"></i> إضافة كل التمارين للبرنامج الآن بنقرة واحدة
        </button>
      `;

      document.getElementById("aiApplyPlanBtn").onclick = () => {
        exList.forEach(ex => {
          if (!isSel(ex.id)) {
            state.selected.push({ id: ex.id, sets: sets, reps: reps, rest: rest });
          }
        });
        renderAll();
        modal.classList.remove("show");
        syncLock();
        toast(`🔥 تم إضافة ${exList.length} تمارين لبرنامجك بنجاح!`);
      };
    };
  }

  // 2. مستشار التغذية
  const nutSportSel = document.getElementById("aiNutSportSelect");
  if (nutSportSel) {
    nutSportSel.onchange = updateAiNutView;
  }
  function updateAiNutView() {
    const sp = document.getElementById("aiNutSportSelect")?.value || "gym";
    const adv = (window.CAP_SPORTS_DATA && window.CAP_SPORTS_DATA.ai && window.CAP_SPORTS_DATA.ai.nutritionAdvice) || {};
    const text = adv[sp] || adv.gym || "احرص على شرب الماء الكافي وتناول البروتين المعقد والكربوهيدرات النظيفة لدعم تدريبك الرياضي.";
    const card = document.getElementById("aiNutContent");
    if (card) {
      card.innerHTML = text.replace(/\*\*(.*?)\*\*/g, "<b style='color:var(--gold2);'>$1</b>");
    }
  }

  const goToNutBtn = document.getElementById("aiGoToNutritionTab");
  if (goToNutBtn) {
    goToNutBtn.onclick = () => {
      modal.classList.remove("show");
      syncLock();
      switchMainTab("nutrition");
    };
  }

  // 3. شات استشارات التدريب
  const chatInput = document.getElementById("aiChatInput");
  const sendBtn = document.getElementById("aiChatSendBtn");
  const historyBox = document.getElementById("aiChatHistory");

  function sendAiQuery(queryText) {
    const text = (queryText || (chatInput && chatInput.value) || "").trim();
    if (!text) return;
    if (chatInput) chatInput.value = "";

    const userDiv = document.createElement("div");
    userDiv.className = "ai-msg user";
    userDiv.innerHTML = `<div class="ai-msg-head"><i class="fa-solid fa-user"></i> الكابتن</div><div class="ai-msg-body">${esc(text)}</div>`;
    historyBox.appendChild(userDiv);

    const botDiv = document.createElement("div");
    botDiv.className = "ai-msg bot";
    botDiv.innerHTML = `<div class="ai-msg-head"><i class="fa-solid fa-robot"></i> كابتن AI</div><div class="ai-msg-body"><i class="fa-solid fa-circle-notch fa-spin"></i> جاري التحليل وصياغة النصيحة...</div>`;
    historyBox.appendChild(botDiv);
    historyBox.scrollTop = historyBox.scrollHeight;

    setTimeout(() => {
      const resp = generateCoachAiResponse(text);
      botDiv.querySelector(".ai-msg-body").innerHTML = resp;
      historyBox.scrollTop = historyBox.scrollHeight;
    }, 350);
  }

  if (sendBtn) sendBtn.onclick = () => sendAiQuery();
  if (chatInput) {
    chatInput.onkeydown = e => { if (e.key === "Enter") sendAiQuery(); };
  }

  document.querySelectorAll(".ai-chip-prompt").forEach(chip => {
    chip.onclick = () => sendAiQuery(chip.dataset.prompt);
  });
}

function generateCoachAiResponse(q) {
  const normQ = (q || "").trim().toLowerCase();

  // 1. التحيات والمحادثات اليومية والودية
  if (/عامل ايه|ازيك|اخبارك|كيفك|شخبارك|أخبارك|إزيك|شلونك|تمام|كويس/.test(normQ)) {
    return "أنا بخير والحمد لله وبأفضل حال يا كابتن! 🦁 جاهز أساعدك في أي خطة تدريب، تحليل تكتيكي، أو جدول تغذية محتاجه اليوم. تحب نبدأ بإيه؟";
  }
  if (/سلام عليكم|السلام عليكم|سلام|أهلاً|اهلا|مرحبا|مرحباً|هاي|هلو/.test(normQ)) {
    return "وعليكم السلام ورحمة الله وبركاته يا بطل! مرحباً بك في مساعدك الذكي <b>كابتن AI</b>. تحت أمرك في أي استفسار تدريبي، رياضي، أو غذائي اليوم! 💪";
  }
  if (/صباح الخير|صباحك/.test(normQ)) {
    return "صباح النشاط والطاقة والهمة العالية يا كابتن! ☀️ يوم تدريبي موفق ومثمر إن شاء الله. جاهز لمساعدتك في ترتيب برامج اليوم!";
  }
  if (/مساء الخير|مسائك/.test(normQ)) {
    return "مساء القوة والبطولات يا كابتن! 🌙 أتمنى يكون يومك الرياضي ناجح. محتاج نراجع تمرين أو خطة غذائية حالياً؟";
  }
  if (/شكرا|شكراً|تسلم|الله يعطيك العافية|الله يسلمك|مشكور|الف شكر/.test(normQ)) {
    return "العفو يا كابتن! في خدمتك دايماً وأتمنى لك ولأبطالك أعلى المستويات والبطولات إن شاء الله 🏆";
  }
  if (/مين انت|من انت|عرف نفسك|مين حضرتك|وظيفتك/.test(normQ)) {
    return "أنا <b>كابتن AI</b> — المستشار التدريبي الذكي لمنصة <b>CAP ELITE</b> 👑. أساعدك في تصميم خطط التدريب لـ 18 تخصصاً رياضياً، حساب الماكروز والتغذية، التدرج في الأحمال، والوقاية من الإصابات.";
  }

  // 2. تقسيمات الجيم وبناء العضلات
  if (/ppl|بوش بول|push pull legs|بوش بول ليج/.test(normQ)) {
    return "🔥 <b>نظام Push / Pull / Legs (PPL):</b><br>• <b>اليوم 1 (Push - دفع):</b> صدر + كتف أمامي وجانبي + ترايسبس.<br>• <b>اليوم 2 (Pull - سحب):</b> ظهر + كتف خلفي + بايسبس + ترابيس.<br>• <b>اليوم 3 (Legs - أرجل):</b> كوادز + هامسترنج + جلوتس + سمانة + بطن.<br>• <b>اليوم 4:</b> راحة واستشفاء، ثم التكرار 3 أيام أو نظام 5-6 أيام أسبوعياً مع راحة 48 ساعة لكل مجموعة.";
  }
  if (/upper lower|ابر لوور|ابار لور|علوي وسفلي/.test(normQ)) {
    return "⚡ <b>نظام Upper / Lower (4 أيام أسبوعياً):</b><br>• <b>الأحد:</b> الجزء العلوي (Upper A) بتركيز أوزان ثقيلة (3-6 تكرارات).<br>• <b>الاثنين:</b> الجزء السفلي (Lower A) بتركيز القوة.<br>• <b>الثلاثاء:</b> راحة نشطة.<br>• <b>الأربعاء:</b> الجزء العلوي (Upper B) بتركيز الضخامة والهايبرتروفي (8-12 تكرار).<br>• <b>الخميس:</b> الجزء السفلي (Lower B).<br>• ممتاز جداً للتوفيق بين بناء القوة والضخامة والاستشفاء العصبي!";
  }
  if (/تضخيم|بناء عضل|هايبرتروفي|hypertrophy/.test(normQ)) {
    return "💪 <b>قواعد التضخيم العضلي الصافي:</b><br>1. <b>المدى الحركي والتكرارات:</b> 6 إلى 12 تكراراً للوصول لقرب الفشل العضلي (RIR 1-2).<br>2. <b>الزيادة التدريجية (Progressive Overload):</b> زيادة الوزن أو التكرار كل أسبوعين.<br>3. <b>السعرات:</b> فائض سعرات 300-500 سعرة فوق احتياجك مع 2 جم بروتين لكل كجم وزن.<br>4. <b>النوم:</b> 7-9 ساعات نوم عميق ليلاً لإفراز هرمون النمو (GH).";
  }
  if (/تنشيف|حرق دهون|دايت|رجيم|تخسيس/.test(normQ)) {
    return "🔥 <b>استراتيجية التنشيف وحرق الدهون مع حماية العضلات:</b><br>1. <b>عجز السعرات:</b> خصم 400-500 سعرة من السعرات اليومية دون حرمان مفرط.<br>2. <b>رفع البروتين:</b> من 2.0 إلى 2.4 جم لكل كجم لحماية الكتلة العضلية من الهدم.<br>3. <b>الحفاظ على شدة الأوزان:</b> تمرن بنفس الأوزان التي بنيت بها عضلاتك ولا تخفف الوزن لزيادة التكرار عشوائياً.<br>4. <b>الكارديو الذكي:</b> المشي السريع على منحدر (Incline Treadmill) 20-30 دقيقة يومياً دون إجهاد المفاصل.";
  }

  // 3. المكملات الغذائية والتغذية
  if (/كرياتين|creatine/.test(normQ)) {
    return "🧪 <b>الكرياتين مونوهيدرات (Creatine Monohydrate):</b><br>• المكمل الأكثر دراسة وأماناً عالمياً؛ يزيد مخازن الـ Phosphocreatine في العضلات لتوليد طاقة انفجارية وسرعة استشفاء.<br>• <b>الجرعة:</b> 5 جرام يومياً في أي وقت ثابت، مع كوب ماء وفير (لا داعي لمرحلة التحميل المكلفة، 5 جم يومياً تكفي لتشبع العضلات خلال 3-4 أسابيع).";
  }
  if (/واي بروتين|whey protein|بروتين بودر/.test(normQ)) {
    return "🥛 <b>الواي بروتين (Whey Protein):</b><br>• مصدر سريع ونقي للبروتين عالي الجودة والأحماض الأمينية الأساسية (BCAAs).<br>• ليس سحراً ولكنه أداة ممتازة وعملية لإكمال احتياجك اليومي من البروتين (1.6 - 2.2 جم لكل كجم وزن). سكوب واحد يعطيك حوالي 24-25 جم بروتين صافي.";
  }
  if (/ماء|سوائل|ترطيب|شرب الماء/.test(normQ)) {
    return "💧 <b>الترطيب الرياضي المثالي:</b><br>• احسب 35 إلى 40 مل لكل كجم من وزن جسمك يومياً.<br>• أضف 500 مل إلى 750 مل لكل ساعة تمرين شديدة لتعويض العرق المفقود.<br>• انخفاض نسبة السوائل في الجسم بنسبة 2% فقط يقلل من كفاءة القوة والتركيز بنسبة تصل إلى 15%!";
  }

  // 4. الرياضات المتخصصة (ملاكمة، سباحة، قتال، قدم، سلة، إلخ)
  if (/ملاكمة|بوكس|boxing/.test(normQ)) {
    return "🥊 <b>نصائح الملاكمة الاحترافية:</b><br>• قوة اللكمة لا تنبع من الذراع بل تبدأ من ارتكاز ودوران مشط القدم الخلفي والحوض.<br>• اليد العائدة دائماً تعود لحماية الفك (Chin Down, Hands Up).<br>• تدرب على الشادو بوكسينج أمام المرآة لضبط حركة القدمين (Footwork) والـ Pendulum Step دون ترنح.";
  }
  if (/كيك بوكس|kickboxing/.test(normQ)) {
    return "🥋 <b>أسرار الكيك بوكسينج:</b><br>• في ركلات الراوند هاوس: دوّر قدم الارتكاز 180 درجة واضرب بقصبة الساق (الشن) وليس بمشط القدم لتفادي الكسور.<br>• حافظ على الشين تشيك الدفاعي (Shin Check) بزاوية 45 درجة لصد اللو كيك الخصم فوراً.";
  }
  if (/mma|فنون قتالية|قتال مختلط/.test(normQ)) {
    return "🥋 <b>تكتيكات الـ MMA المتكاملة:</b><br>• الانتقال السلس (Transition) بين اللكم والإسقاط هو المفتاح: استخدم لكمة الأوفرهاند للتمويه والدخول في الدبل ليج تيك داون.<br>• في القتال الأرضي: تحكم دائماً في وضعية الرأس وحافظ على قاعدة عريضة لمنع القلب أو الإخضاع.";
  }
  if (/سباحة|swimming/.test(normQ)) {
    return "🏊 <b>تطوير سرعة وكفاءة السباحة:</b><br>• ركّز على موضع الكوع العالي (High Elbow Catch) عند سحب الماء لزيادة الدفع وتخفيف إجهاد الكتف.<br>• الزفير المستمر التدريجي تحت الماء والشهيق السريع بالدوران الجانبي للرأس يمنعان ارتفاع الساقين للأسفل والغرق.";
  }
  if (/تايكوندو|taekwondo/.test(normQ)) {
    return "⚡ <b>التايكوندو الأولمبي:</b><br>• سرعة ركلة الدوليو تشاجي تعتمد على سرعة رفع الركبة للأعلى قبل فتح الساق بحركة سوطية خاطفة.<br>• مارس مرجحة الساق الديناميكية يومياً لفتح الحوض 180 درجة دون تمزق الأوتار الضامة.";
  }
  if (/جودو|judo/.test(normQ)) {
    return "🥋 <b>فلسفة الجودو:</b><br>• كسر التوازن (كوزوشي) يمثل 70% من نجاح أي رمية (مثل سيو ناجي أو أوسوتو جاري).<br>• احرص على إتقان كسر السقوط (أوكيمي) يومياً لحماية الرأس والعمود الفقري عند التعرض لأي رمية.";
  }
  if (/كاراتيه|karate/.test(normQ)) {
    return "🥋 <b>الكاراتيه والكوميتيه:</b><br>• ثبات وقفة الزينكوتسو داتشي وبناء جذور قوية في الأرض يمنح لكمة الجياكو زوكي عزم دوران هائل.<br>• في الكوميتيه: سرعة الانطلاق في الكيزامي زوكي تتطلب ارتكازاً خفيفاً على مشطي القدمين.";
  }
  if (/مصارعة|wrestling/.test(normQ)) {
    return "🤼 <b>قوة وتحمل المصارع:</b><br>• تدريب السبراول الانفجاري الفوري عند أدنى محاولة غوص للخصم يحميك من خسارة النقاط.<br>• تقوية الرقبة بكوبري المصارع وحمل أكياس الرمل الثقيلة يبني متانة جسدية تقاوم أعتى الضغوط.";
  }
  if (/كرة قدم|football/.test(normQ)) {
    return "⚽ <b>تطوير لاعب كرة القدم:</b><br>• سلم الرشاقة (Agility Ladder) يومياً لتحسين خفة القدمين والتوافق الحركي في المساحات الضيقة.<br>• التسديد الصاروخي بالليسات يتطلب تثبيت الصدر فوق الكرة وإحكام قفل مفصل الكاحل لمنع طيران الكرة.";
  }
  if (/كرة سلة|basketball/.test(normQ)) {
    return "🏀 <b>مهارات كرة السلة:</b><br>• قاعدة BEEF في التصويب (Balance, Eyes, Elbow, Follow-through) تضمن ثبات مسار الرميات الحرة والثلاثية.<br>• تدريبات البليومتريكس والقفز الصندوقي (Box Jumps) تبني الارتقاء الرأسي الخارق للريباوند والبلوك.";
  }
  if (/رفع أثقال|weightlifting/.test(normQ)) {
    return "🏋️ <b>رفع الأثقال الأولمبي:</b><br>• في رفعة الخطف (Snatch): مسار البار يجب أن يظل ملاصقاً تماماً للجسم مع تفجير الحوض رأسياً للأعلى.<br>• في الكلين والنتر: ارفع الكوعين للأعلى بشكل أفقي فور استقرار البار على الترقوة لتأمين حمولة الوزن بأمان.";
  }

  // 5. الإصابات والإحماء والتأهيل
  if (/إصابة|اصابة|وجع|ألم|كتف|ركبة|ظهر|مفصل/.test(normQ)) {
    return "🛡️ <b>التعامل مع الآلام الرياضية والوقاية:</b><br>• <b>قاعدة ذهبية:</b> لا تتمرن أبداً مع ألم حاد ومفاجئ (Sharp Pain) داخل المفصل، استشر أخصائي العلاج الطبيعي فوراً.<br>• لآلام أسفل الظهر: قوّي عضلات الجلوتس والكور (البلانك وهيب ثراست) وتجنب تقوس الظهر في الرفعات الثقيلة.<br>• لآلام الكتف: دمج تمارين الروتاتور كاف بالأستك كإحماء وقائي قبل كل تمرين دفع.";
  }

  // 6. الرد العام الذكي الشامل
  return `💡 <b>إرشادات كابتن AI:</b> يسعدني تقديم المساعدة في كافة جوانب التدريب! لكل تمرين رياضي، الأداء المتقن (Technique) يسبق دائماً زيادة الأوزان. يمكنك سؤالي عن: تقسيمات التمارين (PPL / Upper Lower)، نصائح أي رياضة من الـ 18 تخصصاً، خطط التغذية وحساب الماكروز، أو بروتوكولات الإحماء والاستشفاء!`;
}

/* =========================================================
   10) محرك تبديل المظهر (Dark & Light Mode Engine)
   ========================================================= */
function initThemeEngine() {
  const THEME_KEY = "cap_elite_theme";
  let currentTheme = "dark";
  try {
    currentTheme = localStorage.getItem(THEME_KEY) || "dark";
  } catch(e) {}

  function applyTheme(theme) {
    currentTheme = theme === "light" ? "light" : "dark";
    if (currentTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try { localStorage.setItem(THEME_KEY, currentTheme); } catch(e) {}

    document.querySelectorAll(".js-theme-toggle").forEach(btn => {
      const icon = btn.querySelector("i");
      if (icon) {
        if (currentTheme === "light") {
          icon.className = "fa-solid fa-moon";
          btn.setAttribute("title", "التبديل إلى الوضع الليلي (Dark Mode)");
        } else {
          icon.className = "fa-solid fa-sun";
          btn.setAttribute("title", "التبديل إلى الوضع النهاري (Light Mode)");
        }
      }
    });
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest(".js-theme-toggle");
    if (btn) {
      e.preventDefault();
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
      toast(nextTheme === "light" ? "☀️ تم تفعيل الوضع النهاري (Light Mode)" : "🌙 تم تفعيل الوضع الليلي (Dark Mode)");
    }
  });

  applyTheme(currentTheme);
}

/* =========================================================
   11) التشغيل الموحد لكافة الأنظمة
   ========================================================= */
(function init(){
  initThemeEngine();
  let saved=null;
  try{saved=sessionStorage.getItem(SESSION_KEY);}catch(e){}
  if(saved) {
    if (saved === "MASTER ADMIN" || DEMO_COACHES.some(c => c.name === saved)) {
      showApp(saved);
    } else {
      let custom = [];
      try { custom = JSON.parse(localStorage.getItem(CUSTOM_TRAINERS_KEY)) || []; } catch(e){}
      const tc = custom.find(c => c.name.toUpperCase() === saved.toUpperCase());
      if (tc && tc.expiresAt && new Date(tc.expiresAt) < new Date()) {
        try { sessionStorage.removeItem(SESSION_KEY); } catch(e){}
        showLogin();
        setTimeout(()=>{
          const errEl = document.getElementById("loginError");
          if (errEl) errEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> عذراً يا كابتن ${saved}، انتهى اشتراك حسابك بتاريخ (${formatArDate(tc.expiresAt)}). يرجى مراجعة الأدمن للتجديد.`;
        }, 80);
      } else {
        showApp(saved);
      }
    }
  }
  loadDatabase();
  initIntegratedAdmin();
  initNutritionSystem();
  initCustomExerciseEngine();
  initAiAssistantEngine();
})();
