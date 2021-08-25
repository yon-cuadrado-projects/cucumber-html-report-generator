import 'cucumber-messages';
import type { Readable } from 'stream';
import type { messages } from 'cucumber-messages';

export interface CucumberMessage extends Readable, messages.Envelope {}
