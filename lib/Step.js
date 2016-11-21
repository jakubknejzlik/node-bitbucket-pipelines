'use strict'

class Step {
   constructor(config) {
      if (!config.step) {
         throw new Error('Missing step attribute')
      }
      this.config = config
   }

   getImage() {
      return this.config.step.image
   }

   getScripts() {
      return this.config.step.script
   }
}

module.exports = Step