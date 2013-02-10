Set Up Server For Default
-------------------------
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

PHP Github Wrapper Requirements
--------------------------------
The new version of `php-github-api` using [Composer](http://getcomposer.org).
The first step to use `php-github-api` is to download composer:

```bash
$ curl -s http://getcomposer.org/installer | php
```

Then we have to install our dependencies using:
```bash
$ php composer.phar install
```
Now we can use autoloader from Composer by:

```yaml
{
    "require": {
        "knplabs/github-api": "*"
    },
    "minimum-stability": "dev"
}
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
**start servers**
```bash
shell/server/start.sh
```

**stop servers**
```bash
shell/server/stop.sh
```