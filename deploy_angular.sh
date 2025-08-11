#!/bin/bash

# my variables
if [ "$#" -lt 3 ]; then
    echo "Usage: $0 XXXXYY name surname [machine project folder]"
    echo "(XXXXYY is for siteXXXXYY)"
    exit 1
fi

PATH_ON_REMOTE="/home/web/site$1/html"
USER="$2.$3"
MACHINE="${4:-lucia}.cs.unibo.it"
LAB="${USER}@${MACHINE}"
PROJECT=${5:-Selfie}
FOLDERNAME=${6:-"$HOME/Desktop/${PROJECT}"}
ARCHIVE="${PROJECT}.tar.gz"

echo ""
echo "📝 Please confirm the following values:"
echo "  - Site code      : $1"
echo "  - Remote path    : $PATH_ON_REMOTE"
echo "  - User           : $USER"
echo "  - Machine        : $MACHINE"
echo "  - Remote address : $LAB"
echo "  - Project        : $PROJECT"
echo "  - Local folder   : $FOLDERNAME"
echo "  - Archive name   : $ARCHIVE"
echo ""

read -p "✅ Are these values correct? [y/N]: " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user."
    exit 1
fi

#my script
echo " >> preparation"
cd ~/GITHUB/ || exit 1
rm -rf "${FOLDERNAME}" || exit 1
mkdir "${FOLDERNAME}" || exit 1
cp -r ${PROJECT}/* "${FOLDERNAME}" || exit 1
cd "${FOLDERNAME}" || exit 1

echo " >> build (with Angular) "
cd Angular || exit 1
#export PATH="$HOME/.npm-global/bin:$PATH" || exit 1
ng build --configuration production || exit 1

echo " >> cleanup before compress"
cd .. || exit 1
rm -rf .git || exit 1
rm -rf .idea || exit 1
rm -rf Angular/.angular || exit 1
rm -rf Angular/.cache || exit 1
rm -rf Angular/.run || exit 1
rm -rf Express/node_modules || exit 1
rm -rf Express/.idea || exit 1
rm -rf Angular/node_modules || exit 1

echo " >> Copy Angular build into Express/public"
rm -rf ../Express/public/* || exit 1
mkdir -p ../Express/public || exit 1
cp -r Angular/dist/angular/browser/* ../Express/public/ || exit 1

echo " >> compress"
cd "${FOLDERNAME}" || exit 1
ARCHIVE_PATH="$HOME/Desktop/${ARCHIVE}"
tar czvf "${ARCHIVE_PATH}" Express/ || exit 1
cd ..

echo " >> Upload the updated Express folder to lab machine"
# N.B. : PATH_ON_REMOTE and ARCHIVE variables are not seen in the ssh
scp -r "${ARCHIVE_PATH}" "${LAB}:${PATH_ON_REMOTE}" || exit 1
ssh -tt "${LAB}" << 'EOF'
export PATH=/usr/local/node/bin:$PATH
cd /home/web/site242536/html
tar xzvf ${PROJECT}.tar.gz
cp -r Express/* .
npm install
rm -rf Express ${PROJECT}.tar.gz
exit
EOF

echo " >> NOW IT IS YOUR TURN! PLEASE DO THIS"
echo " ssh ${LAB} "
echo " # enter YOUR PASSWORD (for MACHINE)"
echo " ssh gocker "
echo " # enter YOUR PASSWORD (for GOCKER)"
echo " start mongo site242536 "
echo " start node-20 site242536 ./app.js "
echo " exit "

echo " >> test it on:  https://site242536.tw.cs.unibo.it/"
echo " (if anything gone wrong you can find error doing \"cat /home/web/site242536/log/lasterr \" ) "
