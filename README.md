Install After [base-init](https://github.com/Laborate/base-init)
----------------------------------------------------------------

1. **Run Installer Script**

   ```bash
cd ~; git clone -b <branch> git@github.com:Laborate/middleware.git; bash code/shell/initialize.sh;
   ```

2. **Fill In** ```config.json``` **With Your Info**

    ```
profile name must be lowercase a-z with no spaces
    ```

Start Tracking ```config.json```
------------------------------------

```bash
git update-index --no-assume-unchanged ~/middleware/config.json;
```
