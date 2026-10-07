# Script to build complete 276 gym exercises dataset
$srcPath = "C:\Users\M03TSM\.gemini\antigravity\brain\f79359bc-48f6-4bb5-8bbf-919053b88129\.user_uploaded\media_1791308459034.js"
$content = Get-Content -Raw -Encoding UTF8 $srcPath

# Extract original 117 CUSTOM_EXERCISES
$re = [regex]'\{"id":"cap-([^"]+)",[^\r\n]+'
$matches = $re.Matches($content)
$localExercises = @()
foreach ($m in $matches) {
    $line = $m.Value
    if ($line.EndsWith(",")) { $line = $line.Substring(0, $line.Length - 1) }
    $localExercises += $line
}
Write-Host "Extracted local exercises count:" $localExercises.Count

# Define 60 Cardio exercises
$cardioDefs = @(
  @("gym-cardio-01", "Treadmill Running", "جري على المشاية", "intermediate", "machine", "quadriceps", "calves", "جري بسرعة متوسطة إلى عالية لرفع معدل نبض القلب وحرق الدهون."),
  @("gym-cardio-02", "Incline Treadmill Walk", "مشي على مشاية مائلة", "beginner", "machine", "glutes", "hamstrings", "مشي على ميل مرتفع لحرق دهون مكثف وتفعيل عضلات المؤخرة والساقين."),
  @("gym-cardio-03", "Stationary Bike HIIT", "عجلة ثابتة فترات متقطعة", "intermediate", "machine", "quadriceps", "calves", "تبديل سريع وفترات راحة قصيرة لرفع اللياقة والتحمل القلبي."),
  @("gym-cardio-04", "Rowing Machine 500m", "تجديف جهاز 500 متر", "intermediate", "machine", "lats", "quadriceps", "تمرين شامل للجسم يدمج السحب ودفع الساقين للياقة بدنية خارقة."),
  @("gym-cardio-05", "Jump Rope Single Under", "نط الحبل فردي", "beginner", "other", "calves", "shoulders", "تحسين خفة الحركة والتوافق العضلي العصبي وحرق سعرات سريع."),
  @("gym-cardio-06", "Stair Climber Endurance", "جهاز السلالم للتحمل", "intermediate", "machine", "glutes", "quadriceps", "صعود درجات مستمر لشد الجزء السفلي وتقوية أوتار الركبة."),
  @("gym-cardio-07", "Elliptical Cross Trainer", "جهاز إبتيكال كارديو", "beginner", "machine", "quadriceps", "glutes", "تمرين منخفض الصدمات للمفاصل لحرق الدهون بأمان للمبتدئين."),
  @("gym-cardio-08", "Burpees", "بيربيز بوزن الجسم", "expert", "body only", "chest", "quadriceps", "تمرين انفجاري يجمع النزول للضغط والقفز لرفع النبض لأقصى حد."),
  @("gym-cardio-09", "Mountain Climbers Cardio", "تسلق الجبل كارديو", "beginner", "body only", "abdominals", "quadriceps", "حركة تبادل الركبتين بسرعة بوضع الضغط لتقوية الكور وحرق الطاقة."),
  @("gym-cardio-10", "Jumping Jacks", "قفز جاكس لفتح وضم الجسم", "beginner", "body only", "calves", "shoulders", "تسخين قلبي ممتاز وتنشيط الدورة الدموية للجسم بالكامل."),
  @("gym-cardio-11", "High Knees Sprint", "جري مكاني برفع الركبتين", "intermediate", "body only", "quadriceps", "abdominals", "رفع الركبتين للصدر بسرعة لتطوير سرعة الجري والرشاقة."),
  @("gym-cardio-12", "Butt Kicks", "جري مكاني لملامسة الكعبين", "beginner", "body only", "hamstrings", "quadriceps", "تمرين سريع لتنشيط الفخذ الخلفي وتسريع حركة الأقدام."),
  @("gym-cardio-13", "Skater Hops", "قفزات التزلج الجانبية", "intermediate", "body only", "glutes", "abductors", "قفز من جانب لآخر لتعزيز التوازن الحركي وقوة الأرجل الجانبية."),
  @("gym-cardio-14", "Box Jumps Plyo", "قفز على الصندوق الخشبي", "intermediate", "other", "quadriceps", "calves", "تطوير القوة الانفجارية للأرجل وزيادة سرعة الاستجابة."),
  @("gym-cardio-15", "Battle Rope Double Slams", "ضربات حبال المعركة المزدوجة", "intermediate", "other", "shoulders", "abdominals", "ضرب الحبال بالأرض بقوة لرفع ضربات القلب وتفجير الكتف والساعد."),
  @("gym-cardio-16", "Battle Rope Alternating", "تموجات الحبال التبادلية", "intermediate", "other", "shoulders", "abdominals", "موجات سريعة ومستمرة لبناء تحمل الكتف والعضلات المركزية."),
  @("gym-cardio-17", "Assault Air Bike Sprint", "عجلة الهواء سبرنت", "expert", "machine", "quadriceps", "shoulders", "تحدي الأير بايك الأقصى لدفع وسحب المقابض مع التبديل بأقصى جهد."),
  @("gym-cardio-18", "SkiErg Double Pull", "جهاز التزلج سحب مزدوج", "intermediate", "machine", "lats", "triceps", "سحب كابلات السكييرج للأسفل لبناء قوة التحمل للظهر والذراعين."),
  @("gym-cardio-19", "Sled Push Turf", "دفع الزلاجة الحديدية", "intermediate", "other", "quadriceps", "calves", "دفع الزلاجة على النجيل الصناعي لبناء قوة جبارة للأرجل والتحمل."),
  @("gym-cardio-20", "Sled Pull Backward", "سحب الزلاجة للخلف", "intermediate", "other", "quadriceps", "hamstrings", "سحب الزلاجة بالرجوع للخلف لحماية الركبة وبناء الفخذ الأمامي."),
  @("gym-cardio-21", "Tuck Jumps Cardio", "قفز ثني الركبتين بالهواء", "expert", "body only", "quadriceps", "abdominals", "قفز عمودي مع ضم الركبتين للصدر لتطوير القدرة الانفجارية."),
  @("gym-cardio-22", "Broad Jumps", "قفز أمامي طولي", "intermediate", "body only", "glutes", "hamstrings", "القفز للأمام لأبعد مسافة بالقدمين معاً لتحسين الدفع الحركي."),
  @("gym-cardio-23", "Shadow Boxing Cardio", "ملاكمة الظل كارديو", "beginner", "body only", "shoulders", "abdominals", "توجيه لكمات حرة في الهواء بتناسق حركي لحرق السعرات وتحسين التوافق."),
  @("gym-cardio-24", "Agility Ladder In-Out", "سلم الرشاقة دخول وخروج", "beginner", "other", "calves", "quadriceps", "حركات أقدام سريعة لتطوير سرعة رد الفعل والتوازن الرياضي."),
  @("gym-cardio-25", "Lateral Shuffles", "حركة التبديل الجانبية السريعة", "beginner", "body only", "adductors", "abductors", "تحرك جانبي سريع منخفض لحماية المفاصل وتحسين الدفاع الحركي."),
  @("gym-cardio-26", "Bear Crawl Endurance", "زحف الدب للتحمل", "intermediate", "body only", "shoulders", "abdominals", "الزحف على الأطراف الأربعة لتقوية الجذع والأكتاف وتحمل الجسم."),
  @("gym-cardio-27", "Crab Walk Cardio", "مشي السلطعون العكسي", "beginner", "body only", "triceps", "glutes", "تحرك خلفي لتقوية الجزء الخلفي من الجسم والترايسبس."),
  @("gym-cardio-28", "Shuttle Runs 10m", "جري مكوكي 10 أمتار", "intermediate", "body only", "quadriceps", "calves", "انطلاق سريع ولمس الخط والعودة لتطوير التسارع والفرملة."),
  @("gym-cardio-29", "Jump Squats Power", "سكوات مع القفز", "intermediate", "body only", "quadriceps", "glutes", "أداء قرفصاء ثم دفع الأرض بقفزة عمودية لتفجير عضلات الأرجل."),
  @("gym-cardio-30", "Split Jump Lunges", "لانجز متبادل مع القفز", "expert", "body only", "quadriceps", "glutes", "تبديل وضعية الساقين بالهواء لتعزيز توازن الرجلين والقوة."),
  @("gym-cardio-31", "Plank Jacks Core Cardio", "بلانك جاكس فتح وضم الأرجل", "beginner", "body only", "abdominals", "calves", "الثبات على الساعدين مع فتح وضم القدمين لدمج الكور والكارديو."),
  @("gym-cardio-32", "Speed Skaters Plyo", "تزلج السرعة الرياضي", "intermediate", "body only", "abductors", "glutes", "حركة قفز جانبية واسعة تحاكي التزلج السريع على الجليد."),
  @("gym-cardio-33", "Step-Ups Cardio Pace", "صعود الصندوق بسرعة", "beginner", "other", "quadriceps", "glutes", "صعود ونزول منتظم على منصة لتقوية الفخذ وتنشيط عضلة القلب."),
  @("gym-cardio-34", "Medicine Ball Slams", "ضرب الكرة الطبية بالأرض", "intermediate", "medicine ball", "lats", "abdominals", "رفع الكرة الطبية فوق الرأس ورميها بقوة في الأرض لتفريغ الطاقة."),
  @("gym-cardio-35", "Kettlebell Swings Cardio", "مرجحة الكيتل بل للتحمل", "intermediate", "kettlebells", "hamstrings", "glutes", "دفع الحوض للأمام لمرجحة الوزن وبناء القوة الانفجارية للظهر السفلي."),
  @("gym-cardio-36", "Kettlebell Snatches", "خطف الكيتل بل بيد واحدة", "expert", "kettlebells", "shoulders", "glutes", "رفع الوزن بحركة واحدة من الأرض لفوق الرأس لكفاءة قلبية عالية."),
  @("gym-cardio-37", "Rowing Machine Sprints", "سبرنت تجديف 200م", "expert", "machine", "lats", "biceps", "أقصى سرعة تجديف ممكنة لمدة قصيرة لرفع الاستهلاك الأكسجيني."),
  @("gym-cardio-38", "Sprint Intervals Treadmill", "فترات جري سرعة قصوى", "expert", "machine", "quadriceps", "hamstrings", "التبديل بين الجري بأقصى سرعة 30 ثانية والمشي الهادئ 60 ثانية."),
  @("gym-cardio-39", "Jump Rope Double Unders", "نط الحبل لفتين بالقفزة", "expert", "other", "calves", "forearms", "دوران الحبل مرتين تحت القدمين في القفزة الواحدة لتحدي اللياقة."),
  @("gym-cardio-40", "Farmer's Walk Cardio", "مشي المزارع السريع بأوزان", "intermediate", "dumbbell", "forearms", "traps", "حمل أوزان ثقيلة والمشي السريع لمسافة طويلة لبناء صلابة الجسم."),
  @("gym-cardio-41", "Tire Flips Power", "قلب الإطار المطاطي الثقيل", "expert", "other", "lower back", "glutes", "رفع ودفع إطار شاحنة ثقيل لتطوير القوة البدنية الشاملة."),
  @("gym-cardio-42", "Dumbbell Thrusters Cardio", "ثراسترز دامبلز كارديو", "expert", "dumbbell", "quadriceps", "shoulders", "سكوات كامل يتبعه دفع الدامبلز فوق الرأس لحرق سعرات هائل."),
  @("gym-cardio-43", "Wall Balls Crossfit", "رمي الكرة الطبية على الحائط", "intermediate", "medicine ball", "quadriceps", "shoulders", "سكوات عميق مع قذف الكرة لارتفاع 3 أمتار والتقاطها."),
  @("gym-cardio-44", "Row-Bike Dual Relay", "تناوب التجديف والعجلة", "intermediate", "machine", "quadriceps", "lats", "جلسة تبادلية بين جهازي التجديف والعجلة لكسر روتين التمرين."),
  @("gym-cardio-45", "Plate Push Sled Simulation", "دفع الطارة على الأرض", "intermediate", "other", "quadriceps", "shoulders", "دفع طارة وزن على أرضية صالة التدريب لبناء تحمل الأرجل."),
  @("gym-cardio-46", "High-to-Low Rope Slams", "ضربات الحبل المتناوبة للأسفل", "intermediate", "other", "shoulders", "abdominals", "موجات قوية تبادلية تركز على الجذع وعضلات البطن."),
  @("gym-cardio-47", "Lateral Box Step-Over", "تخطي الصندوق الجانبي السريع", "intermediate", "other", "quadriceps", "adductors", "صعود وتخطي الصندوق للجانب الآخر لمرونة الحوض والسرعة."),
  @("gym-cardio-48", "Burpee Box Jump Over", "بيربيز مع القفز فوق الصندوق", "expert", "other", "chest", "quadriceps", "بيربي كامل ثم قفز فوق الصندوق والنزول على الجانب المقابل."),
  @("gym-cardio-49", "Incline Spin Sprint", "سبينينج على مقاومة عالية", "intermediate", "machine", "quadriceps", "glutes", "تبديل قوي وثابت على دراجة الغزل لبناء قوة عضلات الفخذ."),
  @("gym-cardio-50", "Arc Trainer Cardio", "جهاز آرك ترينر للقوس الحركي", "beginner", "machine", "glutes", "hamstrings", "حركة قوسية للأرجل تقلل الضغط على مفصل الركبة وتضاعف الحرق."),
  @("gym-cardio-51", "Shadow Sparring Footwork", "تحركات القدمين الملاكمة", "beginner", "body only", "calves", "quadriceps", "تمارين خفة القدمين للأمام والخلف لتعزيز التوازن الرياضي."),
  @("gym-cardio-52", "Medicine Ball Rotational Throw", "رمي الكرة الطبية الدوراني", "intermediate", "medicine ball", "abdominals", "shoulders", "قذف الكرة للجدار بحركة جذع جانبية لتقوية عضلات الخواصر."),
  @("gym-cardio-53", "Lateral Bound and Stick", "وثبات جانبية مع الثبات", "intermediate", "body only", "abductors", "glutes", "قفز على قدم واحدة مع الثبات لتفادي إصابات الرباط الصليبي."),
  @("gym-cardio-54", "Bear Crawl Sled Drag", "سحب الزلاجة بوضع الدب", "expert", "other", "shoulders", "abdominals", "سحب الوزن بحزام مع زحف الدب لتقوية الكور والظهر."),
  @("gym-cardio-55", "Dumbbell Snatch Alternating", "خطف دمبل تبادلي", "intermediate", "dumbbell", "lower back", "shoulders", "رفع الدمبل من الأرض لأعلى الرأس بحركة انفجارية واحدة."),
  @("gym-cardio-56", "Incline Treadmill Sprints", "جري سبرنت على ميل مشاية", "expert", "machine", "hamstrings", "calves", "فترات جري مكثفة على زاوية ميل لتطوير القوة القصوى للأوتار."),
  @("gym-cardio-57", "Rower 2000m Challenge", "تحدي التجديف 2000 متر", "expert", "machine", "lats", "quadriceps", "اختبار لياقة قياسي عالمي لقياس التحمل القلبي العضلي الشامل."),
  @("gym-cardio-58", "Assault Bike 30s All-Out", "30 ثانية أقصى قوة إير بايك", "expert", "machine", "quadriceps", "shoulders", "مجهود لاهوائي خالص لحرق الدهون الموضعية ورفع كفاءة القلب."),
  @("gym-cardio-59", "SkiErg Interval 100m", "سبرنت التزلج 100 متر", "intermediate", "machine", "triceps", "lats", "سحب سريع لاهوائي لبناء عضلات الظهر العلوية والذراعين."),
  @("gym-cardio-60", "Track Lap Sprint 400m", "سبرنت مضمار 400 متر", "expert", "body only", "quadriceps", "hamstrings", "جري لفة كاملة على المضمار بأقصى سرعة ممكنة لبناء التحمل الخاص.")
)

