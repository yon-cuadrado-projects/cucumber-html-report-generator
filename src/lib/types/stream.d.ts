import type { Readable } from 'stream';
import type { messages } from 'cucumber-messages';

declare module 'cucumber-messages'{
  export interface CucumberMessage extends Readable, messages.Envelope {}

}
