import { Before, setDefaultTimeout } from '@cucumber/cucumber';

Before(
  (): void => {
    setDefaultTimeout( 30000 );
  },
);
