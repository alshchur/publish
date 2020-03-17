import 'unfetch/polyfill'
import * as Types from 'actions/actionTypes'
import apiBridgeClient, {apiBridgeFetch} from 'lib/api-bridge-client'

const CACHE_TTL = 5000

const requestEndpoint = ({api, accessToken, method, endpoint, body}) => {
  const {host, port} = api

  return apiBridgeFetch({
    uri: {
      href: `${host}:${port}/1.0/${endpoint}`
    },
    body,
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
}

export function updateSorting({collection, orderedItems, contentKey}) {
  return (dispatch, getState) => {
    const {api} = getState().app.config
    const {accessToken} = getState().user

    requestEndpoint({
      api,
      accessToken,
      endpoint: 'updatesorting',
      method: 'POST',
      body: {
        collection: 'authors',
        field: 'order',
        ids: orderedItems
      }
    })
      .then(res => {
        console.log({res})
      })
      .catch(err => console.log({err}))

    /*.then( res => {
    console.log("updateSorting res", {res})
  }).catch(err => {
    console.err("error on updatesorting", {err})
  })
    .find()*/
    /*
    apiBridgeFetch({
      uri: {
        href:
      }
    }).then( res => {
      console.log("updateSorting res", {res})
    }).catch(err => {
      console.err("error on updatesorting", {err})
    })*/
  }
}
