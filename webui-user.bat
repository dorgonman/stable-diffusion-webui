@echo off
git fetch origin master
git rebase origin/master

@REM ./venv/Scripts/activate
@REM pip install -r ./extensions/sd_dreambooth_extension/requirements.txt
.\venv\Scripts\python.exe -m pip install --upgrade pip
set PYTHON=
set GIT=
set VENV_DIR=
@REM set XFORMERS_PACKAGE="xformers==0.0.17.dev"
set COMMANDLINE_ARGS=--listen --api --enable-insecure-extension-access --reinstall-torch --xformers --reinstall-xformers ^
   --no-hashing ^
   --cors-allow-origins http://localhost:5173
@REM --share --ngrok %NGROK_AUTH_TOKEN% --ngrok-region ap --administrator --gradio-queue --gradio-auth-path webui-user-password.txt
@REM --medvram --disable-safe-unpickle --opt-split-attention --update-check 
call webui.bat
pause