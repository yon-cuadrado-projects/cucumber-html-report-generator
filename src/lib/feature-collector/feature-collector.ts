import * as CommonFunctions from '../common-functions/common-functions';
import type * as Models from '../models/models';
import type * as messages from '@cucumber/messages';
import { GherkinStreams } from '@cucumber/gherkin-streams';

export class CollectFeatureFiles {
  private readonly featuresDir: string | undefined;

  public constructor( reportGeneration?: Models.ReportGeneration ) {
    this.featuresDir = reportGeneration?.featuresFolder;
  }

  public async collectFeatures (): Promise<messages.GherkinDocument[] | null> {
    const result = CommonFunctions.checkFolder( this.featuresDir );

    if ( !result ) {
      return <messages.GherkinDocument[]>[];
    }

    const files = await CommonFunctions.getFilesAsync( this.featuresDir! );
    const featureFiles = files.filter( ( file ) => file.endsWith( '.feature' ) );

    const features = await Promise.all(
      featureFiles.map( async ( feature ) => {
        const stream = GherkinStreams.fromPaths( [ feature ], {} );

        const gherkinDocument = ( await CommonFunctions.streamToArray( stream ) )[ 1 ].gherkinDocument;
        return gherkinDocument;
      } ),
    );

    const filteredFeatures = features.filter( ( feature ): feature is messages.GherkinDocument => Boolean( feature ) );

    return filteredFeatures.length ? filteredFeatures : null;
  }
}