# Define 99 Warmup exercises
$warmupDefs = @(
  @("gym-warmup-01", "Arm Circles Forward", "دوائر الذراعين للأمام", "beginner", "body only", "shoulders", "chest", "تحريك الذراعين بدوائر واسعة لزيادة تدفق الدم لمفصل الكتف."),
  @("gym-warmup-02", "Arm Circles Backward", "دوائر الذراعين للخلف", "beginner", "body only", "shoulders", "traps", "تحريك الذراعين للخلف لتنشيط عضلات أعلى الظهر والترابيس."),
  @("gym-warmup-03", "Shoulder Dislocates Band", "مرونة الكتف بالأستك", "beginner", "bands", "shoulders", "chest", "تمرير شريط المقاومة من الأمام للخلف لفتح الصدر والأكتاف."),
  @("gym-warmup-04", "Band Pull-Aparts", "سحب الأستك لمستوى الصدر", "beginner", "bands", "shoulders", "traps", "تفعيل عضلات الكتف الخلفي وأعلى الظهر قبل تمارين الضغط."),
  @("gym-warmup-05", "Scapular Push-Ups", "ضغط لعضلات لوح الكتف", "beginner", "body only", "traps", "chest", "حركة تقريب وتبعيد لوحي الكتف بوضع الضغط لثبات المفصل."),
  @("gym-warmup-06", "Cat-Cow Spine Mobility", "تمرين القطة والبقرة للمرونة", "beginner", "body only", "lower back", "abdominals", "تقويس وتقبيب العمود الفقري لتحرير التوتر العضلي في الظهر."),
  @("gym-warmup-07", "Bird-Dog Core Warmup", "بيرد دوج للثبات والتوازن", "beginner", "body only", "lower back", "glutes", "مد اليد العكسية والرجل المقابلة لتفعيل عضلات الجذع وأسفل الظهر."),
  @("gym-warmup-08", "Thread the Needle", "تمرير الذراع لمرونة الصدر", "beginner", "body only", "middle back", "shoulders", "لف الجذع وتمرير الذراع لزيادة مرونة الفقرات الصدرية."),
  @("gym-warmup-09", "Thoracic Spine Rotations", "دوران الفقرات الصدرية", "beginner", "body only", "middle back", "abdominals", "تحسين مدى حركة الظهر العلوي لدعم تمارين السكوات والضغط."),
  @("gym-warmup-10", "Wrist Circles Mobility", "دوائر الرسغ والمفصل", "beginner", "body only", "forearms", "biceps", "دوران كامل لمفصل الرسغ لتجهيز اليدين لحمل الأوزان الثقيلة."),
  @("gym-warmup-11", "Wrist Flexor Stretch", "إطالة عضلات قابضة الرسغ", "beginner", "body only", "forearms", "forearms", "سحب الأصابع للخلف بلطف لتفادي التهابات أوتار الساعد."),
  @("gym-warmup-12", "Wrist Extensor Stretch", "إطالة عضلات باسطة الرسغ", "beginner", "body only", "forearms", "forearms", "ثني اليد للأسفل لتخفيف الشد عن عضلات الساعد الخارجية."),
  @("gym-warmup-13", "Neck Lateral Flexion", "إطالة الرقبة الجانبية", "beginner", "body only", "neck", "traps", "إمالة الرأس للكتف بلطف لتخفيف تشنجات الرقبة وأعلى الظهر."),
  @("gym-warmup-14", "Neck Semi-Circles", "نصف دوائر الرقبة الأمامية", "beginner", "body only", "neck", "traps", "تحريك الذقن من كتف لآخر بنصف دائرة لتنشيط عضلات الرقبة."),
  @("gym-warmup-15", "Standing Side Bend Stretch", "إطالة الجانب وقوفاً", "beginner", "body only", "abdominals", "lats", "تمديد جانب الجسم واللاتس لزيادة مرونة القفص الصدري."),
  @("gym-warmup-16", "Standing Forward Fold", "انحناء أمامي للمرونة", "beginner", "body only", "hamstrings", "lower back", "النزول للمس أصابع القدمين لإطالة الفخذ الخلفي وأسفل الظهر."),
  @("gym-warmup-17", "Standing Quad Stretch", "إطالة الفخذ الأمامي وقوفاً", "beginner", "body only", "quadriceps", "quadriceps", "سحب الكعب نحو المؤخرة مع ثبات الركبتين بجانب بعضهما."),
  @("gym-warmup-18", "Walking Quad Pulls", "إطالة الفخذ الأمامي مع المشي", "beginner", "body only", "quadriceps", "glutes", "سحب القدم مع التقدم للأمام لتسخين ديناميكي لأوتار الفخذ."),
  @("gym-warmup-19", "Lying Quad Stretch", "إطالة الفخذ الأمامي استلقاءً", "beginner", "body only", "quadriceps", "quadriceps", "استلقاء جانبي وسحب الساق للخلف لعزل الفخذ بدون حمل على الظهر."),
  @("gym-warmup-20", "Kneeling Hip Flexor Stretch", "إطالة حزام الحوض ركوعاً", "beginner", "body only", "quadriceps", "glutes", "دفع الحوض للأمام بلطف لفك عضلات الورك المشدودة من الجلوس."),
  @("gym-warmup-21", "World's Greatest Stretch", "أفضل إطالة رياضية شاملة", "intermediate", "body only", "hamstrings", "middle back", "دمج اللانجز العميق مع دوران الجذع لفتح الجسم بالكامل في حركة واحدة."),
  @("gym-warmup-22", "Deep Squat Hold Reach", "ثبات القرفصاء العميق مع الدوران", "intermediate", "body only", "adductors", "glutes", "الجلوس في سكوات كامل ولمس القدم مع رفع الذراع للأعلى."),
  @("gym-warmup-23", "Inchworm with Push-Up", "مشية الدودة مع الضغط", "intermediate", "body only", "hamstrings", "chest", "المشي باليدين من الوقوف لوضع الضغط ثم العودة لإطالة ديناميكية."),
  @("gym-warmup-24", "Spiderman Lunge Twist", "لانجز الرجل العنكبوت مع الدوران", "intermediate", "body only", "adductors", "shoulders", "تقديم القدم بجانب اليد وفتح الذراع نحو السقف لمرونة الحوض."),
  @("gym-warmup-25", "Walking High Knee Hugs", "ضم الركبة للصدر مع المشي", "beginner", "body only", "glutes", "hamstrings", "سحب الركبة نحو القفص الصدري بكل خطوة لتفعيل عضلات المؤخرة."),
  @("gym-warmup-26", "Walking Ankle Cradle", "رفع الكاحل للصدر مشياً", "beginner", "body only", "glutes", "abductors", "مسك الركبة والكاحل وسحبهما للأعلى لمرونة مفصل الفخذ الخارجي."),
  @("gym-warmup-27", "Frankenstein Kicks", "ركلات فرانكشتاين المستقيمة", "beginner", "body only", "hamstrings", "calves", "ركل الساق للأمام نحو اليد الممدودة لإطالة ديناميكية نشطة."),
  @("gym-warmup-28", "Leg Swings Forward Back", "مرجحة الأرجل للأمام والخلف", "beginner", "body only", "hamstrings", "quadriceps", "أرجحة الساق بحرية لزيادة المدى الحركي لأوتار الركبة والحوض."),
  @("gym-warmup-29", "Leg Swings Side to Side", "مرجحة الأرجل الجانبية", "beginner", "body only", "abductors", "adductors", "أرجحة الساق أمام الجسم لفتح عضلات الحوض والضمامة."),
  @("gym-warmup-30", "Gate Openers Dynamic", "فتح بوابة الحوض ديناميكياً", "beginner", "body only", "abductors", "glutes", "رفع الركبة وتدويرها للخارج لفك وتجهيز مفصل الورك."),
  @("gym-warmup-31", "Gate Closers Dynamic", "غلق بوابة الحوض ديناميكياً", "beginner", "body only", "adductors", "glutes", "تدوير الركبة من الخارج للداخل لتقوية ثبات الحوض."),
  @("gym-warmup-32", "Butterfly Stretch", "إطالة الفراشة للحوض", "beginner", "body only", "adductors", "glutes", "ضم بطون القدمين والضغط على الركبتين لفتح الحوض برفق."),
  @("gym-warmup-33", "Seated Hamstring Stretch", "إطالة الفخذ الخلفي جلوساً", "beginner", "body only", "hamstrings", "calves", "مد الساقين للأمام وملامسة الأقدام لإطالة عضلات الفخذ الخلفية."),
  @("gym-warmup-34", "Lying Hamstring Band Stretch", "إطالة الفخذ الخلفي بالأستك", "beginner", "bands", "hamstrings", "calves", "رفع الساق للأعلى بواسطة شريط المقاومة لتحكم كامل في الشد."),
  @("gym-warmup-35", "Pigeon Pose Glute Stretch", "وضعية الحمامة للمؤخرة", "intermediate", "body only", "glutes", "lower back", "ثني الساق للأمام ومد الأخرى للخلف لفك عضلات المؤخرة العميقة."),
  @("gym-warmup-36", "Figure 4 Glute Stretch", "إطالة رقم 4 للمؤخرة", "beginner", "body only", "glutes", "lower back", "وضع الكاحل فوق الركبة وسحب الفخذ نحو الصدر لتخفيف عرق النسا."),
  @("gym-warmup-37", "Wall Calf Stretch", "إطالة السمانة على الجدار", "beginner", "body only", "calves", "calves", "دفع الجدار مع مد الساق الخلفية وضغط الكعب في الأرض."),
  @("gym-warmup-38", "Downward Dog Calf Pump", "ضخ السمانة بوضعية الكلب", "intermediate", "body only", "calves", "hamstrings", "تبديل ضغط الكعبين للأرض في وضع الكلب لتسخين الكاحل وأوتار القدم."),
  @("gym-warmup-39", "Cobra Pose Abdominal Stretch", "وضعية الكوبرا لإطالة البطن", "beginner", "body only", "abdominals", "lower back", "رفع الصدر للأعلى مع تثبيت الحوض بالأرض لفتح عضلات البطن."),
  @("gym-warmup-40", "Upward Facing Dog", "وضعية الكلب المتجه لأعلى", "intermediate", "body only", "chest", "abdominals", "دفع الأرض باليدين ورفع الفخذين لإطالة الصدر والبطن وتقوية المعصم."),
  @("gym-warmup-41", "Child's Pose Rest", "وضعية الطفل للاسترخاء", "beginner", "body only", "lower back", "lats", "الجلوس على الكعبين ومد الذراعين للأمام لتفريغ الضغط عن الفقرات."),
  @("gym-warmup-42", "Child's Pose Lat Reach", "وضعية الطفل مع إطالة اللاتس", "beginner", "body only", "lats", "middle back", "المشي باليدين إلى زاوية اليمين ثم اليسار لشد عضلات المجانص."),
  @("gym-warmup-43", "Doorway Chest Stretch", "إطالة الصدر على إطار الباب", "beginner", "body only", "chest", "shoulders", "وضع الذراع على الحائط والتقدم خطوة للأمام لفتح ألياف الصدر."),
  @("gym-warmup-44", "Cross-Body Shoulder Stretch", "سحب الذراع للصدر للكتف", "beginner", "body only", "shoulders", "traps", "سحب الكوع عبر الصدر لتمديد ألياف الكتف الخلفية بلطف."),
  @("gym-warmup-45", "Overhead Triceps Stretch", "إطالة الترايسبس فوق الرأس", "beginner", "body only", "triceps", "lats", "ثني الكوع خلف الرأس وسحبه باليد الأخرى لفك عضلة الترايسبس."),
  @("gym-warmup-46", "90-90 Hip Switch", "تبديل الحوض بزاوية 90-90", "intermediate", "body only", "glutes", "abductors", "الجلوس على الأرض وتدوير الركبتين من جهة لأخرى لمرونة الورك."),
  @("gym-warmup-47", "Frog Stretch Groin Mobility", "إطالة الضفدع لمرونة الحوض", "intermediate", "body only", "adductors", "glutes", "فتح الركبتين على الأرض ودفع الحوض للخلف لمرونة العضلات الضامة."),
  @("gym-warmup-48", "Cossack Squat Mobility", "سكوات القوزاق الجانبي للمرونة", "intermediate", "body only", "adductors", "quadriceps", "النزول بسكوات عميق على ساق واحدة مع فرد الساق الأخرى جانباً."),
  @("gym-warmup-49", "Sumo Squat to Stand", "قرفصاء السومو للمس الأصابع", "beginner", "body only", "hamstrings", "adductors", "النزول في سكوات عريض ثم فرد الساقين ورفع الحوض لإطالة الأوتار."),
  @("gym-warmup-50", "Prone Y-T-W Raises", "رفع الذراعين بحروف Y-T-W", "beginner", "body only", "traps", "shoulders", "الاستلقاء على البطن ورفع الذراعين لتفعيل عضلات أعلى الظهر واللوح."),
  @("gym-warmup-51", "Wall Slides Posture", "انزلاق الذراعين على الجدار", "beginner", "body only", "shoulders", "traps", "رفع وتنزيل الذراعين الملامسين للجدار لتحسين وضعية الأكتاف المحدوبة."),
  @("gym-warmup-52", "Band Face Pull Warmup", "فيس بول خفيف بالأستك تسخين", "beginner", "bands", "shoulders", "traps", "سحب شريط المقاومة نحو الوجه لتدفئة الكتف الخلفي والروتيتور كاف."),
  @("gym-warmup-53", "Band External Rotations", "دوران الكتف الخارجي بالأستك", "beginner", "bands", "shoulders", "shoulders", "تثبيت الكوع بجانب الخصر وتدوير اليد للخارج لتقوية عضلات الكفة المدورة."),
  @("gym-warmup-54", "Band Internal Rotations", "دوران الكتف الداخلي بالأستك", "beginner", "bands", "shoulders", "chest", "تدوير الساعد للداخل ضد مقاومة الأستك لحماية مفصل الكتف."),
  @("gym-warmup-55", "Iron Cross Dynamic Mobility", "الصليب الحديدي استلقاءً", "beginner", "body only", "lower back", "glutes", "تحريك الساق للجهة المعاكسة بحركة ديناميكية لتسخين أسفل الظهر."),
  @("gym-warmup-56", "Scorpion Mobility Prone", "تمرين العقرب للظهر", "intermediate", "body only", "lower back", "abdominals", "الاستلقاء على البطن وتمرير القدم للمس الأرض بالجانب المعاكس."),
  @("gym-warmup-57", "Kneeling Adductor Rock", "أرجحة العضلات الضامة ركوعاً", "beginner", "body only", "adductors", "glutes", "مد ساق واحدة جانباً ودفع الحوض للخلف لإطالة الفخذ الداخلي."),
  @("gym-warmup-58", "Ankle Dorsiflexion Drill", "تمرين مرونة الكاحل على الجدار", "beginner", "body only", "calves", "calves", "دفع الركبة للأمام لتجاوز أصابع القدم لتحسين عمق السكوات."),
  @("gym-warmup-59", "Shin Splint Toe Taps", "طرقات الأصابع للقصية", "beginner", "body only", "calves", "calves", "رفع أصابع القدم بسرعة وإعادتها للأرض لتنشيط العضلة القصية الأمامية."),
  @("gym-warmup-60", "Foam Roll Quadriceps", "تدليك الفوم رولر للفخذ الأمامي", "beginner", "foam roll", "quadriceps", "quadriceps", "تمرير الاسطوانة على الفخذ لتفكيك العقد العضلية والالتصاقات."),
  @("gym-warmup-61", "Foam Roll IT Band", "تدليك الحزام الحرقفي بالفوم رولر", "intermediate", "foam roll", "abductors", "quadriceps", "تدليك الجانب الخارجي للفخذ لتخفيف الشد عن وتر الركبة الخارجي."),
  @("gym-warmup-62", "Foam Roll Upper Back", "تدليك الظهر العلوي بالرولر", "beginner", "foam roll", "middle back", "traps", "تمرير الرولر أسفل لوحي الكتف مع فرد الذراعين لتحرير الفقرات."),
  @("gym-warmup-63", "Foam Roll Lats", "تدليك اللاتس بالفوم رولر", "beginner", "foam roll", "lats", "shoulders", "الاستلقاء جانباً وتدليك عضلة اللاتس لزيادة مرونة الذراع فوق الرأس."),
  @("gym-warmup-64", "Foam Roll Calves", "تدليك السمانة بالفوم رولر", "beginner", "foam roll", "calves", "calves", "تحريك السمانة على الرولر لزيادة تدفق الدم ومرونة وتر أخيل."),
  @("gym-warmup-65", "Foam Roll Glutes", "تدليك المؤخرة بالفوم رولر", "beginner", "foam roll", "glutes", "lower back", "الجلوس على الرولر مع وضع قدم فوق الركبة لتدليك العضلة الكمثرية."),
  @("gym-warmup-66", "Standing IT Band Cross", "إطالة الحزام الحرقفي وقوفاً", "beginner", "body only", "abductors", "glutes", "تقاطع الساقين والانحناء للجانب المعاكس لشد الشريط الحرقفي."),
  @("gym-warmup-67", "Seated Spinal Twist", "دوران العمود الفقري جلوساً", "beginner", "body only", "middle back", "lower back", "لف الجذع للخلف مع الاستناد باليد لتحسين الدوران المحوري للظهر."),
  @("gym-warmup-68", "Supine Spinal Twist", "دوران العمود الفقري استلقاءً", "beginner", "body only", "lower back", "glutes", "إنزال الركبتين لجانب واحد وتوجيه النظر للجهة المعاكسة بلطف."),
  @("gym-warmup-69", "Sphinx Pose Lower Back", "وضعية أبو الهول للظهر السفلي", "beginner", "body only", "lower back", "abdominals", "الثبات على الساعدين مع استرخاء الحوض لتخفيف ضغط الغضاريف."),
  @("gym-warmup-70", "Happy Baby Pose", "وضعية الطفل السعيد لفتح الحوض", "beginner", "body only", "adductors", "hamstrings", "الاستلقاء على الظهر ومسك باطن القدمين لفتح الحوض وإراحة الظهر."),
  @("gym-warmup-71", "Ankle Alphabet Drill", "رسم الحروف بالكاحل", "beginner", "body only", "calves", "calves", "تحريك القدم في الهواء لرسم الحروف لتنشيط أربطة الكاحل في كل اتجاه."),
  @("gym-warmup-72", "Overhead Lunge with Reach", "لانجز مع مد الذراعين للأعلى", "intermediate", "body only", "quadriceps", "shoulders", "خطوة لانجز للأمام مع رفع الذراعين للأعلى لإطالة السلسلة الأمامية."),
  @("gym-warmup-73", "Side Lunge to Curtsy", "لانجز جانبي متبادل للمرونة", "intermediate", "body only", "adductors", "glutes", "التحرك جانباً ثم تقاطع الساق للخلف لتفعيل ألياف الحوض المتعددة."),
  @("gym-warmup-74", "Standing Back Arch", "قوس الظهر الخلفي وقوفاً", "beginner", "body only", "abdominals", "chest", "وضع اليدين على أسفل الظهر وإمالة الصدر للخلف ببطء لفتح الصدر."),
  @("gym-warmup-75", "Pre-Squat Glute Bridges", "جسر المؤخرة قبل السكوات", "beginner", "body only", "glutes", "hamstrings", "رفع الحوض للأعلى والضغط على المؤخرة لتفعيلها قبل تمارين الأرجل."),
  @("gym-warmup-76", "Single-Leg Glute Bridge", "جسر المؤخرة بساق واحدة", "intermediate", "body only", "glutes", "hamstrings", "عزل كل جهة من عضلات المؤخرة لضمان التوازن العضلي قبل التدريب."),
  @("gym-warmup-77", "Clamshells Hip Activator", "تمرين المحارة لتفعيل الحوض", "beginner", "body only", "abductors", "glutes", "فتح وإغلاق الركبتين مع ثبات القدمين لتقوية العضلة الألوية الوسطى."),
  @("gym-warmup-78", "Banded Clamshells", "تمرين المحارة بشريط المقاومة", "beginner", "bands", "abductors", "glutes", "إضافة مقاومة لتمرين المحارة لضمان تفعيل كامل للجلوتس."),
  @("gym-warmup-79", "Lateral Band Walks", "المشي الجانبي بشريط المقاومة", "beginner", "bands", "abductors", "glutes", "خطوات جانبية مع انحناء خفيف بالركبتين لتجهيز عضلات ثبات الحوض."),
  @("gym-warmup-80", "Monster Walks Band", "مشية الوحش بالأستك للأمام", "beginner", "bands", "glutes", "quadriceps", "المشي بخطوات مائلة للأمام والخلف لتفعيل عضلات الأرجل الثابتة."),
  @("gym-warmup-81", "Standing Chest Opener", "فتح الصدر بالأيدي المتشابكة", "beginner", "body only", "chest", "biceps", "تشبيك اليدين خلف الظهر ورفع الصدر لأعلى لتحسين استقامة الأكتاف."),
  @("gym-warmup-82", "Biceps Wall Stretch", "إطالة البايسبس على الجدار", "beginner", "body only", "biceps", "forearms", "وضع كف اليد على الجدار وتدوير الجسم بعيداً لشد ألياف البايسبس."),
  @("gym-warmup-83", "Forearm Flexor Stretch Kneel", "إطالة الساعد بالاستناد بالأرض", "beginner", "body only", "forearms", "forearms", "وضع باطن الكفين على الأرض مع توجيه الأصابع للركبتين."),
  @("gym-warmup-84", "Latissimus Dorsi Side Stretch", "إطالة المجانص على العمود", "beginner", "other", "lats", "middle back", "التمسك بقائم حديدي وإمالة الحوض للخلف لإطالة عميقة لعضلة اللاتس."),
  @("gym-warmup-85", "Trapezius Upper Neck Release", "تحرير عضلة الترابيس العلوية", "beginner", "body only", "traps", "neck", "سحب الرأس لأسفل بزاوية 45 درجة لتخفيف الشد حول لوح الكتف."),
  @("gym-warmup-86", "Levator Scapulae Stretch", "إطالة رافعة لوح الكتف", "beginner", "body only", "neck", "traps", "إمالة الرأس والنظر نحو الإبط المقابل لفك العضلة المسؤولة عن تيبس الرقبة."),
  @("gym-warmup-87", "Posterior Capsule Stretch", "إطالة الكبسولة الخلفية للكتف", "beginner", "body only", "shoulders", "shoulders", "الاستلقاء على الجانب والضغط على الساعد بلطف لتدوير المفصل داخلياً."),
  @("gym-warmup-88", "Subscapularis Wall Stretch", "إطالة تحت اللوح على الجدار", "intermediate", "body only", "shoulders", "chest", "فتح زاوية الكوع 90 درجة على الحائط لتمديد الألياف العميقة للكتف."),
  @("gym-warmup-89", "Anterior Pelvic Tilt Reset", "تعديل ميلان الحوض الأمامي", "beginner", "body only", "abdominals", "glutes", "شد البطن وعصر الجلوتس لإعادة الحوض لوضعه المحايد الصحيح."),
  @("gym-warmup-90", "Deadbug Dynamic Core Warmup", "ديد باج لتفعيل الكور الثابت", "beginner", "body only", "abdominals", "lower back", "تبادل خفض اليد والساق المعاكسة مع تثبيت أسفل الظهر بالأرض."),
  @("gym-warmup-91", "Side Plank Hip Dips Warmup", "بلانك جانبي مع لمس الحوض", "intermediate", "body only", "abdominals", "abductors", "رفع وخفض الحوض بوضع البلانك الجانبي لتسخين الخواصر والكور."),
  @("gym-warmup-92", "Reverse Hyper Bodyweight", "هايبر عكسي بوزن الجسم", "beginner", "other", "glutes", "lower back", "رفع الساقين للأعلى وأنت مستلق على مقعد لتسخين السلسلة الخلفية."),
  @("gym-warmup-93", "Quadruped T-Spine Mobilization", "تليين الفقرات الصدرية رباعياً", "beginner", "body only", "middle back", "traps", "وضع اليد خلف الرأس ولمس الكوع الآخر ثم الدوران لأقصى ارتفاع."),
  @("gym-warmup-94", "Prone Swimmers Mobility", "سباحة على البطن لمرونة الكتف", "intermediate", "body only", "shoulders", "middle back", "تدوير الذراعين من أسفل الظهر لفوق الرأس بدون لمس الأرض."),
  @("gym-warmup-95", "Deep Squat Internal Hip Rotation", "دوران الحوض الداخلي في السكوات", "intermediate", "body only", "adductors", "glutes", "إمالة ركبة واحدة للداخل وأنت بوضع السكوات لتليين المفصل."),
  @("gym-warmup-96", "Lunge with Lateral Reach", "لانجز مع الميل الجانبي", "intermediate", "body only", "quadriceps", "lats", "خطوة لانجز للأمام مع ثني الجذع للجانب لشد الحوض واللاتس معاً."),
  @("gym-warmup-97", "Kneeling Hamstring Rock", "أرجحة الفخذ الخلفي ركوعاً", "beginner", "body only", "hamstrings", "calves", "مد الساق للأمام والأرجحة للأمام والخلف لمرونة العضلات الحركية."),
  @("gym-warmup-98", "Foam Roll Thoracic Extension", "فرد الفقرات الصدرية بالرولر", "beginner", "foam roll", "middle back", "chest", "وضع الرولر تحت أعلى الظهر وإرجاع الرأس للخلف لفتح الصدر والحدبة."),
  @("gym-warmup-99", "Full Body Mobility Flow", "سلسلة المرونة البدنية الشاملة", "intermediate", "body only", "hamstrings", "shoulders", "تدفق حركي متكامل من السكوات للكوبرا للكلب لتهيئة الجسم بالكامل للتمرين.")
)

