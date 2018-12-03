'use strict'

const path = require('path')

const base = path.join(__dirname, '/../')
const lib = path.join(__dirname, '/lib')
const frontend = path.join(__dirname, '/../frontend')
/**
 * Set Global parameters
 */

const Globals = function () {
  global.paths = global.paths || {
    base,
    config: path.resolve(`${__dirname}/config`),
    configDir: path.resolve(`${process.env.PWD}/config`),
    lib: {
      helpers: path.resolve(`${lib}/helpers`),
      models: path.resolve(`${lib}/models`),
      router: path.resolve(`${lib}/router`),
      root: lib,
      server: path.resolve(`${lib}/server`),
      watch: path.resolve(`${lib}/watch`)
    },
    frontend: {
      root: frontend,
      components: path.resolve(`${frontend}/components`)
    },
    wallet: path.resolve(`${base}/.wallet`)
  }
}

/**
 * Set
 * @param {Object} newParams New parameters to be appended to global.paths.
 */
Globals.prototype.set = function (paths) {
  if (typeof paths !== 'object') throw new Error('Paths must be an Object.')
  global.paths = Object.assign(global.paths, paths)
}

// exports
module.exports = function () {
  return new Globals()
}

module.exports.Globals = new Globals()
