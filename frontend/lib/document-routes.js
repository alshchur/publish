'use strict'

import * as Constants from 'lib/constants'
import {Format} from 'lib/util/string'

export class DocumentRoutes {
  constructor (props) {
    this.props = props
    this.matches = props.matches
    this.paths = props.paths
    this.path = props.path
    this.routes = this.siblingRoutes()

    return this
  }

  analysePart (part, pos) {
    return {
      isOptional: part.endsWith('?'),
      isVar: part.startsWith(':'),
      pos,
      varName: part
        .replace(':', '')
        .replace('?', '')
        .replace(/\[.*\]/g, '')
    }
  }

  authCollectionMatch (api) {
    return api.collections.find(collection => collection._isAuthCollection)
  }

  buildCollectionPath (group, collection) {
    const versionPath = collection.number ? `-${collection.number + 1}` : ''
    const groupPath = group ? `${group}/` : ''

    return `${groupPath}${collection.name}${versionPath}`
  }

  collectionMatch (api, collectionName) {
    return api.collections &&
      api.collections.find(collection => collection.slug === collectionName)
  }

  createRoute (values) {
    return this.renderRoute(this.routes.create, Object.assign({}, this.matches, values))
  }

  deepCollectionSearch (api, collection, referencedFields, collections = [], index = 0) {
    const collectionName = this.findField(collection.fields, referencedFields[index])

    if (collectionName === Constants.MEDIA_COLLECTION) {
      return collections.concat([Constants.MEDIA_COLLECTION])
    }

    const apiCollection = this.collectionMatch(api, collectionName)

    if (referencedFields.length - 1 === index) {
      return collections.concat([apiCollection])
    }

    return this.deepCollectionSearch(
      api,
      apiCollection,
      referencedFields,
      collections.concat([apiCollection]),
      index + 1
    )
  }

  editRoute (values) {
    return this.renderRoute(this.routes.edit, Object.assign({}, this.matches, values))
  }

  filterRoutes (path, pos) {
    return this.path === path ? {
      create: this.paths.create[pos],
      edit: this.paths.edit[pos],
      list: this.paths.list[pos]
    } : false
  }

  findField (fields, referencedField) {
    const field = Object.keys(fields)
      .find(key => key === referencedField)

    return fields[field].settings.collection
  }

  getAllCollections (apis) {
    const urlParts = this.props.url
      .replace(/^\/|\/$/g, '')
      .split('/')
    const parts = this.props.path
      .split('/')
      .map(this.analysePart)
    const referencedFieldsParams = parts
      .filter(part => part.isVar && part.varName === 'referencedField')
      .map(referencedField => urlParts[referencedField.pos])
    const collectionMatch = this.getCollectionMatch(this.props.collection)
    const groupName = this.props.group || null
    const api = this.getAPI(apis, collectionMatch, groupName)
    const collection = this.getCollection(api, collectionMatch.name)

    // Create collection paths based on routes
    collection.path = this.buildCollectionPath(groupName, collectionMatch)

    if (referencedFieldsParams.length) {
      return {
        children: this.deepCollectionSearch(api, collection, referencedFieldsParams),
        parent: collection
      }
    } else {
      return {
        parent: collection
      }
    }
  }

  getAPI (apis, collection, groupName) {
    const matches = apis
      .filter(api => this.menuMatch(api, groupName, collection))
      .filter(api => this.collectionMatch(api, collection.name))

    return matches[collection.number]
  }

  getCollection (api, collectionName) {
    if (!api) return

    if (collectionName === Constants.MEDIA_COLLECTION) {
      return Constants.MEDIA_COLLECTION
    }

    return this.collectionMatch(api, collectionName)
  }

  getCollectionMatch (collectionName) {
    const parts = collectionName.match(/(.*)-([0-9]+)/)
    const number = parts ? parseInt(parts[2]) - 1 : 0
    const name = parts ? parts[1] : collectionName

    return {
      name,
      number,
      original: collectionName
    }
  }

  getCurrentCollection (apis) {
    const collections = this.getAllCollections(apis)

    return collections.children ? collections.children.pop() : collections.parent
  }

  getParentCollection (apis) {
    const collections = this.getAllCollections(apis)
    const prev = collections.children && collections.children.length - 2

    return (collections.children && collections.children.length > 1) ?
      collections.children[prev] :
      collections.parent
  }

  renderRoute (route, values) {
    const pieces = route
      .split('/')

    return '/' + pieces
      .map(piece => {
        const {
          isVar,
          isOptional,
          varName
        } = this.analysePart(piece)

        if (isOptional && !values[varName]) return
        if (isVar) return values[varName]

        return piece
      })
      .filter(Boolean)
      .join('/')
  }

  menuMatch (api, group, collection) {
    // If there is no group specified
    // make sure the input API doesn't have a group containing the collection.
    const inGroup = (api.menu || [])
      .find(menuItem => menuItem.collections && menuItem.collections.includes(collection.name))

    if (!group) return !inGroup

    return api.menu
      .filter(menu => menu.title && Format.slugify(menu.title) === group)
  }

  siblingRoutes () {
    return Object.keys(this.paths)
      .map(key => this.paths[key]
        .map((path, pos) => this.filterRoutes(path, pos))
        .find(Boolean)
      ).find(Boolean)
  }

  get parts () {
    return this._parts
  }

  set parts (pathname) {
    this._parts = pathname
      .replace(/^\/|\/$/g, '')
      .split('/')
  }
}
