import { BasePage } from './base-page';
import { injectable } from 'tsyringe';

@injectable()
export class CommonPage extends BasePage{
  public constructor( ) {
    super( );
  }
}
