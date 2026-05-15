-- Seed: JAI CHAN SPA service catalog

insert into public.services (category, name_en, name_th, name_cn, description_en, description_th, description_cn, durations, is_active, sort_order) values

-- JAI CHAN SIGNATURES
('signatures', 'ASMR Regal Thai Serenity (Size L) ★', 'ASMR Regal Thai Serenity (ไซส์ L) ★', 'ASMR Regal Thai Serenity（大号 L）★',
 'A royal head spa treatment designed to nourish the scalp and promote circulation. Includes head, neck, and shoulder massage, facial scrub, facial massage, face mask, and a simple dry finish.',
 'ทรีทเม้นต์หัวสปาสุดหรูออกแบบมาเพื่อบำรุงหนังศีรษะและกระตุ้นการไหลเวียนโลหิต ประกอบด้วยการนวดศีรษะ คอ และไหล่ สครับหน้า นวดหน้า มาส์กหน้า และเป่าผมเสร็จสวย',
 '皇家头部水疗护理，滋养头皮并促进血液循环，包含头部、颈部与肩部按摩，以及面部去角质、面部按摩、面膜护理，最后进行简单吹干造型。',
 '[{"minutes": 120, "price": 2290}]', true, 1),

('signatures', 'ASMR Regal Thai Upper Harmony (Size M)', 'ASMR Regal Thai Upper Harmony (ไซส์ M)', 'ASMR Regal Thai Upper Harmony（中号 M）',
 'Medium-sized version of the Regal Thai head spa. Nourishes the scalp and reduces stress. Includes head, neck, and shoulder massage, with a simple dry finish.',
 'เวอร์ชันขนาดกลางของหัวสปาแบบ Regal Thai บำรุงหนังศีรษะและลดความเครียด ประกอบด้วยการนวดศีรษะ คอ และไหล่ พร้อมเป่าผมเสร็จสวย',
 '中等规格的皇家泰式头部水疗护理，滋养头皮并有效缓解压力。包含头部、肩部及颈部按摩，最后进行简单吹干整理。',
 '[{"minutes": 90, "price": 1790}]', true, 2),

('signatures', 'ASMR Royal Coconut Hair Spa (Size S) ★', 'ASMR Royal Coconut Hair Spa (ไซส์ S) ★', 'ASMR Royal Coconut Hair Spa（小号 S）★',
 'A soothing head spa designed to relieve stress and restore scalp vitality. Warm coconut oil is gently drizzled onto the scalp, followed by a relaxing head massage, with a simple dry finish.',
 'หัวสปาสุดผ่อนคลายออกแบบมาเพื่อบรรเทาความเครียดและฟื้นฟูความมีชีวิตชีวาของหนังศีรษะ น้ำมันมะพร้าวอุ่นๆ จะถูกหยดลงบนหนังศีรษะอย่างนุ่มนวล ตามด้วยการนวดศีรษะผ่อนคลาย พร้อมเป่าผมเสร็จสวย',
 '舒缓放松的头部水疗护理，帮助缓解压力并恢复头皮活力。将温热的椰子油轻柔滴淋于头皮上，随后进行放松的头部按摩，最后以简单吹干整理收尾。',
 '[{"minutes": 60, "price": 990}]', true, 3),

('signatures', 'JAI CHAN Hair Spa', 'JAI CHAN Hair Spa', 'JAI CHAN 头发水疗',
 'A basic head spa treatment that relieves stress and improves scalp health, with a simple dry finish.',
 'ทรีทเม้นต์หัวสปาพื้นฐานที่ช่วยบรรเทาความเครียดและปรับปรุงสุขภาพหนังศีรษะ พร้อมเป่าผมเสร็จสวย',
 '基础头部水疗护理，帮助缓解压力并改善头皮健康，最后进行简单吹干整理。',
 '[{"minutes": 45, "price": 890}]', true, 4),

