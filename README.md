## DBM-BE

### Test Lambda
## products
```bash
lambda-local -l src/handler.js -h handler -e products-event.json --esm --envfile .lambda-env.json
```
## reviews
```bash
lambda-local -l src/reviewsHandler.js -h handler -e reviews-event.json --esm --envfile .lambda-env.json
```

### Run Tests
npm test

### Zip for deployment
#### Install only production dependencies
```bash
npm install --only=prod
```

#### Zip contents (exclude coverage, tests, etc.)
``` bash
./.lambdazip.sh
```
or
```bash
zip -r lambda.zip src node_modules package.json package-lock.json
```
