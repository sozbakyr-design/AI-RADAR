-- 1. Tabloyu Güvenli Hale Getir (RLS)
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- 2. Herkesin okumasına izin ver (Zaten varsa hata verebilir, sorun yok)
CREATE POLICY "Public opportunities are viewable by everyone" 
ON public.opportunities FOR SELECT USING (true);

-- 3. EKLEME İZNİ VER (Seed işlemi için gerekli)
-- Not: İşiniz bitince bunu silebilirsiniz.
CREATE POLICY "Enable insert for seeding" 
ON public.opportunities FOR INSERT WITH CHECK (true);

-- 4. UPDATE İzni (Beğeni vb. için gerekebilir)
CREATE POLICY "Enable update for everyone" 
ON public.opportunities FOR UPDATE USING (true);
