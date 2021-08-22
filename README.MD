html-cucumber-report-generator
===============================
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

[![NPM](https://nodei.co/npm/html-cucumber-report-generator.png)](https://nodei.co/npm/html-cucumber-report-generator/)

This project is based in the project https://www.npmjs.com/package/multiple-cucumber-html-reporter
As with the original project html-cucumber-report-generator is a reporting module for Cucumber to parse the JSON output to a beautiful report. The differences between the previous project and this one are the following ones:
- written with typescript
- option to display Outline scenarios in a grouped way
- Option to store the reports in a mongodb database and access them from a web page
- Dark and light themes


![Snapshot - Features overview](./doc/images/features-with-dark-theme.jpeg "Snapshot - Browsers features overview")
![Snapshot - Features overview](./doc/images/features-with-light-theme.jpeg "Snapshot - Browsers features overview")

A sample with dark theme and report metadata can be found [here](./doc/report-with-dark-theme/report-with-dark-theme-and-report-metadata/index.html)
and a sample with light theme and report metadata can be found [here](./doc/report-with-dark-theme/report-with-light-theme-and-report-metadata/index.html)

And a sample with dark theme without report metadata can be found [here](./doc/report-with-dark-theme/report-with-dark-theme-without-report-metadata/index.html)
and a sample with light theme without report metadata can be found [here](./doc/report-with-dark-theme/report-with-light-theme-without-report-metadata/index.html)


## Install
Install this module locally with the following command:

``` bash
npm install cucumber-html-report-generator
```

Save to dependencies or dev-dependencies:

``` bash
npm install cucumber-html-report-generator --save
npm install cucumber-html-report-generator --save-dev
```

## Compatibility
Multiple Cucumber HTML Reporter **has been tested with the latest version of webdriverio 7.10 and it should work with the latest versions of cucumber.** 

## Usage
> **If you are using [webdriver.io](http://webdriver.io/)**
>   1. 


```javascript
const report = require('cucumber-html-report-generator');

report.generate({
        showExecutionTime: true,
        navigateToFeatureIfThereIsOnlyOne: true,
        openReportInBrowser: true,
        customStyle: "path-to-custom-style/custom-style.css",
        overrideStyle: "path-to-override-style/override-style.css",
        reportPath: "path-to-where-the-report-is-going-to-be-created",
        disableLog: false,
        theme: "dark",
        useCDN: false,
        reportTitle: "Report-title",
        jsonDir: "folder-with-the-cucumber-json-results",
        reportMetadataTitle: "report properties",
        reportMetadata:{
            name: 'browser',
            value: 'google chrome 91',
            icon: 'fab fa-chrome'
        };
        featuresFolder: "path-to-the-folder-with-the-feature-files",
        saveReportInMongoDb: false,
        saveCollectedJSON: true,
        saveEnrichedJSON: true,
        openReportInBrowser: false
});
```

### cucumber-js 3.x
Since cucumber-js 3.x the `AfterFeatures` hook is not supported anymore. To use Multiple Cucumber HTML Reporter it must be run in a separate node executable after the cucumber-js process finishes.

> **IMPORTANT:**

> Make sure that, when you generate the JSON files with Cucumber, each file will have a **UNIQUE** name. If you don't provide a unique name Cucumber will **override** the JSON files.

> **Advice** is to use for example the name of the feature, the name of the browser / device it is running on AND a unix timestamp with for example this `(new Date).getTime();`. This will result in something like this `name_of_feature.chrome.1495298685509.json`


## Options
  showExecutionTime?: boolean;
  openReportInBrowser?: boolean;
  navigateToFeatureIfThereIsOnlyOne?: boolean;
  theme?: string;
  customStyle?: string;
  overrideStyle?: string;
  reportPath?: string;
  disableLog?: boolean;
  useCDN?: boolean;
  reportTitle?: string;
  jsonDir: string;
  reportMetadata?: Metadata[];
  featuresFolder?: string;
  saveReportInMongoDb?: boolean;
  saveCollectedJSON?: boolean;
  saveEnrichedJSON?: boolean;
  reportMetadataTitle?: string;
  mongooseServerUrl?:string;

#### `showExecutionTime`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

If true it will show the execution time in the features summary page and in the feature details

#### `openReportInBrowser`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

If true it will make that the generated report is opened in the default browser

#### `navigateToFeatureIfThereIsOnlyOne`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

This option is used in conjunction with the previous one. In case the generated report only has one feature, the report opens directly 
in the feature detail.

#### `theme`
- **Type:** `String`
- **Mandatory:** No
- **Options:** Dark, Light
   
With this option it is possible to select the theme of the report, by default, if the property si not included it is selected the dark theme. You can select the light theme with the 'Light' value

#### `customStyle`
- **Type:** `String`
- **Mandatory:** No

With this option it is possible to pass a custom style to the report. This style will be copied at the end of the current style.

#### `overrideStyle`
- **Type:** `String`
- **Mandatory:** No

With this option it is possible to override the style of the report.

#### `reportPath`
- **Type:** `String`
- **Mandatory:** No

Using this option is possible to indicate the path where the report is going to be created. When no value is provided then the report will be created in the  folder cucumber-html-report-generator/YYYY-MM-DD_HH-mm-ss

#### `disableLog`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

This will disable the log so will **NOT** see this.

```shell
=====================================================================================
    Cucumber HTML Report Generator report generated in:

    /Users/wswebcreation/multiple-cucumber-html-reporter/.tmp/index.html
========================================================================
```

#### `useCDN`
- **Type:** `Boolean`
- **Mandatory:** No
- **DefaultValue:** False

With a true value the html resources are obtained from a cdn and with a false value they are obtained from
a subfolder in the report location.

#### `reportTitle`
- **Type:** `String`
- **Mandatory:** No
- **DefaultValue:** False

It is the features page title and it has the default value "Cucumber HTML Report Generator" 

#### `jsonDir`
- **Type:** `String`
- **Mandatory:** Yes

It is the folder where the cucumber execution result json files are located

#### `reportMetadata`
- **Type:** `Metadata[]`
- **Mandatory:** No

It is the metadata that is going to be included in the report. The metadata has to be provided as an object with the properties:
    - name
    - value
    - icon

#### `featuresFolder`
- **Type:** `String`
- **Mandatory:** No

It is the folder with the feature files

#### `saveReportInMongoDb`
- **Type:** `Boolean`
- **Mandatory:** No

With this parameter it is decided if the report is going to be saved in the mongoDb database specified with the parameter mongooseServerUrl.
The default value is false.

#### `saveCollectedJSON`
- **Type:** `Boolean`
- **Mandatory:** No

It allows to save the json that is created with the list of joined cucumber json reports

#### `saveEnrichedJSON`
- **Type:** `Boolean`
- **Mandatory:** No

It allows to save the json report of the joined cucumber json reports with the specifications to generate the html report in the report folder

#### `reportMetadataTitle`
- **Type:** `string`
- **Mandatory:** No

It displays a custom title in the report. If this parameter is not provided the value "Additional Data" and there is a valid value in the parameter reportMetadata
different than null

#### `mongooseServerUrl`
- **Type:** `String`
- **Mandatory:** No

It defines the url of the mongodb server. if no value is provided the value http://localhost:3000. It depends on the project x

#### `jsonDir`
- **Type:** `String`
- **Mandatory:** Yes

The directory that will hold all the generated JSON files, relative from where the script is started.

**N.B.:** If you use a npm script from the command line, like for example `npm run generate-report` the `jsonDir` will be relative from the path where the script is executed. Executing it from the root of your project will also search for the `jsonDir` from the root of you project.

### `reportPath`
- **Type:** `String`
- **Mandatory:** Yes

The directory in which the report needs to be saved, relative from where the script is started.

**N.B.:** If you use a npm script from the command line, like for example `npm run generate-report` the `reportPath` will be relative from the path where the script is executed. Executing it from the root of your project will also save the report in the `reportPath` in the root of you project.

### `staticFilePath`
- **Type:** `boolean`
- **Mandatory:** No

If true each feature will get a static filename for the html. Use this feature only if you are not running multiple instances of the same tests.

### `saveCollectedJSON`
- **Type:** `boolean`
- **Mandatory:** No

This module will first merge all the JSON-files to 1 file and then enrich it with data that is used for the report. If `saveCollectedJSON :true` the merged JSON **AND** the enriched JSON will be saved in the `reportPath`. They will be saved as:

- `merged-output.json`
- `enriched-output.json`

### `disableLog`
- **Type:** `boolean`
- **Mandatory:** No
- **Default:** `false`

This will disable the log so will **NOT** see this.

```shell
=====================================================================================
    Multiple Cucumber HTML report generated in:

    /Users/wswebcreation/multiple-cucumber-html-reporter/.tmp/index.html
========================================================================
```
### `pageTitle`
- **Type:** `string`
- **Mandatory:** No
- **Default:** Multiple Cucumber HTML Reporter

You can change the report title in the HTML head Tag

### `reportName`
- **Type:** `string`
- **Mandatory:** No

You can change the report name to a name you want

### `pageFooter`
- **Type:** `string`
- **Mandatory:** No

You can customise Page Footer if required. You just need to provide a html string like `<div><p>A custom footer in html</p></div>`

### `displayDuration`
- **Type:** `boolean`
- **Mandatory:** No

If set to `true` the duration of steps, scenarios and features is displayed on the Features overview and single feature page in an easily readable format.
This expects the durations in the report to be in **nanoseconds**, which might result in incorrect durations when using a version of Cucumber(JS 2 and 3) that does not report in nanoseconds but in milliseconds. This can be changed to milliseconds by adding the parameter `durationInMS: true`, see below

> **NOTE: Only the duration of a feature can be shown in the features overview. A total duration over all features CAN NOT be given because the module doesn't know if all features have been run in parallel**

### `durationInMS`
- **Type:** `boolean`
- **Default:** `false`
- **Mandatory:** No

If set to `true` the duration of steps will be expected to be in **milliseconds**, which might result in incorrect durations when using a version of Cucumber(JS 1 or 4) that does report in **nanaseconds**.
This parameter relies on `displayDuration: true`

### `useCDN`
- **Type:** `boolean`
- **Mandatory:** No

If you prefer, you can use CDN for assets.

### `customStyle`
- **Type:** `path`
- **Mandatory:** No

If you need add some custom style to your report. Add it like this `customStyle: 'your-path-where/custom.css'`

### `overrideStyle`
- **Type:** `path`
- **Mandatory:** No

If you need replace default style for your report. Add it like this `overrideStyle: 'your-path-where/custom.css'`

### `metadata`
- **Type:** `JSON`
- **Mandatory:** No

Print more data to your report, such as browser name + version, platform name + version and your environment. The values need to meet some predefined data, see [Metadata](./README.MD#metadata) for more info.
Data can be passed like below.

> **If you provide the metadata when instantiating `multi-cucumber-html-reporter` the metadata will be added to each feature. If you already have metadata in your JSON then the metadata in the JSON will take precedence**

```js
metadata:{
    browser: {
        name: 'chrome',
        version: '60'
    },
    device: 'Local test machine',
    platform: {
        name: 'ubuntu',
        version: '16.04'
    }
}
```

See [metadata](./README.MD#metadata-1) for more info

### `customMetadata`
- **Type:** `boolean`
- **Mandatory:** No

It is possible to provide custom metadata by setting this variable to `true`. Custom metadata will override the regular metadata completely and potentially have strange formatting bugs if too many (10+) variables are used.
The columns will be in the order defined by the order of the list.

Adding the metadata is done in the same way as with normal metadata. The metadata is formed as a list of key-value pairs to preserve order:

```js
metadata: [
        {name: 'Environment v.', value: '12.3'},
        {name: 'Plugin v.', value: '32.1'},
        {name: 'Variable set', value: 'Foo'}
    ]
```

On the features overview page the custom metadata is shown like:
![Snapshot - Features overview custom metadata](./docs/images/features-custom-metadata.jpg "Snapshot - Features overview custom metadata")

>**IMPORTANT:**
> This does not work correctly if features have different sets of metadata. Try to avoid this situation.

### `customData`
- **Type:** `object`
- **Mandatory:** No

You can add a custom data block to the report like this

![Snapshot - Features overview custom data](./docs/images/custom-data.jpg "Snapshot - Features overview custom data")

```js
customData: {
    title: 'Run info',
    data: [
        {label: 'Project', value: 'Custom project'},
        {label: 'Release', value: '1.2.3'},
        {label: 'Cycle', value: 'B11221.34321'},
        {label: 'Execution Start Time', value: 'Nov 19th 2017, 02:31 PM EST'},
        {label: 'Execution End Time', value: 'Nov 19th 2017, 02:56 PM EST'}
    ]
}
```

#### `customData.title`
- **Type:** `string`
- **Mandatory:** No
- **Default:** `Custom data title`

Select a title for the custom data block. If not provided it will be defaulted.

#### `customData.data`
- **Type:** `array`
- **Mandatory:** yes

The data you want to add. This needs to be in the format

```js
data: [
    {label: 'your label', value: 'the represented value'}
]
```

## Metadata
The report can also show on which browser / device a feature has been executed. It is shown on the featurs overview in the table as well as on the feature overview in a container.

### Adding metadata to the Cucumber JSON

To be able to see this you will need to add the following to the Cucumber JSON before you save it.


```javascript
// This represents the Cucumber JSON file that has be retrieved
const cucumberJSON;

const metadata = {
	"browser": {
		"name": "chrome",
		"version": "58"
	},
	"device": "string",
	"platform": {
		"name": "osx",
		"version": "10.12"
	}
}

// Add it with for example
cucumberJSON[0].metadata = metadata;

// Now save the file to the disk
```

### `metadata.app.name`
- **Type:** `string`

**e.g.:** The name of the app.

### `metadata.app.version`
- **Type:** `string`

**e.g.:** The version of the app.

### `metadata.browser.name`
- **Type:** `string`
- **Possible values:** `internet explorer | edge | chrome | firefox | safari`

> If no correct value is provided the `?`-icon with the text `not known` is shown

### `metadata.browser.version`
- **Type:** `string`

**e.g.:** The version of the browser, this can be added manual or retrieved during the execution of the tests to get the exact version number.

>If no correct value is provided the `?`-icon with the text `not known` is shown

### `metadata.device`
- **Type:** `string`

**e.g.:** A name that represents the type of device. For example, if you run it on a virtual machine, you can place it here `Virtual Machine`, or the name of the mobile, like for example `iPhone 7 Plus`.

> If no correct value is provided the `?`-icon with the text `not known` is shown

### `metadata.platform.name`
- **Type:** `string`
- **Possible values:** `windows | osx | linux | ubuntu | android | ios`

> If no correct value is provided the `?`-icon with the text `not known` is shown

### `metadata.platform.version`
- **Type:** `string`

**e.g.:** The version of the platform

>If no correct value is provided the `?`-icon with the text `not known` is shown

### Metadata example features overview
![Snapshot - Features overview browser / device info](./docs/images/overview-metadata.jpg "Snapshot - Features overview browser / device info")

### Metadata example scenario with and without known data
![Snapshot - Scenario browser / device info](./docs/images/scenario-browser-metadata.jpg "Snapshot - Scenario browser / device info")
![Snapshot - Scenario app / device info](./docs/images/scenario-app-metadata.jpg "Snapshot - Scenario app / device info")
![Snapshot - Scenario browser / device info not known](./docs/images/scenario-no-metadata.jpg "Snapshot - Scenario browser / device info not known")

## FAQ
### Only 1 report is shown in the features overview table
It could be that the name of the Cucumber JSON file that has been saved is not unique (enough).

My advice is to use for example:

- the name of the feature
- the name of the browser / device it is running on
- a unix timestamp with for example this `(new Date).getTime();`

This will result in something like this `name_of_feature.chrome.1495298685509.json`.

The advantage of this is that when you look at the folder where the Cucumber JSON-files are saved you can see:

- the features that have been executed
- on which browser
- a timestamp to see which feature has been executed the last (if featurename and browser are the same)

### Metdata shows `not known` or not the correct icons
There could be 2 causes:

 1. The metadata has not (correctly) been added to the Cucumber JSON.
 2. The `metadata.browser.name` or `metadata.platform.name` can't be mapped to the right icon

To fix this see the part about **Metadata** and check the **possible values**.

### How to attach Screenshots to HTML report
You can attach screenshots at any time to a Cucumber JSON file. Just create a Cucumber `scenario`-hook that will handle this. You can add them during running or when a `scenario` failed.

> Check the framework you are using to attach screenshots to the JSON file.

### How to attach Plain Text to HTML report
You can attach plain-text / data at any time to a Cucumber JSON file to help debug / review the results. You can add them during running or when a `scenario` failed.

> Check the framework you are using to attach plain text to the JSON file.

### How to attach pretty JSON to HTML report
You can attach JSON at any time to a Cucumber JSON file. You can add them during running or when a `scenario` failed.

> Check the framework you are using to attach JSON data to the JSON file.

## Changelog and Releases
The Changelog and releases can be found [here](https://github.com/wswebcreation/multiple-cucumber-html-reporter/releases)

## Contributing
How to contribute can be found [here](./docs/CONTRIBUTING.md)

## Credits
In the search for a reporting tools for Cucumber I found a few tools that helped me a lot:

- [cucumber-html-repository](https://github.com/gkushang/cucumber-html-reporter)
- [cucumber-html-report](https://github.com/leinonen/cucumber-html-report)
- [cucumber-protractor-report](https://github.com/JesterXL/cucumber-protractor-report)
- [grunt-protractor-cucumber-html-report](https://github.com/robhil/grunt-protractor-cucumber-html-report)
