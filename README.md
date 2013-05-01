Install After [base-init](https://github.com/Laborate/base-init)
------------------------------------------
**Run Installer Script**
```bash
cd ~; git clone -b develop git@github.com:Laborate/code.git; bash code/init/init.sh;
```

**Enter Your MYSQL Password**
```bash
file: server/node/config.js, line 19
```

**Ask Administrator To Reload Apache**
```bash
service apache2 reload;
```
