# Fortify on Demand GitHub Action

## What is it?

The [Fortify on Demand](https://www.microfocus.com/en-us/products/application-security-testing/overview) GitHub action 
allows you to upload your source code into Fortify on Demand and run a static analysis scan to find any security 
vulnerabilities. The action can also add a comment to the commit or pull request that includes details of the 
scan.  

The action currently makes use of the [fod-uploader-java](https://github.com/fod-dev/fod-uploader-java) utility and downloads a
specific version as part of the process. The intention is to replace this utility with native FOD REST API calls in
the future.

## How to use it?

### Step 1: Create your FOD API key

If you haven't already done so, sign up to [Fortify on Demand](https://www.microfocus.com/en-us/products/application-security-testing/free-trial).
Login in as a user with "Administrative" privileges and navigate to **Administration->Settings-API**.
Create a new API Key with at a minimum the "Start Scan" role.

![Example](img/create-api-key.png) 

Make a note of the API Access Key and Secret.

### Step 2: Configure your FOD API keys in your GitHub repository

Now you need to add your FOD API keys into GitHub.

On GitHub, go in your repository settings, click on the secret *Secrets* (on the right) and create a new secret.

Create a secret called `FOD_ACCESS_KEY` and set it to the value of the API Access key generated at the previous step.

Create another secret called `FOD_SECRET_KEY` and set it to the value of the secret key generated at the previous step.

### Step 3: Configure the GitHub action

Create a file `.github/workflows/main.yml` and insert the following content.

```yaml
on: [push]

jobs:
  check-quality:
    runs-on: ubuntu-latest
    name: Static Analysis
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 1
      - uses: papeloto/action-zip@v1
        with:
          files: src/**
          dest: fod.zip
      - uses: fortify-community-plugins/fod-github-action@master
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
          notes: 'FOD Github Action initiated Scan'
          update_commit: true
          update_pr: false
```

The following parameters should *NOT* be changed:

 * **repo_token**: this is created automatically and is how the Action can access your repository
 * **fod_access_key** and **fod_access_key**: this is how the action can communicate with FOD.

The following parameters should be changed:

 * **bsi_token**: this is the Build Server Integration token that can be found when you configure a new static scan in FOD. Create a secret called BSI_TOKEN and copy the value from FOD into it.
 * **zip_location**: this is the location of a Zip file containing the source code you want to upload into FOD. An example is shown on how to create a Zip file above.
 * **update_commit**: set to 'true' if you want to add the output of the scan as a comment on the commit.
 * **update_pr**: set to 'true' if you want to add the output of the scan as a comment on a pull request.
 
The remainder of the arguments are passed through to [fod-uploader-java](https://github.com/fod-dev/fod-uploader-java).
Please refer to its documentation.

### Step 4: Make a commit 

Everything is now set up

Add a new commit and FOD will check if the new code is secure accoring to the release Security Policy.

----------

## Debugging

You can create a repository secret called **ACTIONS_STEP_DEBUG** which will turn on debugging in the logs.

----------
 
## Developing and Contributing


If you have any problems, please consult [GitHub Issues](https://github.com/fortify-community-plugins/fod-github-action/issues)
to see if has already been discussed.

----------

## Licensing

**fod-github-action** is licensed under the [GNU General Public license](LICENSE).

