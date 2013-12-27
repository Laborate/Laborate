cd ~/middleware;

branch=$(git symbolic-ref -q HEAD)
branch=${branch_name##refs/heads/}
branch=${branch_name:-HEAD}

while [[ -z "$from" || -z "$to" || -z "$tag" ]]; do
    clear;
    read -p "From Branch: " from;
    read -p "To Branch: " to;
    read -p "Tag: " tag;
    read -p "Is this information correct [Y/n]: " correct;

    if [ "$correct" == "n" ]; then
        from=;
        to=;
        tag=;
    fi
done

git checkout $to;
git pull --rebase origin/$to;
git merge $from;
git tag $tag;
git push origin master;
git checkout $branch;
