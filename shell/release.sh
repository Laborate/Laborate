cd ~/middleware;

git checkout master;
git pull --rebase;
git merge $1;
git tag -s $2 -m 'Branch $1 signed by $USER';
git push origin master;
