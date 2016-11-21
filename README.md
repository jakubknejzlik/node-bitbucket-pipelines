# bitbucket-pipelines

CLI tool for parse bitbucket pipelines config file and run steps in docker.

# Example
 
Firstly install package via npm.
 
```npm install --save bitbucket-pipelines```

Create (or use your existing) bitbucket-pipelines.yml file

```
image: ubuntu
pipelines:
  branches:
    master:
      - step:
          script:
            - node --version # just an example
            - npm test # assuming you have test script defined in package.json
```

Create custom script in package.json

```
"scripts":{
    "bitbucket-pipelines":"pipelines run master"
}
```

Or run it directly

```./node_modules/.bin/pipelines run master```

## Global usage

You can of course use this module globally

```
npm install -g bitbucket-pipelines

// then you can run in your project's root directly
pipelines run master
```

