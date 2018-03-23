# The Queue Utility

Priority based task scheduling for splitting up heavy work :muscle:

[![Build](https://img.shields.io/circleci/project/github/nx-js/queue-util/master.svg)](https://circleci.com/gh/nx-js/queue-util/tree/master) [![Coverage Status](https://coveralls.io/repos/github/nx-js/queue-util/badge.svg)](https://coveralls.io/github/nx-js/queue-util) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Package size](http://img.badgesize.io/https://unpkg.com/@nx-js/queue-util/dist/umd.es6.min.js?compression=gzip&label=minzip_size)](https://unpkg.com/@nx-js/queue-util/dist/umd.es6.min.js)  [![Version](https://img.shields.io/npm/v/@nx-js/queue-util.svg)](https://www.npmjs.com/package/@nx-js/queue-util) [![dependencies Status](https://david-dm.org/nx-js/queue-util/status.svg)](https://david-dm.org/nx-js/queue-util) [![License](https://img.shields.io/npm/l/@nx-js/queue-util.svg)](https://www.npmjs.com/package/@nx-js/queue-util)

<details>
<summary><strong>Table of Contents</strong></summary>
<!-- Do not edit the Table of Contents, instead regenerate with `npm run build-toc` -->

<!-- toc -->

* [Motivation](#motivation)
* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  + [queue = new Queue(priority)](#queue--new-queuepriority)
  + [priorities](#priorities)
  + [queue.add(fn)](#queueaddfn)
  + [queue.delete(fn)](#queuedeletefn)
  + [boolean = queue.has(fn)](#boolean--queuehasfn)
  + [queue.clear()](#queueclear)
  + [queue.process()](#queueprocess)
  + [queue.start()](#queuestart)
  + [queue.stop()](#queuestop)
  + [promise = queue.processing()](#promise--queueprocessing)
* [Alternative builds](#alternative-builds)
* [Contributing](#contributing)

<!-- tocstop -->

</details>

## Motivation

Deciding what code to execute next is not an easy decision. Users expect a lot to happen simultaneously - like networking, view updates and smooth animations. The Queue Utility automatically schedules your tasks by priorities, but also lets you control them manually - when the need arises.

## Installation

```
$ npm install @nx-js/queue-util
```

## Usage

Functions can added to queues, which execute them in an order based on their priority. Queues are created by passing a priority level to the `Queue` constructor.

```js
import { Queue, priorities } from '@nx-js/queue-util'

const queue = new Queue(priorities.LOW)
const criticalQueue = new Queue(priorities.CRITICAL)

// 'Hello World' will be logged when the process has some free time
queue.add(() => console.log('Hello World'))
// 'EMERGENCY!' will be logged ASAP (before 'Hello World')
criticalQueue.add(() => console.log('EMERGENCY!'))
```

## API

### queue = new Queue(priority)

Queue instances can be created with the `Queue` constructor. The constructor requires a single priority as argument.

### priorities

The following priorities are exported on the `priorities` object.

- `priorities.SYNC`: Tasks are executed right away synchronously.
- `priorities.CRITICAL`: Tasks are executed ASAP (always before the next repaint in the browser).
- `priorities.HIGH`: Tasks are executed when there is free time and no more pending critical tasks.
- `priorities.LOW`: Tasks are executed when there is free time and no more pending critical or high prio tasks.

### queue.add(fn)

Adds the passed function as a pending task to the queue. Adding the same task multiple times to a queue will only add it once.

### queue.delete(fn)

Deletes the passed function from the queue.

### boolean = queue.has(fn)

Returns a boolean, which indicates if the passed function is in the queue or not.

### queue.clear()

Clears every task from the queue without executing them.

### queue.process()

Executes every task in the queue, then clears the queue.

### queue.stop()

Stops the automatic task execution of the queue.

### queue.start()

Starts the - priority based - automatic task execution of the queue. The queue is automatically started after creation.

### promise = queue.processing()

Returns a promise, which resolves after all of the current tasks in the queue are executed. If the queue is empty, it resolves immediately.

## Alternative builds

This library detects if you use ES6 or commonJS modules and serve the right format to you. The exposed bundles are transpiled to ES5 to support common tools - like UglifyJS minifying. If you would like a finer control over the provided build, you can specify them in your imports.

- `@nx-js/queue-util/dist/es.es6.js` exposes an ES6 build with ES6 modules.
- `@nx-js/queue-util/dist/es.es5.js` exposes an ES5 build with ES6 modules.
- `@nx-js/queue-util/dist/cjs.es6.js` exposes an ES6 build with commonJS modules.
- `@nx-js/queue-util/dist/cjs.es5.js` exposes an ES5 build with commonJS modules.

If you use a bundler, set up an alias for `@nx-js/queue-util` to point to your desired build. You can learn how to do it with webpack [here](https://webpack.js.org/configuration/resolve/#resolve-alias) and with rollup [here](https://github.com/rollup/rollup-plugin-alias#usage).

## Contributing

Contributions are always welcomed! Just send a PR for fixes and doc updates and open issues for new features beforehand. Make sure that the tests and the linter pass and that the coverage remains high. Thanks!
