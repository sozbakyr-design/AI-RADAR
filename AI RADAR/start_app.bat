@echo off
echo Baslatiliyor: AI Radar Local Server...
echo Tarayici aciliyor: http://localhost:8000
echo Kapatmak icin bu pencereyi kapatin.
echo ---------------------------------------

REM Arka planda tarayiciyi ac (2 saniye bekle ki server hazir olsun)
timeout /t 2 >nul
start http://localhost:8000

REM Python Sunucusunu Baslat
python -m http.server 8000
pause
