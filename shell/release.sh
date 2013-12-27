cd ~/middleware;

branch="$(git symbolic-ref HEAD 2>/dev/null)" ||
branch="(unnamed branch)"
branch=${branch_name##refs/heads/}

while [[ -z "$merge" || -z "$tag" ]]; do
    clear;
    read -p "Branch: " merge;
    read -p "Tag: " tag;
    read -p "Is this information correct [Y/n]: " correct;

    if [ "$correct" == "n" ]; then
        merge=;
        tag=;
    fi
done

git checkout master;
git pull --rebase;
git merge $merge;
git tag $tag;
git push origin master;
git checkout $branch;
