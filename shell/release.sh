cd ~/middleware;

BRANCH = "$(git symbolic-ref --short HEAD)";
git checkout master;
git pull --rebase;
git merge $1;
git tag $2;
git push origin master;
git checkout $BRANCH;
