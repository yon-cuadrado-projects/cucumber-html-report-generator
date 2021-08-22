import * as CommonFunctions from '../../common-functions/common-functions';
import * as Models from '../../models/models';

export class StepFormatter {
  public parseStep ( step: Models.Step ): Models.Step {
    let localStep = step;
    localStep = this.initializeStep( localStep );
    localStep = this.formatStepEmbeddings( localStep );
    if( typeof step.rows !== 'undefined' && step.rows.length ){
      step.rowsCells = this.formatRows( step.rows );
    }
    step.argumentsCells = this.formatRows( step.arguments?.[0]?.rows );
    this.setColorAndIcon( step );
    return localStep;
  }

  private formatStepEmbeddings ( step: Models.Step ): Models.Step {
    if ( step.embeddings.length ) {
      step.embeddings.forEach( ( embedding: Models.Embedding, embeddingIndex: number ) => {
        let embeddingType = typeof embedding.mime_type === 'undefined' ? embedding.media?.type : embedding.mime_type ;
        let embeddingData: string = embedding.data;

        switch ( embeddingType ){
        case 'application/json':
          try {
            embeddingData = JSON.stringify( JSON.parse( embeddingData ), undefined, 2 );
          } catch ( error: unknown ){
            embeddingData = ( <Error>error ).message;
          }
          step.json = step.json.concat( [ embeddingData ] );
          break;

        case 'text/html':
          step.html = step.html.concat( [ CommonFunctions.isBase64( embeddingData ) ? Buffer.from( embeddingData, 'base64' ).toString( 'utf-8' ) : embeddingData ] );
          break;

        case 'text/plain':
          step.text = ( step.text ? step.text : [] ).concat( [
            CommonFunctions.isBase64( embeddingData ) ? CommonFunctions.escapeHTML( Buffer.from( embeddingData, 'binary' ).toString( 'base64' ) ) : CommonFunctions.escapeHTML( embeddingData )
          ] );
          break;

        case 'image/png':
          embeddingType.split( ':' );
          step.image = step.image.concat( [ `data:image/png;base64,${  embeddingData}` ] );
          step.embeddings[ embeddingIndex ] = <Models.Embedding>{} ;
          break;

        case 'audio/ogg':
          step.audio = step.audio.concat( [ `data:audio/mpeg;base64,${  embeddingData}` ] );
          step.embeddings[ embeddingIndex ] = <Models.Embedding>{};
          break;

        case 'video/ogg':
          step.video = step.video.concat( [ `data:video/mpeg;base64,${  embeddingData}` ] );
          step.embeddings[ embeddingIndex ] = <Models.Embedding>{};
          break;

        default:
          embeddingType = 'text/plain';
          if ( embedding.mime_type ) {
            embeddingType = embedding.mime_type;
          } else if ( embedding.media?.type ) {
            embeddingType = embedding.media.type;
          }
          step.attachments.push( {
            data: `data:${embeddingType};base64,${embedding.data}`,
            type: embeddingType
          } );
        }
        step.embeddings[ embeddingIndex ] = <Models.Embedding>{};
      } );
    }
    return step;
  }

  private formatRows ( rows: Models.Row[] | undefined ): string {
    let rowsTemp = '';
    if ( typeof rows !== 'undefined' && rows.length ) {
      rowsTemp = '<table class=\'table-bordered table-dark ms-4\'>';
      rows.forEach( ( row, rowIndex ) => {
        rowsTemp += '<tr\\>';
        row.cells.forEach( ( cell ) => {
          if ( rowIndex === 0 ) {
            rowsTemp += `<td class=bg-primary> ${cell} </td>`;
          } else {
            rowsTemp += `<td> ${cell} </td>`;
          }
        } );
        rowsTemp += '</tr>';
      } );
      rowsTemp = `${rowsTemp} </table>`;
    }
    return rowsTemp;
  }

  private setColorAndIcon ( step: Models.Step ): void{
    switch ( step.result.status ){
    case Models.Status.passed:
      step.result.color = ' passed-color';
      step.result.icon = 'fa fa-check-circle fa-1x';
      step.result.title = 'Step passed';
      break;
    case Models.Status.failed:
      step.result.color = ' failed-color';
      step.result.icon = ' fa fa-exclamation-circle fa-1x ';
      step.result.title = 'Step failed';
      break;
    case Models.Status.ambiguous:
      step.result.color = 'ambiguous-color';
      step.result.icon = ' fas fa-bolt fa-1x ';
      step.result.title = 'Step has double step implementation and failed because of that';
      break;
    case Models.Status.pending:
      step.result.color = 'pending-color';
      step.result.icon = ' fa fa-minus-circle fa-1x ';
      step.result.title = 'Step is pending';
      break;
    case Models.Status.skipped:
      step.result.color = 'skipped-color';
      step.result.icon = ' fas fa-arrow-circle-right fa-1x ';
      step.result.title = 'Step is skipped';
      break;
    case Models.Status.undefined:
      step.result.color = 'undefined-color';
      step.result.icon = ' fa fa-question-circle fa-1x ';
      step.result.title = 'Step passed';
      break;
    // No default
    }
  }

  private initializeStep( step: Models.Step ): Models.Step{
    step.audio = [];
    step.attachments = [];
    step.arguments = typeof step.arguments === 'undefined' ? []: step.arguments;
    step.embeddings = typeof step.embeddings === 'undefined' ? [] : step.embeddings;
    step.examples = [];
    step.html = [];
    step.json = [];
    step.id = '';
    step.line = typeof step.line === 'undefined' ? -1 : step.line;
    step.image = [];
    step.result.duration = typeof step.result.duration === 'undefined' ? 0 : step.result.duration;
    step.result.durationHHMMSS = CommonFunctions.convertTimeFromNanoSecondsToHHMMSS( step.result.duration );
    step.rows = typeof step.rows === 'undefined' ? [] : step.rows;
    step.text = null;
    step.output = typeof step.output === 'undefined' ? [] : step.output;
    step.video = [];
    if( step.match ){
      step.match.arguments = typeof step.match.arguments === 'undefined' ? []: step.match.arguments;
      step.match.location = '';
    }
    return step;
  }
}
