import * as Constants from 'lib/constants'
import * as documentActions from 'actions/documentActions'
import * as sortingActions from 'actions/sortingActions'
import {connectRedux} from 'lib/redux'
import Header from 'containers/Header/Header'
import React from 'react'
import SortableList from 'components/SortableList/SortableList'
import styles from './SortingView.css'
import tableListstyles from 'containers/DocumentTableList/DocumentTableList.css'
import {useEffect} from 'react'

function mapState(state, ownProps) {
  const {
    isSingleDocument,
    route: {params, search, searchString}
  } = ownProps

  const collection =
    params.collection === Constants.MEDIA_COLLECTION_SCHEMA.slug
      ? Constants.MEDIA_COLLECTION_SCHEMA
      : state.app.config.api.collections.find(collection => {
          return collection.slug === params.collection
        })

  const contentKey = `sort_${collection.slug}`

  return {
    collection,
    contentKey,
    state
  }
}

const DOCUMENTS_QUERY_LIMIT = 999

export const SortingView = connectRedux(
  mapState,
  documentActions,
  sortingActions
)(props => {
  const {collection, state, actions} = props

  const contentKey = `sorting_${collection.slug}`

  const documents = state.documents[contentKey]
  const items = (documents && documents.results) || []

  useEffect(() => {
    actions.fetchDocumentList({
      collection,
      contentKey,
      sortBy: 'order',
      limit: DOCUMENTS_QUERY_LIMIT
    })
  }, [])

  const valuesAsArray =
    (documents &&
      documents.results &&
      documents.results.map(({_id, name}) => ({_id, name}))) ||
    []

  return (
    <React.Fragment>
      <Header />
      <main>
        <h1 className={tableListstyles.title}>Sort {collection.name}</h1>
        <div className={tableListstyles['table-wrapper']}>
          <SortableList
            onChange={orderedItems =>
              handleChangeOrder({orderedItems, actions, collection})
            }
            valuesArray={valuesAsArray}
            showListOnly={true}
            containerClassname={styles['sortable-list-container']}
            itemRenderer={item => (
              <div style={{lineHeight: '40px'}}>{item.name}</div>
            )}
          />
        </div>
      </main>
    </React.Fragment>
  )
})

const handleChangeOrder = ({orderedItems, actions, collection}) => {
  actions.updateSorting({
    orderedItems: orderedItems.map(({_id}) => _id),
    actions,
    collection
  })

  console.log({actions})
}
