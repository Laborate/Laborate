Fresh Install On New Server
----------------------------
**Create SSH Keys And Add To Github**
```bash
cd ~/.ssh
ssh-keygen -t rsa -C "your_email@example.com"
cat ~/.ssh/id_rsa.pub
```

**Paste Oneliner in ```www``` Folder**
```bash
sudo apt-get -y install git; git clone git@github.com:bvallelunga/Codelaborate.git tmp; mv tmp/* tmp/.git* .; rm -R tmp/; sudo bash init.sh;
```

Control Locally
---------
**start node**
```bash
shell/local/start.sh
```

**stop node**
```bash
shell/local/start.sh
```


Control on Server
-----------
**start servers**
```bash
shell/server/start.sh
```

**stop servers**
```bash
shell/server/stop.sh
```
