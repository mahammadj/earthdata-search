import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { portalPath } from '../../../../../sharedUtils/portalPath'

const mapStateToProps = state => ({
  portal: state.portal
})

export const PortalLinkContainer = (props) => {
  const {
    children,
    className,
    dataTestId,
    onClick,
    portal,
    to,
    type,
    target
  } = props

  const portalPrefix = portalPath(portal)
  let newTo = to

  if (portalPrefix.length > 0) {
    if (typeof to === 'object') {
      const { pathname } = to
      const portalPath = `${portalPrefix}${pathname}`

      newTo = {
        ...to,
        pathname: portalPath
      }
    }

    if (typeof to === 'string') {
      newTo = `${portalPrefix}${to}`
    }
  }

  if (type === 'button') {
    // https://stackoverflow.com/questions/42463263/wrapping-a-react-router-link-in-an-html-button#answer-49439893
    const {
      dispatch,
      history,
      location,
      to,
      match,
      portal,
      staticContext,
      target,
      onClick,
      ...rest
    } = props

    return (
      <Button
        type="button"
        {...rest}
        onClick={(event) => {
          if (onClick) onClick(event)
          history.push(newTo)
        }}
      />
    )
  }

  return (
    <Link
      className={className}
      data-test-id={dataTestId}
      type={type}
      to={newTo}
      onClick={onClick}
      target={target}
    >
      {children}
    </Link>
  )
}

PortalLinkContainer.defaultProps = {
  children: null,
  className: '',
  dataTestId: null,
  onClick: null,
  portal: {},
  staticContext: null,
  type: '',
  target: '',
  to: ''
}

PortalLinkContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  staticContext: PropTypes.shape({}),
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  portal: PropTypes.shape({}),
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({})
  ]),
  type: PropTypes.string,
  target: PropTypes.string,
  dataTestId: PropTypes.string
}

export default withRouter(
  connect(mapStateToProps)(PortalLinkContainer)
)