-- SIAM TOUCH THERAPY
('siam_touch', 'Aroma Thai Harmony', 'Aroma Thai Harmony', '泰式芳香和谐',
 'A gentle massage using aromatic essential oils to promote relaxation and better sleep.',
 'การนวดอย่างอ่อนโยนด้วยน้ำมันหอมระเหยเพื่อส่งเสริมการผ่อนคลายและการนอนหลับที่ดีขึ้น',
 '采用芳香精油进行的温和按摩，帮助放松身心并促进更佳睡眠。',
 '[{"minutes": 60, "price": 990}, {"minutes": 90, "price": 1390}, {"minutes": 120, "price": 1790}]', true, 5),

('siam_touch', 'Thai Heritage Revival', 'Thai Heritage Revival', '泰式传统复兴',
 'Traditional Thai massage combines pressure points and stretching to restore energy balance.',
 'การนวดแผนไทยดั้งเดิมผสมผสานการกดจุดและการยืดเส้นเพื่อฟื้นฟูสมดุลพลังงาน',
 '传统泰式按摩结合穴位按压与伸展动作，帮助恢复体能量平衡。',
 '[{"minutes": 60, "price": 590}, {"minutes": 90, "price": 840}, {"minutes": 120, "price": 1090}]', true, 6),

('siam_touch', 'Ancient Thai Herbal Compress', 'Ancient Thai Herbal Compress', '古泰式草药热敷',
 'Traditional compress therapy using warm Thai herbal poultices to relieve fatigue and muscle pain.',
 'การบำบัดด้วยลูกประคบแบบดั้งเดิมโดยใช้ลูกประคบสมุนไพรไทยอุ่นเพื่อบรรเทาความเมื่อยล้าและอาการปวดกล้ามเนื้อ',
 '采用温热泰式草药敷袋的传统热敷疗法，帮助缓解疲劳并减轻肌肉酸痛。',
 '[{"minutes": 90, "price": 690}, {"minutes": 120, "price": 1290}]', true, 7),

('siam_touch', 'Soul Soothing Foot & Calf Relief', 'Soul Soothing Foot & Calf Relief', '足部与小腿舒缓',
 'A relaxing massage targeting feet and calves to promote blood flow, relieve tiredness, and enhance relaxation.',
 'การนวดผ่อนคลายที่มุ่งเน้นไปที่เท้าและน่องเพื่อส่งเสริมการไหลเวียนของเลือด บรรเทาความเมื่อยล้า และเพิ่มการผ่อนคลาย',
 '以足部与小腿为重点的放松按摩，促进血液循环，缓解疲劳，提升整体放松感。',
 '[{"minutes": 60, "price": 590}, {"minutes": 120, "price": 1090}]', true, 8),

('siam_touch', 'Royal Shoulder & Neck Massage', 'Royal Shoulder & Neck Massage', '皇家肩颈按摩',
 'Focuses on shoulder and neck tension relief using pressure points and herbal oils. Ideal for office workers.',
 'เน้นการบรรเทาความตึงเครียดที่ไหล่และคอโดยใช้การกดจุดและน้ำมันสมุนไพร เหมาะสำหรับคนทำงานในออฟฟิศ',
 '专注于缓解肩颈紧张，结合穴位按压与草本精油护理，特别适合久坐办公族。',
 '[{"minutes": 60, "price": 690}, {"minutes": 120, "price": 1290}]', true, 9),

('siam_touch', 'Thai Floral Balm', 'Thai Floral Balm', '泰式花香精华按摩',
 'A deeply restorative full-body massage using authentic Thai jasmine balm, enriched with traditional herbal extracts.',
 'การนวดตัวเต็มรูปแบบที่ฟื้นฟูอย่างล้ำลึกโดยใช้บาล์มมะลิไทยแท้ที่เสริมด้วยสารสกัดจากสมุนไพรดั้งเดิม',
 '采用正宗泰式茉莉香膏并融合传统草本萃取的全身深层修复按摩，帮助放松身心、恢复活力。',
 '[{"minutes": 60, "price": 690}, {"minutes": 90, "price": 990}, {"minutes": 120, "price": 1290}]', true, 10),

