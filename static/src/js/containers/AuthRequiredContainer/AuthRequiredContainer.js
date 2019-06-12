import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'tiny-cookie'

import { getEarthdataConfig } from '../../../../../sharedUtils/config'

export const AuthRequiredContainer = (props) => {
  const {
    children
  } = props
  const token = get('authToken')

  const returnPath = window.location.href

  if (token === null) {
    window.location.href = `${getEarthdataConfig('prod').apiHost}/login?cmr_env=${'prod'}&state=${encodeURIComponent(returnPath)}`
    return null
  }

  return (
    <>
      { children }
    </>
  )
}

AuthRequiredContainer.propTypes = {
  children: PropTypes.node.isRequired
}

export default AuthRequiredContainer