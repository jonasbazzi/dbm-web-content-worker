## DBM-BE

### Test local
lambda-local -l src/handler.js -h handler -e event.json --esm

### Zip for deployment
#### Install only production dependencies
```bash
npm install --only=prod
```

#### Zip contents (exclude coverage, tests, etc.)
```bash
zip -r lambda.zip src node_modules package.json package-lock.json
```

