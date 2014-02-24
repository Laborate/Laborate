cd ~/middleware;

# Get Current Branch
branch=$(git symbolic-ref -q HEAD)
branch=${branch##refs/heads/}
branch=${branch:-HEAD}

# Get Release Info
while [[ -z "$from" || -z "$to" ]]; do
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

# Create Release
git checkout .;
git checkout $to;
git checkout .;
git pull --rebase;
git merge $from;
git push origin $to;

if [ ! -z "$tag" ]; then
    git tag $tag;
    git push origin $to --tags;
fi

git checkout .;
git checkout $branch;
