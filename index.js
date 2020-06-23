const core = require('@actions/core');
const github = require('@actions/github');
const tc = require('@actions/tool-cache');
const exec = require('@actions/exec');
const io = require('@actions/io');

async function run() {
    try {
        console.log("Fortify on Demand GitHub Action")

        // Get the JSON webhook payload for the event that triggered the workflow
        //const payload = JSON.stringify(github.context.payload, undefined, 2)
        //console.log('Event payload: ' + payload);

        // inputs
        const repo_token = core.getInput('repo_token', { required: true });
        const fod_uploader_ver = core.getInput('fod_uploader_ver', { required: true });
        const fod_credential_type = core.getInput('fod_credential_type', { required: true });
        const fod_username = core.getInput('fod_username');
        const fod_password = core.getInput('fod_password');
        const fod_access_key = core.getInput('fod_access_key');
        const fod_secret_key = core.getInput('fod_secret_key');
        const bsi_token = core.getInput('bsi_token', { required: true });
        //const portal_url = core.getInput('portal_url');
        //const api_url = core.getInput('api_url');
        //const release_id = core.getInput('release_is');
        const entitlement_preference = core.getInput('entitlement_preference', { required: true });
        const zip_location = core.getInput('zip_location', { required: true });

        const remediation_scan_preference = core.getInput('remediation_scan_preference');
        const in_progress_scan_action = core.getInput('in_progress_scan_action');
        const audit_preference_id = core.getInput('audit_preference_id');
        const include_third_party_apps = core.getInput('include_third_party_apps');
        const is_bundled_assessment = core.getInput('is_bundled_assessment');
        const is_remediation_scan = core.getInput('is_remediation_scan');
        const purchase_entitlement = core.getInput('purchase_entitlement');
        const run_open_source_scan = core.getInput('run_open_source_scan');
        const notes = core.getInput('notes');

        const polling_interval = core.getInput('polling_interval');
        const proxy_url = core.getInput('proxy_url');
        const proxy_username = core.getInput('proxy_username');
        const proxy_password = core.getInput('proxy_password');
        const proxy_nt_domain = core.getInput('proxy_nt_domain');
        const proxy_nt_workstation = core.getInput('proxy_nt_workstation');

        // log all the inputs
        console.log('repo_token' + repo_token);
        console.log('fod_uploader_ver: ' + fod_uploader_ver);
        console.log('fod_credential_type: ' + fod_credential_type);
        if (fod_credential_type === 'api') {
            console.log('fod_access_key: ' + fod_access_key);
            console.log('fod_secret_key: ' + fod_secret_key);
        } else if (fod_credential_type === 'user') {
            console.log('fod_username: ' + fod_username)
            console.log('fod_password: ' + fod_password)
        } else {
            console.log('Unknown credential type: ' + fod_credential_type)
        }
        console.log('bsi_token: ' + bsi_token);
        console.log('entitlement_preference: ' + entitlement_preference);
        console.log('zip_location: ' + zip_location);

        console.log('remediation_scan_preference: ' + remediation_scan_preference);
        console.log('in_progress_scan_action: ' + in_progress_scan_action);
        console.log('audit_preference_id: ', audit_preference_id);
        console.log('include_third_party_apps: ' + include_third_party_apps);
        console.log('is_bundled_assessment: ' + is_bundled_assessment);
        console.log('is_remediation_scan: ' + is_remediation_scan);
        console.log('purchase_entitlement: ' + purchase_entitlement);
        console.log('run_open_source_scan:' + run_open_source_scan);
        console.log('notes:' + notes);
        console.log('polling_interval: ' + polling_interval);

        const fodUploaderUrl = 'https://github.com/fod-dev/fod-uploader-java/releases/download/' + fod_uploader_ver + '/FodUpload.jar'
        console.log('Downloading FODUploader from: ' + fodUploaderUrl)
        const fodUploaderPath = await tc.downloadTool(fodUploaderUrl, 'FodUpload.jar');
        //const fodUploaderPath = await tc.downloadTool('https://github.com/fod-dev/fod-uploader-java/releases/download/v4.0.4/FodUpload.jar', 'FodUpload.jar');
        core.addPath(fodUploaderPath)
        console.log('Downloaded.');

        //const fod_access_key_t = '2da61711-c998-4f73-a090-543b500662c3';
        //const fod_secret_key_t = 'SEBvaFJPT3QzOWU0T3dwV21-dVJyN0dxWWdHNF9C0';
        //const bsi_token_t = 'eyJ0ZW5hbnRJZCI6MTM3LCJ0ZW5hbnRDb2RlIjoiZW1lYWRlbW8iLCJyZWxlYXNlSWQiOjU1ODA2LCJwYXlsb2FkVHlwZSI6IkFOQUxZU0lTX1BBWUxPQUQiLCJhc3Nlc3NtZW50VHlwZUlkIjoxMTcsInRlY2hub2xvZ3lUeXBlIjoiSlMvVFMvSFRNTCIsInRlY2hub2xvZ3lUeXBlSWQiOjE2LCJ0ZWNobm9sb2d5VmVyc2lvbiI6bnVsbCwidGVjaG5vbG9neVZlcnNpb25JZCI6bnVsbCwiYXVkaXRQcmVmZXJlbmNlIjoiTWFudWFsIiwiYXVkaXRQcmVmZXJlbmNlSWQiOjEsImluY2x1ZGVUaGlyZFBhcnR5IjpmYWxzZSwiaW5jbHVkZU9wZW5Tb3VyY2VBbmFseXNpcyI6ZmFsc2UsInBvcnRhbFVyaSI6Imh0dHBzOi8vZW1lYS5mb3J0aWZ5LmNvbSIsImFwaVVyaSI6Imh0dHBzOi8vYXBpLmVtZWEuZm9ydGlmeS5jb20iLCJzY2FuUHJlZmVyZW5jZSI6IlN0YW5kYXJkIiwic2NhblByZWZlcmVuY2VJZCI6MX0=';
        //const zip_location_t = "fod_t.zip";

        let execArray = ['-jar', 'FodUpload.jar'];
        if (fod_credential_type === 'api') {
            execArray.push('-ac', fod_access_key, fod_secret_key);
        } else if (fod_credential_type === 'user') {
            execArray.push('-uc', fod_username, fod_password)
        } else {
            console.log('Unknown credential type: ' + fod_credential_type)
        }
        //execArray.push('-purl', portal_uri);
        //execArray.push('-aurl', api_uri);
        //execArray.push('-rid', release_id);
        execArray.push('-bsi', '"' + bsi_token + '"');
        execArray.push('-z', zip_location);
        execArray.push('-ep', entitlement_preference);

        //if (audit_preference_id) {
        //    execArray.push('-a', audit_preference_id);
        //}
        if (remediation_scan_preference) {
            execArray.push('-rp', remediation_scan_preference);
        }
        if (in_progress_scan_action) {
            execArray.push('-pp', in_progress_scan_action);
        }
        if (include_third_party_apps) {
            execArray.push('-itp', include_third_party_apps);
        }
        if (is_bundled_assessment) {
            execArray.push('-b', is_bundled_assessment);
        }
        if (is_remediation_scan) {
            execArray.push('-r', is_remediation_scan);
        }
        if (purchase_entitlement) {
            execArray.push('-purchase', purchase_entitlement);
        }
        if (run_open_source_scan) {
            execArray.push('os', run_open_source_scan);
        }
        if (notes) {
            //execArray.push('-n', '"' + notes + '"');
        }
        if (polling_interval) {
            execArray.push('-I', polling_interval);
        }
        if (proxy_url) {
            execArray.push('-P', proxy_url, proxy_username, proxy_password, proxy_nt_domain, proxy_nt_workstation);
        }
        console.log('Running FodUpload.jar with commandline: ' + execArray.toString());

        let scanOutput = '';
        let scanError = '';

        const options = {};
        options.listeners = {
            stdout: (data) => {
                scanOutput += data.toString();
            },
            stderr: (data) => {
                scanError += data.toString();
            }
        };

        // execute FodUpload
        await exec.exec('java', execArray, options);

        // remove not important lines
        scanOutput = scanOutput.replace("Authenticating\n", "");
        scanOutput = scanOutput.replace("Retiring Token : Token Retired Successfully\n", "");

        // extract scan id and status
        let scanIdRegex = /\nScan (.*) uploaded (.*)\n/g;
        let passStatusRegex = /\nPass\/Fail status: (.*)\n/g;
        let arr1 = scanIdRegex.exec(scanOutput);
        let scanId = arr1[1];
        let arr2 = passStatusRegex.exec(scanOutput);
        let scanStatus = arr2[1];

        core.setOutput("scanId", scanId);
        core.setOutput("scanStatus", scanStatus)

    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
