cd ..
"C:\Users\%username%\AppData\Local\Programs\Python\Python310\python.exe" -m venv .env
set "variable=%cd%"
set "variable=%variable:\=/%"
copy install\requirements.txt .
.env\Scripts\python.exe -c "import os;a = '%%20'.join(os.environ['variable'].split());print(f'openai-whisper @ file:///{a}/whisper');" >> requirements.txt
.env\Scripts\python.exe -c "import os;a = '%%20'.join(os.environ['variable'].split());print(f'sentencepiece @ file:///{a}/sentencepiece/python/dist/sentencepiece-0.2.1-cp310-cp310-win_amd64.whl');" >> requirements.txt

cmd /c "(nvcc --version 2>&1 || echo '') | findstr ", release "| .env\Scripts\python.exe install\torchcuda.py >> requirements.txt"

set mytorch="torch==2.7.1"
echo %mytorch:~1,-1% >> requirements.txt
set mytorchaudio="torchaudio==2.7.1"
echo %mytorchaudio:~1,-1% >> requirements.txt
set mytorchvision="torchvision==0.22.1"
echo %mytorchvision:~1,-1% >> requirements.txt

.env\Scripts\pip.exe install -r requirements.txt
.env\Scripts\python.exe run10.py 2>NUL

.env\Scripts\python.exe install\shortcut.py

run.bat

