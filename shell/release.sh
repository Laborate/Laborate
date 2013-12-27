cd ~/middleware;

BRANCH = "$(git symbolic-ref --short HEAD)";
git checkout master;
git pull --rebase;
git merge $1;
git tag -s $2 -m 'Branch $1 signed by $USER';
git push origin master;
git checkout $BRANCH;
