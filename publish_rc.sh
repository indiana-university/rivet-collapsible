#!/bin/bash

echo "Publishing from $CIRCLE_BRANCH" 

# Get the version number from the branch name.
# Ex: release/v1.2.3 => 1.2.3
[[ $CIRCLE_BRANCH =~ [0-9]+\.[0-9]+\.[0-9]+ ]]
VERSION=$BASH_REMATCH

# Update package.json with the latest version number
echo "Updating package.json version to $VERSION..."
npm version $VERSION —no-git-tag-version —no-commit-hooks
if [ $? -eq 0 ]; then
    echo "Package.json updated to version $VERSION. Commiting updated package.json..."
    git config credential.helper 'cache --timeout=120'
    git config user.email "iubot@iu.edu"
    git config user.name "iubot"
    git commit -m "Circle CI: update package.json version. [skip ci]"
    echo "Pushing updated package.json to origin..."
    # Push quietly to prevent showing the token in log
    git push -q https://${GH_TOKEN}@github.com/${CIRCLE_PROJECT_USERNAME}/${CIRCLE_PROJECT_REPONAME}.git $CIRCLE_BRANCH
else
    echo "Package.json was already at version $VERSION."
fi

# Get count of commits to the release/hotfix branch.
# This will be the "RC" number, e.g. RC.1
echo "Counting number of commits on branch: $COMMITS..."
COMMITS=$(git rev-list --count $CIRCLE_BRANCH 2>&1)
if [ $? -eq 0 ]; then
    echo "Counted $COMMITS commits."
else
    echo "Unable to count commits to branch. Using 0."
    COMMITS=0
fi

# Form the tag with the number of commits to this branch and publish the package.
TAG="rc.$COMMITS"
echo "Publishing package to NPM with tag '$TAG' ..."
npm publish --tag "$TAG"