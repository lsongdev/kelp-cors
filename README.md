# kelp-cors

[Cross-Origin Resource Sharing(CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) Middleware for [Kelp Project](https://github.com/kelpjs).

## Installation

```bash
$ npm i kelp-cors --save
```

## Example

```js
const http = require('http');
const kelp = require('kelp');
const cors = require('kelp-cors');

const app = kelp();

app.use(cors({
  allowOrigin: 'baidu.com',
  allowMethods: ['POST', 'GET'],
  allowHeaders: ['X-MY-HEADER', 'X-Y-HEADER'],
  exposeHeaders: ['X-MY-HEADER'],
  maxAge: 3600,
  allowCredentials: true,
}));

app.use((req, res) => {
  res.end("hello world");
});

http.createServer(app).listen(3000);
```

Also accept function as options:

```js
app.use(cors(({ preflight }) => {
  console.log('preflight:', preflight);
  return { alloworigin: '*', allowcredentials: false };
}));
```

## Contributing

+ Fork this Repo first
+ Clone your Repo
+ Install dependencies by $ npm install
+ Checkout a feature branch
+ Feel free to add your features
+ Make sure your features are fully tested
+ Publish your local branch, Open a pull request
+ Enjoy hacking <3


## MIT license

Copyright (c) 2016 Lsong <song940@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.