-- BEAUTY SERVICE
('beauty', 'Royal Thai Facial Massage', 'Royal Thai Facial Massage', '皇家泰式面部按摩',
 'A facial massage using a Thai herbal formula to improve blood circulation and promote radiant skin. Includes cleansing, herbal, and moisturizing massage.',
 'การนวดหน้าโดยใช้สูตรสมุนไพรไทยเพื่อปรับปรุงการไหลเวียนของเลือดและส่งเสริมผิวที่เปล่งปลั่ง',
 '面部按摩，采用泰式草本配方，促进血液循环，使肌肤焕发光彩。',
 '[{"minutes": 60, "price": 990}]', true, 11),

('beauty', 'Golden Glow Body Polish', 'Golden Glow Body Polish', '黄金光泽身体磨砂',
 'A body scrub with royal Thai herbs that exfoliates dead skin cells, revealing radiant and soft skin.',
 'สครับผิวกายด้วยสมุนไพรไทยชั้นเลิศที่ขัดเซลล์ผิวที่ตายแล้ว เผยผิวที่เปล่งปลั่งและนุ่มนวล',
 '采用皇家泰式草本配方的身体去角质护理，有效去除死皮细胞，令肌肤柔嫩光滑、焕发光采。',
 '[{"minutes": 60, "price": 1290}]', true, 12),

('beauty', 'Thai Herbal Body Wrap', 'Thai Herbal Body Wrap', '泰式草本身体包裹',
 'A treatment using warm Thai herbs to nourish and moisturize the skin, relieve fatigue, and detoxify the body.',
 'การบำบัดโดยใช้สมุนไพรไทยอุ่นเพื่อบำรุงและเพิ่มความชุ่มชื้นให้ผิว บรรเทาความเมื่อยล้า และล้างพิษออกจากร่างกาย',
 '采用温热泰式草本护理，为肌肤深层滋养与补水，缓解疲劳，帮助身体排毒。',
 '[{"minutes": 60, "price": 1290}]', true, 13),

-- PACKAGES
('packages', 'Thai Bliss Detox Package', 'Thai Bliss Detox Package', '泰式净化套餐',
 'Thai Heritage Revival (60 mins) + Soul Soothing Foot & Calf Relief or Royal Shoulder & Neck Massage (60 mins).',
 'Thai Heritage Revival (60 นาที) + Soul Soothing Foot & Calf Relief หรือ Royal Shoulder & Neck Massage (60 นาที)',
 '泰式传统复兴（60分钟）+ 足部舒缓或皇家肩颈按摩（60分钟）',
 '[{"minutes": 120, "price": 1090}]', true, 14),

('packages', 'Royal Thai Pampering Package', 'Royal Thai Pampering Package', '皇家泰式宠爱套餐',
 'Aroma Thai Harmony (60 mins) + Royal Thai Facial Massage (60 mins).',
 'Aroma Thai Harmony (60 นาที) + Royal Thai Facial Massage (60 นาที)',
 '泰式芳香和谐（60分钟）+ 皇家泰式面部按摩（60分钟）',
 '[{"minutes": 120, "price": 1790}]', true, 15),

('packages', 'Serenity & Glow Package', 'Serenity & Glow Package', '宁静焕彩套餐',
 'Golden Glow Body Polish (60 mins) + Thai Herbal Body Wrap (60 mins).',
 'Golden Glow Body Polish (60 นาที) + Thai Herbal Body Wrap (60 นาที)',
 '黄金光泽身体磨砂（60分钟）+ 泰式草本身体包裹（60分钟）',
 '[{"minutes": 120, "price": 2390}]', true, 16);
