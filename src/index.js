const { inspect } = require('util');
const core = require('@actions/core');
const github = require('@actions/github');
const tc = require('@actions/tool-cache');
const exec = require('@actions/exec');
const io = require('@actions/io');

function getSha() {
    if (github.context.eventName == 'pull_request') {
        return github.context.payload.pull_request.head.sha;
    } else {
        return github.context.sha;
    }
}

async function run() {
    try {
        core.info('Fortify on Demand GitHub Action')
        
        //
        // Inputs
        //

        // GitHub passed inputs
        const repo_token = core.getInput('repo_token', { required: true });
        const repository = core.getInput('repository', { required: true });
        const sha = core.getInput('sha');
        //const body = core.getInput('body');
        //const path = core.getInput('path');
        //const position = core.getInput('position');

        // FOD specific inputs
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
        const update_commit = core.getInput('update_commit');
        const update_pr = core.getInput('update_pr');
        
        // log inputs
        core.debug(`repo_token: ${repo_token}`);
        core.debug(`repository: ${repository}`);
        core.debug(`fod_uploader_ver: ${fod_uploader_ver}`);
        core.debug(`fod_credential_type: ${fod_credential_type}`);
        if (fod_credential_type === 'api') {
            core.debug(`fod_access_key: ${fod_access_key}`);
            core.debug(`fod_secret_key: ${fod_secret_key}`);
        } else if (fod_credential_type === 'user') {
            core.debug(`fod_username: ${fod_username}`);
            core.debug(`fod_password: ${fod_password}`);
        } else {
            core.info(`Unknown credential type: ${fod_credential_type}`);
        }
        core.debug(`bsi_token: ${bsi_token}`);
        core.debug(`entitlement_preference: ${entitlement_preference}`);
        core.debug(`zip_location: ${zip_location}`);
        core.debug(`remediation_scan_preference: ${remediation_scan_preference}`);
        core.debug(`in_progress_scan_action: ${in_progress_scan_action}`);
        core.debug(`audit_preference_id: ${audit_preference_id}`);
        core.debug(`include_third_party_apps: ${include_third_party_apps}`);
        core.debug(`is_bundled_assessment: ${is_bundled_assessment}`);
        core.debug(`is_remediation_scan: ${is_remediation_scan}`);
        core.debug(`purchase_entitlement: ${purchase_entitlement}`);
        core.debug(`run_open_source_scan: ${run_open_source_scan}`);
        core.debug(`notes: ${notes}`);
        core.debug(`polling_interval: ${polling_interval}`);
        core.debug(`update_commit: ${update_commit}`);
        core.debug(`update_pr: ${update_pr}`);

        const [owner, repo] = repository.split('/');
        core.debug(`owner: ${owner}`);
        core.debug(`repo: ${repo}`);
        const commit_sha = sha ? sha : getSha();
        core.debug(`commit_sha: ${commit_sha}`);

        const fodUploaderUrl = 'https://github.com/fod-dev/fod-uploader-java/releases/download/' + fod_uploader_ver + '/FodUpload.jar'
        core.info(`Downloading FODUploader from: ${fodUploaderUrl}`)
        const fodUploaderPath = await tc.downloadTool(fodUploaderUrl, 'FodUpload.jar');
        core.addPath(fodUploaderPath)
        core.info(`Downloaded.`);

        let execArray = ['-jar', 'FodUpload.jar'];
        if (fod_credential_type === 'api') {
            execArray.push('-ac', fod_access_key, fod_secret_key);
        } else if (fod_credential_type === 'user') {
            execArray.push('-uc', fod_username, fod_password)
        } else {
            core.info(`Unknown credential type: ${fod_credential_type}`)
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
            execArray.push('-notes', '"' + notes + '"');
        }
        if (polling_interval) {
            execArray.push('-I', polling_interval);
        }
        if (proxy_url) {
            execArray.push('-P', proxy_url, proxy_username, proxy_password, proxy_nt_domain, proxy_nt_workstation);
        }

        //
        // Execution
        //

        core.debug('Running FodUpload.jar with commandline: ' + execArray.toString());

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
        //await exec.exec('java', execArray, options);

        // remove not important lines
        scanOutput = scanOutput.replace('Authenticating', '');
        scanOutput = scanOutput.replace('Retiring Token : Token Retired Successfully', '');
        scanOutput = scanOutput.replace('Poll Status: In Progress', '')

        // extract scan id and status
        let scanIdRegex = /\nScan (.*) uploaded (.*)\n/g;
        let passStatusRegex = /\nPass\/Fail status: (.*)\n/g;
        let arr1 = scanIdRegex.exec(scanOutput);
        let scanId = arr1[1];
        let arr2 = passStatusRegex.exec(scanOutput);
        let scanStatus = arr2[1];

        const octokit = github.getOctokit(repo_token);

        // add a comment to the commit?
        if (update_commit) {
            core.info('Adding FOD scan details as commit comment.')
            await octokit.repos.createCommitComment({
                owner: owner,
                repo: repo,
                commit_sha: commit_sha,
                body: scanOutput
            });
        }

        // add a comment to the pull request?
        if (update_pr) {
            const pr = github.context.payload.pull_request;
            if (!pr) {
                core.warning('This is not a pull request, ignoring request to comment on it!');
                return;
            } else {
                core.info('Adding FOD scan details as Pull Request comment.')
                await octokit.issues.createComment({
                    owner: owner,
                    repo: repo,
                    issue_number: pr.number,
                    body: scanOutput
                });
            }
        }

        //
        // Outputs
        //

        core.setOutput('scan_id', scanId);
        core.setOutput('scan_status', scanStatus)

    } catch (error) {
        core.setFailed(error.message);
    }
}

run()
