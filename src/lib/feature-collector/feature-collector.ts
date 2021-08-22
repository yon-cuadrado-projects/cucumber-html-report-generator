import * as CommonFunctions from '../common-functions/common-functions';
import type * as Models from '../models/models';
import Gherkin from 'gherkin';
import type { messages } from 'cucumber-messages';

export class CollectFeatureFiles {
  private readonly featuresDir: string| undefined;

  public constructor( reportGeneration?: Models.ReportGeneration ) {
    this.featuresDir = reportGeneration?.featuresFolder;
  }

  public async collectFeatures(): Promise<messages.GherkinDocument[] | null> {
    const result = CommonFunctions.checkFolder( this.featuresDir );

    if ( ! result ) {
      return <messages.GherkinDocument[]>[];
    }

    const files = await CommonFunctions.getFilesAsync( this.featuresDir! );
    const featureFiles = files.filter( ( file ) => file.endsWith( '.feature' ) );

    let features = await Promise.all(
      featureFiles.map( async ( feature ) => {
        const stream = Gherkin.fromPaths( [ feature ] );
        const gherkinDocument = <messages.GherkinDocument>( await CommonFunctions.streamToArrayAsync( stream ) )[1].gherkinDocument;
        return gherkinDocument;
      } ),
    );

    features = features.filter( Boolean );

    return features.length ? features : null;
  }
}
