#!/bin/sh -l

FOD_UPLOADER_JAR="/FodUpload.jar"

BSI_TOKEN=$1
ENTITLEMENT_PREFERENCE=$2
REMEDIATION_SCAN_PREFERENCE=$3
IN_PROGRESS_SCAN_ACTION=$4
ZIP_LOCATION=$5
POLLING_INTERVAL=$6

echo "Fortify on Demand GitHub action"
echo "Running with these parameters"
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo "BSI_TOKEN:                    ${BSI_TOKEN}"
echo "ENTITLEMENT_PREFERENCE:       ${ENTITLEMENT_PREFERENCE}"
echo "REMEDIATION_SCAN_PREFERENCE:  ${REMEDIATION_SCAN_PREFERENCE}"
echo "IN_PROGRESS_SCAN_ACTION:      ${IN_PROGRESS_SCAN_ACTION}"
echo "ZIP_LOCATION:                 ${ZIP_LOCATION}"
echo "POLLING_INTERVAL:             ${POLLING_INTERVAL}"

echo ""

echo "INPUT_REPO_TOKEN:           ${INPUT_REPO_TOKEN}"
echo "GITHUB_ACTOR:               ${GITHUB_ACTOR}"
echo "GITHUB_REPOSITORY:          ${GITHUB_REPOSITORY}"
echo "GITHUB_SHA:                 ${GITHUB_SHA}"
echo "GITHUB_REF:                 ${GITHUB_REF}"

export FOD_ACCESS_KEY=${INPUT_FOD_ACCESS_KEY}
export FOD_SECRET_KEY=${INPUT_FOD_SECRET_KEY}

java -jar "${FOD_UPLOADER_JAR}" \
  -ac  "${FOD_ACCESS_KEY}" "${FOD_SECRET_KEY}" \
  -bsi "${BSI_TOKEN}" \
  -ep  "${ENTITLEMENT_PREFERENCE}" \
  -rp  "${REMEDIATION_SCAN_PREFERENCE}" \
  -pp  "${IN_PROGRESS_SCAN_ACTION}" \
  -z   "${ZIP_LOCATION}" \
  -I   "${POLLING_INTERVAL}"

exit $?
