# Fortify on Demand GitHub Action

## What is it?

The [Fortify on Demand](https://www.microfocus.com/en-us/products/application-security-testing/overview) GitHub action 
allows you to upload your source code into Fortify on Demand and run static analysis scan to find any security 
vulnerabilities. The action can also optionally add a comment to the commit or pull request that includes details of the 
scan.  

The action makes use of the [fod-uploader-java](https://github.com/fod-dev/fod-uploader-java) utility and downloads a
specific version of it as part of the process. 

## How to use it?

### Step 1: Create your Fortify on Demand API key

Sign up to [Fortify on Demand](https://www.microfocus.com/en-us/products/application-security-testing/free-trial) if you
haven't done so already.

In Administration, generate API keys.

### Step 2: Configure your Fortify on Demand API keys in your GitHub repository

You need to add your Fortify on Demand API keys into GitHub.

On GitHub, go in your repository settings, click on the secret *Secrets* (on the right) and create a new secret.

Create a secret called `FOD_ACCESS_KEY` and set it to the value of the access key generated at the previous step.

Create another secret called `FOD_SECRET_KEY` and set it to the value of the secret key generated at the previous step.

### Step 3: Configure the GitHub action

Create a file `.github/workflows/main.yml` and insert the following
content.

```yaml
on: [push]

jobs:
  check-quality:
    runs-on: ubuntu-latest
    name: Fortify on Demand
    steps:
    - name: Static Analysis
      id: fod
      uses: fod-community-plugins/fod-github-action@master
      with:
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          fod_credential_type: 'api'
          fod_access_key: ${{ secrets.FOD_ACCESS_KEY }}
          fod_secret_key: ${{ secrets.FOD_SECRET_KEY }}
          bsi_token: ${{ secrets.BSI_TOKEN }}
          entitlement_preference: 'SubscriptionOnly'
          remediation_scan_preference: 'NonRemediationScanOnly'
          in_progress_scan_action: 'DoNotStartScan'
          audit_preference_id: 'Automated'
          zip_location: 'fod.zip'
          polling_interval: '5'
          notes: 'Test Scan'
          update_commit: true
          update_pr: false
```

The following parameters should *NOT* be changed:

 * **repo_token**: this is created automatically and is how the Action can access your repository
 * **fod_access_key** and **fod_access_key**: this is how the action can communicate with Fortify on Demand.

The following parameters can be changed:
...

### Step 4: Make a commit 

Everything is set up

Add a new commit and the Fortify on Demand engine will check if the new code is secure.

# Contact and bug reports

Feel free to open an issue on this GitHub project.
If you have questions related to Fortify on Demand itself, please
contact me (kevin.lee@microfocus.com)
