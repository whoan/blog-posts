---
lastModified: '2019-11-05'
---

# GitHub's Workflows: Add support to cache when you build a docker image

A little late to the party, but you might still find useful [this action](https://github.com/whoan/docker-build-with-cache-action) I created to add support to cache when you use [GitHub's Workflows](https://help.github.com/en/github/automating-your-workflow-with-github-actions/configuring-a-workflow).

Why late? GitHub already released an [action to support cache](https://github.com/actions/cache) but it has its limitations. eg: you can cache 400MB at most.

I find my action really easy to use so I still encourage you to give it a try. Look at an example:

```yml
name: Blog

on: [push]

jobs:

  build:
    name: Build docker image and push it to registry
    runs-on: ubuntu-latest

    steps:

    - uses: actions/checkout@v1

    - uses: whoan/docker-build-with-cache-action@master
      with:
        username: "${{ secrets.DOCKER_USERNAME }}"
        password: "${{ secrets.DOCKER_PASSWORD }}"
        image_name: whoan/blog
```

All you need is permission to push images to an image repository (if you don't specify one with `registry`, the default is https://hub.docker.com) as the action `push`es the built image together with [the different stages you might have in your Dockerfile](https://docs.docker.com/develop/develop-images/multistage-build/) to the cloud so you can `pull` it the next time your workflow triggers.
