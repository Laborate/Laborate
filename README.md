Set Up Server For Defaults
-----------------------------
```bash
git config --global color.ui auto
git config --global core.editor "vim"
export VISUAL=vim
export EDITOR=vim
```


Clone To Existing Directory
-----------------------------
```bash
git clone git@github.com:bvallelunga/Codelaborate.git tmp; mv tmp/* tmp/.git* .; rm -R tmp/
```


Locally
---------
**start node**
```bash
shell/local/start.sh
```

**stop node**
```bash
shell/local/start.sh
```


Server
-----------
**start server**
```bash
shell/server/start.sh
```

**stop server**
```bash
shell/server/stop.sh
```
