Fresh Install On New Server
----------------------------
**Create SSH Keys And Add To Github**
```bash
cd ~/.ssh
ssh-keygen -t rsa -C "your_email@example.com"
cat ~/.ssh/id_rsa.pub
```

**Paste Installer Script in ```www``` Folder**
```bash
sudo apt-get -y install git
git clone git@github.com:Laborate/code.git
cd code
sudo bash init/init.sh
```

Control Server
--------------
**Location: ```local``` or ```server```**
```bash
//start servers
shell/<location>/start.sh

//stop servers
shell/<location>/stop.sh

//sql update: content or structure (required)
shell/<location>/sql_update.sh <option>

//git stash and pull w/rebase
shell/<location>/git_pull.sh

//clear node logs
shell/<location>/clear_logs.sh

//server memory status
shell/server/memory.sh
```
