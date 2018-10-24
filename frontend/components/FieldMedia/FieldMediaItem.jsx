'use strict'

import {h, Component} from 'preact'
import proptypes from 'proptypes'
import Style from 'lib/Style'
import styles from './FieldMedia.css'

export default class FieldMediaItem extends Component { 
  static propTypes = {
    /**
     * A subset of the app config containing data specific to this field type.
     */
    config: proptypes.object,

    /**
     * The field value.
     */
    value: proptypes.bool
  }

  constructor(props) {
    super(props)
  }

  getSource () {
    const {config, isList, value} = this.props
    const cdn = config ? config.cdn : null

    if (!value) return null

    const styleFile = new Style(styles, 'file')
      .addIf('file-list', isList)

    // Get the image path if applicable
    if (value.mimetype && value.mimetype.indexOf('image') > -1) {
      let src = ''

      if (value._previewData) {
        src = value._previewData
      } else if (value.path) {
        if (cdn && cdn.publicUrl) {
          src = `${cdn.publicUrl}/${value.path}?width=80`
        } else {
          src = value.path
        }
      } else if (value.url) {
        src = value.url
      }

      return (
        <div class={styles.image}>
          <img src={src} />
        </div>
      )
    } else {
      return (
        <div class={styleFile.getClasses()}>
          <img src="/public/images/icon-file.svg" width="25" />
          <span class={styles.ext}>{value.fileName.split('.').pop()}</span>
        </div>
      )
    }
  }

  render() {
    return this.getSource()
  }
}