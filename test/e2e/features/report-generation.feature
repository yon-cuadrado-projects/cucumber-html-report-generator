Feature: Report generation
      As a product tester
      I want to check that the report is generated correctly

      Scenario: The report can be opened without errors
            Given The folder '.tmp/report' is deleted
            And The user generates a report with 'dark' theme in the folder '.tmp/report'
            When The user opens the report in the '.tmp/report' folder
            Then The browser have the errors '' in the console
            And The 'features' graph is 'displayed' in the features-overview page
            And The 'scenarios' graph is 'displayed' in the features-overview page
            And The additional data header title is 'Additional Data' in the features-overview page
            And The 'Project' field value is 'custom project' in the features-overview page
            And The 'Release' field value is '1.2.3' in the features-overview page
            And The 'Cycle' field value is '2' in the features-overview page
            And The 'Execution Start Date' field value is '2021-03-26 14:01' in the features-overview page
            And The 'Execution End Date' field value is '2021-03-26 16:05' in the features-overview page

      Scenario: The feature detail can be opened without errors
            Given The folder '.tmp/report' is deleted
            And The user generates a report with 'dark' theme in the folder '.tmp/report'
            When The user opens the report in the '.tmp/report' folder
            And The user opens the featurte 'Feature with all scenarios in status passed'
            Then The browser have the errors '' in the console
            And The 'scenarios' graph is 'displayed' in the feature-overview page
            And The 'steps' graph is 'displayed' in the feature-overview page
            And The additional data header title is 'Custom Data' in the feature-overview page
            And The 'browser' field value is 'Firefox 53' in the feature-overview page
            And The 'device' field value is 'Virtual Machine' in the feature-overview page
            And The 'platform' field value is 'Ubuntu 16.04' in the feature-overview page