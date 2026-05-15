import type { Service, ServiceCategory } from "@/types";

export interface ServiceSeed
  extends Omit<Service, "id" | "created_at" | "updated_at"> {}

export const SERVICE_SEED_DATA: ServiceSeed[] = [
  // ─── JAI CHAN SIGNATURES ───────────────────────────────────────────────────
  {
    category: "signatures" as ServiceCategory,
    name_en: "ASMR Regal Thai Serenity (Size L) ★",
    name_th: "ASMR Regal Thai Serenity (ไซส์ L) ★",
    name_cn: "ASMR Regal Thai Serenity（大号 L）★",
    description_en:
      "A royal head spa treatment designed to nourish the scalp and promote circulation. Includes head, neck, and shoulder massage, facial scrub, facial massage, face mask, and a simple dry finish.",
    description_th:
      "ทรีทเม้นต์หัวสปาสุดหรูออกแบบมาเพื่อบำรุงหนังศีรษะและกระตุ้นการไหลเวียนโลหิต ประกอบด้วยการนวดศีรษะ คอ และไหล่ สครับหน้า นวดหน้า มาส์กหน้า และเป่าผมเสร็จสวย",
    description_cn:
      "皇家头部水疗护理，滋养头皮并促进血液循环，包含头部、颈部与肩部按摩，以及面部去角质、面部按摩、面膜护理，最后进行简单吹干造型。",
    durations: [{ minutes: 120, price: 2290 }],
    is_active: true,
    sort_order: 1,
  },
  {
    category: "signatures" as ServiceCategory,
    name_en: "ASMR Regal Thai Upper Harmony (Size M)",
    name_th: "ASMR Regal Thai Upper Harmony (ไซส์ M)",
    name_cn: "ASMR Regal Thai Upper Harmony（中号 M）",
    description_en:
      "Medium-sized version of the Regal Thai head spa. Nourishes the scalp and reduces stress. Includes head, neck, and shoulder massage, with a simple dry finish.",
    description_th:
      "เวอร์ชันขนาดกลางของหัวสปาแบบ Regal Thai บำรุงหนังศีรษะและลดความเครียด ประกอบด้วยการนวดศีรษะ คอ และไหล่ พร้อมเป่าผมเสร็จสวย",
    description_cn:
      "中等规格的皇家泰式头部水疗护理，滋养头皮并有效缓解压力。包含头部、肩部及颈部按摩，最后进行简单吹干整理。",
    durations: [{ minutes: 90, price: 1790 }],
    is_active: true,
    sort_order: 2,
  },
  {
    category: "signatures" as ServiceCategory,
    name_en: "ASMR Royal Coconut Hair Spa (Size S) ★",
    name_th: "ASMR Royal Coconut Hair Spa (ไซส์ S) ★",
    name_cn: "ASMR Royal Coconut Hair Spa（小号 S）★",
    description_en:
      "A soothing head spa designed to relieve stress and restore scalp vitality. Warm coconut oil is gently drizzled onto the scalp, followed by a relaxing head massage, with a simple dry finish.",
    description_th:
      "หัวสปาสุดผ่อนคลายออกแบบมาเพื่อบรรเทาความเครียดและฟื้นฟูความมีชีวิตชีวาของหนังศีรษะ น้ำมันมะพร้าวอุ่นๆ จะถูกหยดลงบนหนังศีรษะอย่างนุ่มนวล ตามด้วยการนวดศีรษะผ่อนคลาย พร้อมเป่าผมเสร็จสวย",
    description_cn:
      "舒缓放松的头部水疗护理，帮助缓解压力并恢复头皮活力。将温热的椰子油轻柔滴淋于头皮上，随后进行放松的头部按摩，最后以简单吹干整理收尾。",
    durations: [{ minutes: 60, price: 990 }],
    is_active: true,
    sort_order: 3,
  },
  {
    category: "signatures" as ServiceCategory,
    name_en: "JAI CHAN Hair Spa",
    name_th: "JAI CHAN Hair Spa",
    name_cn: "JAI CHAN 头发水疗",
    description_en:
      "A basic head spa treatment that relieves stress and improves scalp health, with a simple dry finish.",
    description_th:
      "ทรีทเม้นต์หัวสปาพื้นฐานที่ช่วยบรรเทาความเครียดและปรับปรุงสุขภาพหนังศีรษะ พร้อมเป่าผมเสร็จสวย",
    description_cn: "基础头部水疗护理，帮助缓解压力并改善头皮健康，最后进行简单吹干整理。",
    durations: [{ minutes: 45, price: 890 }],
    is_active: true,
    sort_order: 4,
  },

  // ─── SIAM TOUCH THERAPY ───────────────────────────────────────────────────
  {
    category: "siam_touch" as ServiceCategory,
    name_en: "Aroma Thai Harmony",
    name_th: "Aroma Thai Harmony",
    name_cn: "泰式芳香和谐",
    description_en:
      "A gentle massage using aromatic essential oils to promote relaxation and better sleep.",
    description_th:
      "การนวดอย่างอ่อนโยนด้วยน้ำมันหอมระเหยเพื่อส่งเสริมการผ่อนคลายและการนอนหลับที่ดีขึ้น",
    description_cn: "采用芳香精油进行的温和按摩，帮助放松身心并促进更佳睡眠。",
    durations: [
      { minutes: 60, price: 990 },
      { minutes: 90, price: 1390 },
      { minutes: 120, price: 1790 },
    ],
    is_active: true,
    sort_order: 5,
  },
  {
    category: "siam_touch" as ServiceCategory,
    name_en: "Thai Heritage Revival",
    name_th: "Thai Heritage Revival",
    name_cn: "泰式传统复兴",
    description_en:
      "Traditional Thai massage combines pressure points and stretching to restore energy balance.",
    description_th:
      "การนวดแผนไทยดั้งเดิมผสมผสานการกดจุดและการยืดเส้นเพื่อฟื้นฟูสมดุลพลังงาน",
    description_cn: "传统泰式按摩结合穴位按压与伸展动作，帮助恢复体能量平衡。",
    durations: [
      { minutes: 60, price: 590 },
      { minutes: 90, price: 840 },
      { minutes: 120, price: 1090 },
    ],
    is_active: true,
    sort_order: 6,
  },
  {
    category: "siam_touch" as ServiceCategory,
    name_en: "Ancient Thai Herbal Compress",
    name_th: "Ancient Thai Herbal Compress",
    name_cn: "古泰式草药热敷",
    description_en:
      "Traditional compress therapy using warm Thai herbal poultices to relieve fatigue and muscle pain.",
    description_th:
      "การบำบัดด้วยลูกประคบแบบดั้งเดิมโดยใช้ลูกประคบสมุนไพรไทยอุ่นเพื่อบรรเทาความเมื่อยล้าและอาการปวดกล้ามเนื้อ",
    description_cn: "采用温热泰式草药敷袋的传统热敷疗法，帮助缓解疲劳并减轻肌肉酸痛。",
    durations: [
      { minutes: 90, price: 690 },
      { minutes: 120, price: 1290 },
    ],
    is_active: true,
    sort_order: 7,
  },
  {
    category: "siam_touch" as ServiceCategory,
    name_en: "Soul Soothing Foot & Calf Relief",
    name_th: "Soul Soothing Foot & Calf Relief",
    name_cn: "足部与小腿舒缓",
    description_en:
      "A relaxing massage targeting feet and calves to promote blood flow, relieve tiredness, and enhance relaxation.",
    description_th:
      "การนวดผ่อนคลายที่มุ่งเน้นไปที่เท้าและน่องเพื่อส่งเสริมการไหลเวียนของเลือด บรรเทาความเมื่อยล้า และเพิ่มการผ่อนคลาย",
    description_cn:
      "以足部与小腿为重点的放松按摩，促进血液循环，缓解疲劳，提升整体放松感。",
    durations: [
      { minutes: 60, price: 590 },
      { minutes: 120, price: 1090 },
    ],
    is_active: true,
    sort_order: 8,
  },
  {
    category: "siam_touch" as ServiceCategory,
    name_en: "Royal Shoulder & Neck Massage",
    name_th: "Royal Shoulder & Neck Massage",
    name_cn: "皇家肩颈按摩",
    description_en:
      "Focuses on shoulder and neck tension relief using pressure points and herbal oils. Ideal for office workers.",
    description_th:
      "เน้นการบรรเทาความตึงเครียดที่ไหล่และคอโดยใช้การกดจุดและน้ำมันสมุนไพร เหมาะสำหรับคนทำงานในออฟฟิศ",
    description_cn:
      "专注于缓解肩颈紧张，结合穴位按压与草本精油护理，特别适合久坐办公族。",
    durations: [
      { minutes: 60, price: 690 },
      { minutes: 120, price: 1290 },
    ],
    is_active: true,
    sort_order: 9,
  },
  {
    category: "siam_touch" as ServiceCategory,
    name_en: "Thai Floral Balm",
    name_th: "Thai Floral Balm",
    name_cn: "泰式花香精华按摩",
    description_en:
      "A deeply restorative full-body massage using authentic Thai jasmine balm, enriched with traditional herbal extracts.",
    description_th:
      "การนวดตัวเต็มรูปแบบที่ฟื้นฟูอย่างล้ำลึกโดยใช้บาล์มมะลิไทยแท้ที่เสริมด้วยสารสกัดจากสมุนไพรดั้งเดิม",
    description_cn:
      "采用正宗泰式茉莉香膏并融合传统草本萃取的全身深层修复按摩，帮助放松身心、恢复活力。",
    durations: [
      { minutes: 60, price: 690 },
      { minutes: 90, price: 990 },
      { minutes: 120, price: 1290 },
    ],
    is_active: true,
    sort_order: 10,
  },

  // ─── BEAUTY SERVICE ───────────────────────────────────────────────────────
  {
    category: "beauty" as ServiceCategory,
    name_en: "Royal Thai Facial Massage",
    name_th: "Royal Thai Facial Massage",
    name_cn: "皇家泰式面部按摩",
    description_en:
      "A facial massage using a Thai herbal formula to improve blood circulation and promote radiant skin. Includes cleansing, herbal, and moisturizing massage.",
    description_th:
      "การนวดหน้าโดยใช้สูตรสมุนไพรไทยเพื่อปรับปรุงการไหลเวียนของเลือดและส่งเสริมผิวที่เปล่งปลั่ง ประกอบด้วยการทำความสะอาด การนวดด้วยสมุนไพร และการนวดเพิ่มความชุ่มชื้น",
    description_cn:
      "面部按摩，采用泰式草本配方，促进血液循环，使肌肤焕发光彩。包含洁面、草本护理及保湿按摩。",
    durations: [{ minutes: 60, price: 990 }],
    is_active: true,
    sort_order: 11,
  },
  {
    category: "beauty" as ServiceCategory,
    name_en: "Golden Glow Body Polish",
    name_th: "Golden Glow Body Polish",
    name_cn: "黄金光泽身体磨砂",
    description_en:
      "A body scrub with royal Thai herbs that exfoliates dead skin cells, revealing radiant and soft skin. Helps enhance blood circulation and skin rejuvenation.",
    description_th:
      "สครับผิวกายด้วยสมุนไพรไทยชั้นเลิศที่ขัดเซลล์ผิวที่ตายแล้ว เผยผิวที่เปล่งปลั่งและนุ่มนวล ช่วยเพิ่มการไหลเวียนของเลือดและฟื้นฟูผิว",
    description_cn:
      "采用皇家泰式草本配方的身体去角质护理，有效去除死皮细胞，令肌肤柔嫩光滑、焕发光采，并有助于促进血液循环与肌肤再生。",
    durations: [{ minutes: 60, price: 1290 }],
    is_active: true,
    sort_order: 12,
  },
  {
    category: "beauty" as ServiceCategory,
    name_en: "Thai Herbal Body Wrap",
    name_th: "Thai Herbal Body Wrap",
    name_cn: "泰式草本身体包裹",
    description_en:
      "A treatment using warm Thai herbs to nourish and moisturize the skin, relieve fatigue, and detoxify the body. Leaves skin smooth and relaxed.",
    description_th:
      "การบำบัดโดยใช้สมุนไพรไทยอุ่นเพื่อบำรุงและเพิ่มความชุ่มชื้นให้ผิว บรรเทาความเมื่อยล้า และล้างพิษออกจากร่างกาย ทำให้ผิวนุ่มเนียนและผ่อนคลาย",
    description_cn:
      "采用温热泰式草本护理，为肌肤深层滋养与补水，缓解疲劳，帮助身体排毒，使肌肤柔滑细致，身心倍感放松。",
    durations: [{ minutes: 60, price: 1290 }],
    is_active: true,
    sort_order: 13,
  },

  // ─── PACKAGES ─────────────────────────────────────────────────────────────
  {
    category: "packages" as ServiceCategory,
    name_en: "Thai Bliss Detox Package",
    name_th: "Thai Bliss Detox Package",
    name_cn: "泰式净化套餐",
    description_en:
      "Thai Heritage Revival (60 mins) + Soul Soothing Foot & Calf Relief or Royal Shoulder & Neck Massage (60 mins). A complete body detox experience.",
    description_th:
      "Thai Heritage Revival (60 นาที) + Soul Soothing Foot & Calf Relief หรือ Royal Shoulder & Neck Massage (60 นาที) ประสบการณ์การล้างพิษร่างกายอย่างครบครัน",
    description_cn:
      "泰式传统复兴（60分钟）+ 足部舒缓或皇家肩颈按摩（60分钟）。完整的身体净化体验。",
    durations: [{ minutes: 120, price: 1090 }],
    is_active: true,
    sort_order: 14,
  },
  {
    category: "packages" as ServiceCategory,
    name_en: "Royal Thai Pampering Package",
    name_th: "Royal Thai Pampering Package",
    name_cn: "皇家泰式宠爱套餐",
    description_en:
      "Aroma Thai Harmony (60 mins) + Royal Thai Facial Massage (60 mins). The ultimate relaxation and skin care combination.",
    description_th:
      "Aroma Thai Harmony (60 นาที) + Royal Thai Facial Massage (60 นาที) การผสมผสานสูงสุดของการผ่อนคลายและการดูแลผิว",
    description_cn:
      "泰式芳香和谐（60分钟）+ 皇家泰式面部按摩（60分钟）。极致放松与护肤的完美组合。",
    durations: [{ minutes: 120, price: 1790 }],
    is_active: true,
    sort_order: 15,
  },
  {
    category: "packages" as ServiceCategory,
    name_en: "Serenity & Glow Package",
    name_th: "Serenity & Glow Package",
    name_cn: "宁静焕彩套餐",
    description_en:
      "Golden Glow Body Polish (60 mins) + Thai Herbal Body Wrap (60 mins). Exfoliation and deep nourishment for luminous skin.",
    description_th:
      "Golden Glow Body Polish (60 นาที) + Thai Herbal Body Wrap (60 นาที) การขัดผิวและการบำรุงอย่างล้ำลึกเพื่อผิวที่เปล่งปลั่ง",
    description_cn:
      "黄金光泽身体磨砂（60分钟）+ 泰式草本身体包裹（60分钟）。去角质与深层滋养，焕发亮泽肌肤。",
    durations: [{ minutes: 120, price: 2390 }],
    is_active: true,
    sort_order: 16,
  },
];

export const NATIONALITY_OPTIONS = [
  "Thai",
  "Chinese",
  "Japanese",
  "Korean",
  "American",
  "British",
  "Australian",
  "French",
  "German",
  "Indian",
  "Russian",
  "Singaporean",
  "Malaysian",
  "Filipino",
  "Indonesian",
  "Vietnamese",
  "Taiwanese",
  "Hong Kong",
  "Other",
];
