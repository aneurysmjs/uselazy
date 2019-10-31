# uselazy

react hook for lazy load and code-split react components or whatever you want.

NOTE: at the moment this ONLY supports dynamic imports for React components where's a default export.

named exports will be handle soon.

<br />

[![GitHub version](https://badge.fury.io/gh/aneurysmjs%2Fuselazy.svg)](https://badge.fury.io/gh/aneurysmjs%2Fuselazy) [![Build Status](https://travis-ci.org/aneurysmjs/uselazy.png?branch=master)](https://travis-ci.org/aneurysmjs/uselazy) ![Eclipse Marketplace](https://img.shields.io/eclipse-marketplace/last-update/uselazy.svg) ![GitHub last commit](https://img.shields.io/github/last-commit/aneurysmjs/uselazy.svg) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/aneurysmjs/uselazy.svg) ![GitHub issues](https://img.shields.io/github/issues/aneurysmjs/uselazy.svg)

<hr />

## Installation

```
 npm install uselazy
```

or 

```
 yarn add uselazy
```

## API

```typescript 
/**
 * this is the object that useLazy accepts
 */
interface LazyObj<P> {
  // function that returns a promise from a dynamic import
  getModule: () => Promise<{ default: () => P }> | Array<Promise<{ default: () => P }>>;
  // this is were you decided when to execute the import
  shouldImport: boolean;
  // (OPTIONAL) do something after all has been loaded
  onFynally?: () => void;
}
```
## Usage

``` jsx
// Text.tsx
import React from 'react'

const Text = () => <p> Here's your beer </p>;

export default Text;

// App.tsx
import React, { useState } from 'react';
import useLazy from 'uselazy';

const App = () => {
  const [cond, setCond] = useState(false);
  const { isLoading, result: SomeComponent } = useLazy({
    getModule: () => import('./Text'),
    shouldImport: cond,
    onFynally: () => console.log('ахуититиьна')
  });

  return (
    <div>
      <h1>I'm very lazy </h1>
      <button onClick={() => setCond(!cond)}>
        Buy me a beer 
      </button>

      {isLoading && <span>some spinner</span>}

      {SomeComponent && <SomeComponent />}
    </div>
  );
};
```

### Also you can handle multiple imports

``` jsx
// Text.tsx
import React from 'react'

const Text = () => <p> Here's your beer </p>;

export default Text;

// AnotherText.tsx
import React from 'react'

const AnotherText = () => <p> Another beer </p>;

export default AnotherText;

// App.tsx
import React, { useState } from 'react';
import useLazy from 'uselazy';

const App = () => {
  const [cond, setCond] = useState(false);
  const { isLoading, result: Components } = useLazy({
    getModule: () => [import('./Text'), import('./AnotherText')],
    shouldImport: cond,
    onFynally: () => console.log('ахуититиьна')
  });

  return (
    <div>
      <h1>I'm very lazy </h1>
      <button onClick={() => setCond(!cond)}>
        Buy me lots of beers
      </button>

      {isLoading && <span>some spinner</span>}

      {Components && Components.map(Component => <Component />)}
    </div>
  );
};
```
### or other stuff rather than React components

``` jsx
// someUtils.ts
import React from 'react';

const someUtils = {
  byMoreBeers(cuantity: number): string {
    return `${cuantity} beers on the way ;)`
  },
}

export default someUtils;

// App.tsx
import React, { useState } from 'react';
import useLazy from 'uselazy';

const App = () => {
  const [cond, setCond] = useState(false);
  const { isLoading, result: utils } = useLazy({
    getModule: () => import('./someUtils'),
    shouldImport: cond,
  });

  return (
    <div>
      <button onClick={() => setCond(!cond)}>
        Buy me lots of beers
      </button>

      {utils && (
        <button onClick={() => utils.byMoreBeers(5)}>
          Buy me more beers for my friends!
        </button>
      )}

      {isLoading && <span>some spinner</span>}

    </div>
  );
};
```

## LICENSE

[MIT](LICENSE)
