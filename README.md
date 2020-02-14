# uselazy

react hook for lazy load and code-split react components or whatever you want.

NOTE: useLazy now handles both dynamic and named imports.

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
  // This it whats takes useLazy:
  useLazy<T>(
    // array of functions that returns a promise from a dynamic import which
    // could be an object with a default import or named import
    // NOTE: please you should wrap this value inside of `useMemo`
    importFns: Array<() => Promise<{ default: T } | { [K: string]: T }>>,
    // this is were you decided when to execute the import
    shouldImport: boolean
  );
```

## Usage

### handles `default` import

```jsx
// Text.tsx
import React from 'react';

const Text = () => <p> Here's your beer </p>;

export default Text;

// App.tsx
import React, { useState, useMemo } from 'react';
import useLazy from 'uselazy';

const imports = [() => import('./Text')];

const App = () => {
  const [shouldImport, setShouldImport] = useState(false);
  const { isLoading, result } = useLazy(
    // Preserves identity of "imports" so it can be safely add as a dependency of useEffect
    // inside useLazy
    useMemo(() => imports, []),
    shouldImport,
  );

  const [TextComponent] = result;

  return (
    <div>
      <h1>I'm very lazy </h1>
      <button onClick={() => setShouldImport(!shouldImport)}>Buy me a beer</button>

      {isLoading && <span>some spinner</span>}

      {TextComponent && <TextComponent />}
    </div>
  );
};
```

### handles `named` imports

```jsx
// Bears.tsx
import React from 'react';

export const Bears = () => <p> Bears loves beers </p>;

// App.tsx
import React, { useState, useMemo } from 'react';
import useLazy from 'uselazy';

const namedImports = [() => import('./Bears')];

const App = () => {
  const [shouldImport, setShouldImport] = useState(false);
  const { isLoading, result } = useLazy(
    // Preserves identity of "namedImports" so it can be safely add as a dependency of useEffect
    // inside useLazy
    useMemo(() => namedImports, []),
    shouldImport,
  );

  const [BearsComponent] = result;

  return (
    <div>
      <h1>I'm very lazy </h1>
      <button onClick={() => setShouldImport(!shouldImport)}>Buy me a beer</button>

      {isLoading && <span>some spinner</span>}

      {BearsComponent && <BearsComponent />}
    </div>
  );
};
```

### Or you can handle both `default` and `named` imports

```jsx
// Text.tsx
import React from 'react';

const Text = () => <p> Here's your beer </p>;

export default Text;

// Bears.tsx
import React from 'react';

export const Bears = () => <p> Bears loves beers </p>;

// App.tsx
import React, { useState } from 'react';
import useLazy from 'uselazy';

const imports = [() => import('./Text'), () => import('./Bears')];

const App = () => {
  const [shouldImport, setShouldImport] = useState(false);
  const { isLoading, result: Components } = useLazy(
    // Preserves identity of "imports" so it can be safely add as a dependency of useEffect
    // inside useLazy
    useMemo(() => imports, []),
    shouldImport,
  );

  return (
    <div>
      <h1>I'm very lazy </h1>
      <button onClick={() => setShouldImport(!shouldImport)}>Buy me lots of beers</button>

      {isLoading && <span>some spinner</span>}

      {Components && Components.map(Component => <Component />)}
    </div>
  );
};
```

### Or other stuff rather than React components

```jsx
// someUtils.ts
import React from 'react';

const someUtils = {
  byMoreBeers(cuantity: number): string {
    return `${cuantity} beers on the way ;)`;
  },
};

export default someUtils;

// App.tsx
import React, { useState } from 'react';
import useLazy from 'uselazy';

const utilsImport = [() => import('./someUtils')];

const App = () => {
  const [shouldImport, setShouldImport] = useState(false);
  const { isLoading, result } = useLazy(
    // Preserves identity of "utilsImport" so it can be safely add as a dependency of useEffect
    // inside useLazy
    useMemo(() => utilsImport, []),
    shouldImport,
  );

  const [utils] = result;

  return (
    <div>
      <button onClick={() => setShouldImport(!shouldImport)}>Buy me lots of beers</button>

      {isLoading && <span>some spinner</span>}

      {utils && (
        <button onClick={() => utils.byMoreBeers(5)}>Buy me more beers for my friends!</button>
      )}
    </div>
  );
};
```

## NOTE

The reason why I'm encouraging to wrap the imports array with `useMemo` is because of useEffect's array of dependencies,
that triggers a re-render whatever they change, so if you DON'T wrap it, you'll get an infinite rerendering loop because,
each render the imports array is different. [] === [] // false.

so I giving the developer total control of this, he decides whether the array can change.

more details here: [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)

## LICENSE

[MIT](LICENSE)
