#!/bin/bash

echo "Publishing from $CIRCLE_BRANCH" 
HASH="${CIRCLE_SHA1:(-7)}"

if [ $CIRCLE_BRANCH = "master" ]
then
    echo "We're on master.  Npm publish  (no special tag--only from package.json)"
    # npm publish
elif [ $CIRCLE_BRANCH = "develop" ]
then
    TAG="dev.$HASH"
    echo "Develop. Npm publish ($TAG)"
    # npm publish --tag "$TAG"
elif [[ $CIRCLE_BRANCH = feature* ]]
then
    TAG="feature.$HASH"
    echo "Feature. Npm publish ($TAG)"
    # npm publish --tag "$TAG"
elif [[ $CIRCLE_BRANCH = bugfix* ]]
then
    TAG="bug.$HASH"
    echo "Bugfix. Npm publish ($TAG)"
    npm publish --tag "$TAG"
else
    [[ $CIRCLE_BRANCH =~ [0-9]+\.[0-9]+\.[0-9]+ ]]
    VERSION=$BASH_REMATCH
    TAG="$VERSION-RC.$HASH"
    echo "Hotfix! Release! ($TAG)"
   # npm publish --tag "$TAG"
fi