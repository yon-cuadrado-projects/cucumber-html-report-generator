export const reportCreated = ( featureId: string ):string => `\n 
    =====================================================================================
        Multiple Cucumber HTML report generated in:
        ${featureId}
\n
    =====================================================================================\n`;
export const jsonPathNotProvided = 'A path which holds the JSON files should be provided.';
export const optionsNotProvided = 'Options need to be provided.';
export const noJsonFilesProvided = ( jsonDir: string ): string => `No JSON files found in '${jsonDir}'. NO REPORT CAN BE CREATED!`; 
export const invalidJsonProvided = ( fileNameAndPath: string, errorMessage: string ): string => `The file ${fileNameAndPath} is not a valid json, it has the error message ${errorMessage}`; 
export const invalidPathProvided = ( filePath: string ):string => `The path provided: '${filePath}' is invalid`;
export const featureRemoved = ( featureName: string ): string => `The feature ${featureName} has been removed because it doesn't have any scenarios`;
export const scenarioWithoutIdRemoved = ( scenarioName: string , featureName: string ): string => `The scenario ${scenarioName} of the feature: ${featureName} has been removed as it doesn't have id.`;
export const scenarioWithoutStepsRemoved = ( scenarioName: string , featureName: string ): string => `The scenario ${scenarioName} of the feature: ${featureName} has been removed as it doesn't have steps.`;
