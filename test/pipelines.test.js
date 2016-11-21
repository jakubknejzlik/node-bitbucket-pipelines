'use strict'

const assert = require('assert')
const path = require('path')
const execSync = require('child_process').execSync
const bin = path.join(__dirname, '../pipelines.js')
const rootDir = path.join(__dirname, '../')

describe('pipelines',() => {
   it('should run version', () => {
      let result = execSync(`${bin} --version -r ${rootDir}`).toString()
      assert.equal(result,require('../package.json').version + "\n")
   })

   it('should run default', () => {
      let pipelineFile = path.join(__dirname,'fixtures/default.yaml')
      let result = execSync(`${bin} run -s -i ${pipelineFile}`).toString()
      assert.equal(result, "Hello world\nThis is just test\n/app\n")
   })

   it('should run references', () => {
      let pipelineFile = path.join(__dirname,'fixtures/references.yaml')
      
      let references = ['default','master','develop','1.0.0']

      references.forEach((reference) => {
         let result = execSync(`${bin} run ${reference} -s -i ${pipelineFile}`).toString()
         assert.equal(result, "Hello " + reference + "\n")
      })
   }).timeout(10000)
})