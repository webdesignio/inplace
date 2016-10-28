import React, { Component } from 'react'
import connectToField from '@webdesignio/react/connectToField'
import sanitize from 'sanitize-html'
import ContentEditable from 'react-contenteditable'

class Inplace extends Component {
  constructor () {
    super()
    this.handlers = {
      onChange: this.onChange.bind(this)
    }
  }

  onChange (e) {
    const value = sanitize(e.target.value, { allowedTags: [] })
    this.props.onChange(value)
  }

  render () {
    const tagName = this.props.tagName || 'div'
    const className = this.props.className || undefined
    const id = this.props.id || undefined
    const value =
      this.props.value == null
        ? (this.props.children || this.props.innerHTML || '')
        : this.props.value
    if (this.props.isEditable) {
      return React.createElement(tagName, { className, id }, value)
    }
    return (
      <ContentEditable
        tagName={tagName}
        className={className}
        id={id}
        html={value}
        onChange={this.handlers.onChange}
      />
    )
  }
}

export default connectToField()(Inplace)
