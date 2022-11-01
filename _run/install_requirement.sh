#!/bin/bash
set -e  
pushd ..
/c/Python310/python --version
/c/Python310/python -m pip install virtualenv


if [ ! -d "venv" ]; then
  /c/Python310/python -m virtualenv venv
fi

VENV_PYTHON_PATH=$(pwd)/venv/Scripts/python
VENV_PIP_PATH=$(pwd)/venv/Scripts/pip
$VENV_PIP_PATH install -r requirements.txt
popd




# pushd .. > /dev/null
# projectRoot=$(pwd)
# for i in $(find "extensions" -type d -name '.git' -prune)
# do
#     repo=$(echo ${i%.git*})
#     pushd $repo > /dev/null
#        # check if requirements.txt exists
#        if [ -f "requirements.txt" ]; then
#            echo "Installing requirements for $repo"
#            cmd="$VENV_PIP_PATH install -r ${projectRoot}/$repo/requirements.txt"
#            echo $cmd
#            eval $cmd
#        fi    

#     popd > /dev/null
# done
# popd > /dev/null


export COMMANDLINE_ARGS="--listen --api --enable-insecure-extension-access  \
   --no-hashing --reinstall-torch --reinstall-xformers --xformers \
   --cors-allow-origins *"

pushd ..
./webui.bat
popd