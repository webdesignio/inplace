import { update } from '@webdesignio/floorman/actions'
import {
  createValueSelector,
  isEditable
} from '@webdesignio/floorman/selectors'

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
    props.onUpdate(e.target.innerHTML)
  }

  render (props, el) {
    const { value, isEditable, innerHTML } = this.mapProps(props)
    const realValue = value || innerHTML || ''
    if (!el) return realValue
    const contenteditable = isEditable ? 'true' : 'false'
    if (el.getAttribute('contenteditable') !== contenteditable) {
      el.setAttribute('contenteditable', contenteditable)
    }
    if (el.innerHTML !== realValue) el.innerHTML = realValue
  }
}

function mapStateToProps () {
  const value = createValueSelector()
  return (state, { name }) => ({
    isEditable: isEditable(state),
    value: value(state, name) || ''
  })
}

function mapDispatchToProps (dispatch, { name }) {
  return {
    onUpdate (value) {
      dispatch(update({ [name]: value }))
    }
  }
}
