const core = require('@actions/core');
const github = require('@actions/github');

try {
    console.log("Fortify on Demand GitHub Action")

    // inputs
    const input1 = core.getInput('input1');
    const repo_token = core.getInput('repo_token');
    const fod_access_key = core.getInput('fod_access_key');
    const fod_secret_key = core.getInput('fod_secret_key');
    const bsi_token = core.getInput('bsi_token');
    const entitlement_preference = core.getInput('entitlement_preference');
    const remediation_scan_preference = core.getInput('remediation_scan_preference');
    const in_progress_scan_action = core.getInput('in_progress_scan_action');
    const zip_location = core.getInput('zip_location');
    const polling_interval = core.getInput('polling_interval');

    console.log(input1);
    console.log('fod_access_key: ' + fod_access_key);
    console.log('fod_secret_key: ' + fod_secret_key);
    console.log('bsi_token: ' + bsi_token);
    console.log('entitlement_preference: ' + entitlement_preference);
    console.log('remediation_scan_preference: ' + remediation_scan_preference);
    console.log('in_progress_scan_action: ' + in_progress_scan_action);
    console.log('zip_location: ' + zip_location);
    console.log('polling_interval: ' + polling_interval);

    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log('The event payload: ' + payload);
    
} catch (error) {
    core.setFailed(error.message);
}
