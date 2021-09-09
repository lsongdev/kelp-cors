const http = require('http');
const kelp = require('kelp');
const cors = require('..');

const app = kelp();

app.use(cors({
  allowOrigin: 'baidu.com',
  allowMethods: ['POST', 'GET'],
  allowHeaders: ['X-MY-HEADER', 'X-Y-HEADER'],
  exposeHeaders: ['X-MY-HEADER'],
  maxAge: 3600,
  allowCredentials: true,
}));

// app.use(cors(({ preflight }) => {
//     console.log('preflight:', preflight);
//     return { allowOrigin: '*', allowCredentials: false };
// }));

app.use((req, res) => {
  res.end("hello world");
});

http.createServer(app).listen(3000);