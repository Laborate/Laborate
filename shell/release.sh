cd ~/middleware;

# Get Current Branch
branch=$(git symbolic-ref -q HEAD)
branch=${branch_name##refs/heads/}
branch=${branch_name:-HEAD}


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
git checkout $to;
git pull --rebase origin/$to;
git merge $from;

if [ ! -z "$tag" ]; then
    git tag $tag;
fi

git push origin $to;
git checkout $branch;
