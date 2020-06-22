# Fortify on Demand GitHub Action

## What is it?

The Fortify on Demand GitHub action allows you to check if your code is secure.
When a commit is triggered, [Fortify on Demand]() checks
the quality of the source code according to your defined policies.

## How to use it?

### Step 1: Get your Fortify on Demand API keys

Sign up on [Fortify on Demand]().

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
    name: A job to check my code quality
    steps:
    - name: Check code is secure
      id: fod
      uses: fod-community-plugins/fod-github-action@master
      with:
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        fod_access_key: ${{ secrets.FOD_ACCESS_KEY }}
        fod_secret_key: ${{ secrets.FOD_SECRET_KEY }}
        bsi_token: 'ENTER_YOUR_BSI_TOKEN'
        entitlement_preference: 'SubscriptionOnly'
        remediation_scan_preference: 'NonRemediationScanOnly'
        in_progress_scan_action: 'DoNotStartScan'
        zip_location: '/upload/fod.zip'
        polling_interval: '5'
```

The following parameters should *NOT* be changed:

 * **repo_token**: this is how Fortify on Demand can access your repository
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
