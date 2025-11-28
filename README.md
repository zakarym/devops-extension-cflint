# CFLint Scan

**CFLint** is a linter for CFML and you can find more information at its [GitHub repository](https://github.com/cflint/CFLint). This extension integrates **CFLint** into your builds.

## Content

* [Installation](#installation)
* [Source Code](#source-code)
* [What The Build Step Does](#what-the-build-step-does)
* [Usage](#usage)

## Installation

Installation can be done using [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=JoshKnutsonExtensions.devops-extension-cflint).

***Java must be installed on the machine at this time**

## Source Code

Source code can be found on [GitHub](https://github.com/joshknutson/devops-extension-cflint).

## What The Build Step Does

This build step is running cfLint against your code with using the [**CFLint**](https://github.com/cflint/CFLint). The result is reported as a section on the build summary page.

![Result is reported on the build summary page](https://raw.githubusercontent.com/joshknutson/devops-extension-cflint/master/images/BuildSummary.png)

## Usage

Add the task to your build configuration:

### On-Premise

![Add cfLint task](https://raw.githubusercontent.com/joshknutson/devops-extension-cflint/master/images/TaskList.png)

### Azure DevOps yml task

```yml
- task: cflint@1
  inputs:
    workingFolder: '' #starting folder to start scanning
    javaOptions: '' #override default java memory allocation pool of -Xmx512m and add other java options
    cflintJarDownloadUrl: 'https://github.com/cflint/CFLint/releases/download/CFLint-1.5.0/CFLint-1.5.0-all.jar'
    cflintarguments: '' #extra arguments you want to pass along
```

Arguments have to be specified:

* By default the cfLint is running in the root of the repository, you can modify that in the advanced settings as the working folder task parameter.
* by default the cfLint jar is provided a default java memory allocation pool of -Xmx512m, you can modify that in the advanced settings as the javaOptions task parameter.
* By default the cfLint jar is downloaded from the url: `https://github.com/cflint/CFLint/releases/download/CFLint-1.5.0/CFLint-1.5.0-all.jar`:
  * You can change overwrite it to a different version if needed
  * But now file shares and local files are supported to such as:

  ```cmd
  file://my-file-share/public/software/cflint.jar
  ```

  or

  ```cmd
  ./cflint.jar
  ```

### Linting

This extension uses the **CFLint** tool to scan CFML files and provide feedback on potential issues. The linter optionally takes rule configuration via a `.cflintrc` file, for which details can be found at [**CFLint**'s repo](https://github.com/cflint/CFLint#folder-based-configuration).

## Known Issues/Limitations

1. Not an issue with the extension itself, but be aware that **CFLint** is a heavy/slow application compared to most linters, especially when used through the command line. Some things are done with the extension to account for this.
1. As of this writing, **CFLint** (v1.5.0) often misreports issue location.
