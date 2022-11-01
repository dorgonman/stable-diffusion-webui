@echo off

set PYTHON=
set GIT=
set VENV_DIR=

set COMMANDLINE_ARGS=--listen --api --enable-insecure-extension-access  ^
   --no-hashing --xformers ^
   --cors-allow-origins *

pushd ..
call webui.bat
popd