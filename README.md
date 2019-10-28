# uselazy

react hook for lazy load and code-split react components for further use.

NOTE: at the moment this ONLY support dynamic imports where's a default export.

named exports will be handle soon.

<br />

[![GitHub version](https://badge.fury.io/gh/aneurysmjs%2Fuselazy.svg)](https://badge.fury.io/gh/aneurysmjs%2Fuselazy) [![npm version](https://badge.fury.io/js/react.svg)](https://badge.fury.io/js/react) [![Build Status](https://travis-ci.org/aneurysmjs/uselazy.png?branch=master)](https://travis-ci.org/aneurysmjs/uselazy) ![Eclipse Marketplace](https://img.shields.io/eclipse-marketplace/last-update/uselazy.svg) ![GitHub last commit](https://img.shields.io/github/last-commit/aneurysmjs/uselazy.svg) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/aneurysmjs/uselazy.svg) ![GitHub issues](https://img.shields.io/github/issues/aneurysmjs/uselazy.svg)

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
type useLazy<P> = (
  // function that returns a promise from a dynamic import
  getModule: () => Promise<{ default: () => P }>, 
  // this is were you decided when to execute the import
  condition: boolean, 
  // (OPTIONAL) do something after all has been loaded
  onFynally?: () => void, 
) => P | null
```
## Usage

``` javascript
// Text.tsx
import React from 'react'

const Text = () => <p> Here's your beer </p>;

export default Text;

// App.tsx
import React, { useState } from 'react';
import useLazy from 'uselazy';

const App = () => {
  const [cond, setCond] = useState(false);
  const SomeComponent = useLazy(
    () => import('./Text'),
    cond,
    () => console.log('ахуититиьна')
  );

  return (
    <div>
      <h1>I'm very lazy </h1>
      <button onClick={() => setCond(!cond)}>
        Buy me a beer 
      </button>

      {/* at first the condition is false */}
      {SomeComponent && <SomeComponent />}
    </div>
  );
};
```

## LICENSE

[MIT](LICENSE)
