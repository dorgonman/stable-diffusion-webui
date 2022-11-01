@echo off

set PYTHON=
set GIT=
set VENV_DIR=

set COMMANDLINE_ARGS=--listen --api --enable-insecure-extension-access --xformers ^
   --no-hashing ^
   --cors-allow-origins *

pushd ..
call webui.bat
popd