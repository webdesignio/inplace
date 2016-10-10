import { update } from '@webdesignio/floorman/actions'
import {
  createValueSelector,
  isEditable
} from '@webdesignio/floorman/selectors'
import sanitize from 'sanitize-html'

export default class Inplace {
  constructor (props, el) {
    const { store } = props
    const propMapper = mapStateToProps()
    const staticProps = Object.assign(
      {},
      props,
      mapDispatchToProps(store.dispatch, props)
    )
    this.mapProps = props =>
      Object.assign(
        {},
        propMapper(props.store.getState(), props),
        staticProps
      )
    if (el) {
      this.render(staticProps, el)
      store.subscribe(() => this.render(staticProps, el))
      el.oninput = this.onInput.bind(this, staticProps)
    }
  }

  onInput (props, e) {
    const value = sanitize(e.target.innerHTML, { allowedTags: [] })
    props.onUpdate(value)
  }

  render (props, el) {
    const { value, isEditable } = this.mapProps(props)
    if (!el) return value
    const contenteditable = isEditable ? 'true' : 'false'
    if (el.getAttribute('contenteditable') !== contenteditable) {
      el.setAttribute('contenteditable', contenteditable)
    }
    if (el.innerHTML !== value) el.innerHTML = value
  }
}

function mapStateToProps () {
  const value = createValueSelector()
  return (state, { name, innerHTML }) => ({
    isEditable: isEditable(state),
    value: value(state, name) == null ? (innerHTML || '') : value(state, name)
  })
}

function mapDispatchToProps (dispatch, { name }) {
  return {
    onUpdate (value) {
      dispatch(update({ [name]: value }))
    }
  }
}
