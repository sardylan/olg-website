---
description: Setup Node.js environment
---

To run any Node.js or npm commands, you must first set up the environment:

1. Source the nvm script:
   ```bash
   source /lbin/enable-nvm
   ```

2. Use the correct Node.js version (check .nvmrc):
   ```bash
   nvm use
   ```
   Or explicitly:
   ```bash
   nvm use v24.11.1
   ```

Example of running a command:
```bash
source /lbin/enable-nvm && nvm use && npm run build-only
```
