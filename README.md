## DBM-WEB-CONTENT-WORKER

### Test Worker
```bash
npx wrangler dev worker-content-renewal/src/index.js
```

### Run Tests
``` bash
npm test
```

### Add secrets in prod
```bash
wrangler secret put MY_ENV_SECRET
```

### Deploy

#### Login
```bash
wrangler login
```

#### Deploy
```bash
cd worker-content-renewal
npm install --only=prod
npx wrangler deploy
```
