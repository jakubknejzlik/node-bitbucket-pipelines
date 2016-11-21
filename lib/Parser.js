'use strict'

const fs = require('fs')
const yaml = require('js-yaml')

const Step = require('./Step')

class Parser {

   constructor(pipelinePath) {
      this.config = yaml.safeLoad(fs.readFileSync(pipelinePath))

      this.pipelines = {
         default: this.parseSteps(this.config.pipelines.default),
         branches: this.parseReference(this.config.pipelines.branches),
         tags: this.parseReference(this.config.pipelines.tags),
         bookmarks: this.parseReference(this.config.pipelines.bookmarks)
      }

   }

   parseReference(subconfig) {
      if (!subconfig) return {}
      let obj = {}
      for (let key in subconfig) {
         obj[key] = this.parseSteps(subconfig[key])
      }
      return obj
   }

   parseSteps(subconfig) {
      if(!subconfig)return []
      return subconfig.map((stepConfig) => {
         return new Step(stepConfig)
      })
   }

   getDefaultImage(branch) {
      return this.config.image
   }

   getSteps(reference) {
      if (!reference || reference === 'default') {
         return this.pipelines.default
      }
      return this.pipelines.branches[reference] || this.pipelines.tags[reference] || this.pipelines.bookmarks[reference] || []
   }
}

module.exports = Parser