#!/usr/bin/env node

'use strict'

const path = require('path')
const program = require('commander')
const Parser = require('./lib/Parser')
const spawnSync = require('child_process').spawnSync
const execSync = require('child_process').execSync
const uuid = require('uuid')

program
   .version(require('./package.json').version)
   .option('-d, --docker','Run in docker container')

program
   .usage('run [reference]')
   .command('run [reference]')
   .description('run pipeline commands for specific reference (branch, tag, bookmark). If branch is not specified, default pipeline is used')
   .option('-i, --input <file>','Input yaml file with pipelines definition','bitbucket-pipelines.yml')
   .option('-r, --root <root>','Root directory','./')
   .option('-s, --silent','Doesn\'t print steps/scripts information, just output of each step')
   .action((reference, options) => {

      let log = options.silent ? ()=>{} : console.log

      let config = null
      try {
         config = new Parser(options.input)
      } catch(e) {
         console.error('Could not parse yaml file ' + options.input,e.message)
         process.exit(1)
      }

      let steps = config.getSteps(reference)
      for (let index in steps) {
         let step = steps[index]
         let scripts = '(' + step.getScripts().join(') && (') + ')'
         let image = step.getImage() || config.getDefaultImage()

         if (!image) {
            console.error('No image specified')
            process.exit(1)
         }
         log('Running step ' + (parseInt(index) + 1) + '/' + steps.length)

         let containerUID = uuid.v4()

         log('Running script in container:',containerUID,'image:',image)
         let args = ['run','-i','--name=' + containerUID,'--volume=' + path.resolve(options.root) + ':/app','--workdir=/app','--memory=4g','--memory-swap=4g',image,'/bin/bash','-c',scripts]
         spawnSync('docker',args,{
            env:process.env,
            stdio:[0,1,2]
         })

         log('Removing container:',containerUID)
         execSync(`docker rm ${containerUID}`)
      }
   })

program.parse(process.argv)