Write-Host "Cardio definitions: $($cardioDefs.Count)"
Write-Host "Warmup definitions: $($warmupDefs.Count)"
Write-Host "Total new items: $($cardioDefs.Count + $warmupDefs.Count)"

$allNewJson = @()

foreach ($item in $cardioDefs) {
    $id = $item[0]; $name = $item[1]; $ar = $item[2]; $level = $item[3]; $equip = $item[4]
    $pm = $item[5]; $sm = $item[6]; $desc = $item[7]
    $json = "{""id"":""$id"",""cat"":""cardio"",""name"":""$name"",""ar"":""$ar"",""level"":""$level"",""equipment"":""$equip"",""mechanic"":""compound"",""force"":""push"",""primaryMuscles"":[""$pm""],""secondaryMuscles"":[""$sm""],""images"":[],""desc"":""$desc"",""local"":true}"
    $allNewJson += $json
}

foreach ($item in $warmupDefs) {
    $id = $item[0]; $name = $item[1]; $ar = $item[2]; $level = $item[3]; $equip = $item[4]
    $pm = $item[5]; $sm = $item[6]; $desc = $item[7]
    $json = "{""id"":""$id"",""cat"":""warmup"",""name"":""$name"",""ar"":""$ar"",""level"":""$level"",""equipment"":""$equip"",""mechanic"":""isolation"",""force"":""static"",""primaryMuscles"":[""$pm""],""secondaryMuscles"":[""$sm""],""images"":[],""desc"":""$desc"",""local"":true}"
    $allNewJson += $json
}

# Save full 276 exercises list
$allExercisesMerged = $localExercises + $allNewJson
Write-Host "Total combined gym exercises: $($allExercisesMerged.Count)"

$mergedText = "const FULL_GYM_EXERCISES_DATA = [`r`n  " + ($allExercisesMerged -join ",`r`n  ") + "`r`n];`r`n"
$mergedText | Out-File -Encoding UTF8 "C:\Users\M03TSM\.gemini\antigravity\scratch\full_gym_data.js"
Write-Host "Saved to full_gym_data.js successfully!"
