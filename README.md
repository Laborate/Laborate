Install After [base-init](https://github.com/Laborate/base-init)
------------------------------------------
**Paste Installer Script in ```www``` Folder**
```bash
cd /var/www/; git clone git@github.com:Laborate/code.git; sudo bash code/init/init.sh;
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
