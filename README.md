Install After [base-init](https://github.com/Laborate/base-init)
------------------------------------------
**Run Installer Script**
```bash
cd ~; git clone -b node_migration git@github.com:Laborate/code.git; cd code; npm install;
```

**Start Tracking ```config.json```**
```bash
git update-index --no-assume-unchanged ~/code/config.json;
```
