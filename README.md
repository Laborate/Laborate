Install After [base-init](https://github.com/Laborate/base-init)
----------------------------------------------------------------
1. **Run Installer Script**

  ```bash
     cd ~; git clone -b node_migration git@github.com:Laborate/code.git; cd code; npm install;
   ```
2. Fill In ```config.json```
3. **Start Server**
   ```bash
      npm start
   ```

Start Tracking ```config.json```
------------------------------------
```bash
git update-index --no-assume-unchanged ~/code/config.json;
```
