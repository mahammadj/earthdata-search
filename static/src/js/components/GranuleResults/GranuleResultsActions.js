import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import queryString from 'query-string'

import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import { stringify } from '../../util/url/url'

import Button from '../Button/Button'

import './GranuleResultsActions.scss'

const GranuleResultsActions = ({
  collectionId,
  granuleCount,
  isCollectionInProject,
  location,
  onAddProjectCollection,
  onRemoveCollectionFromProject
}) => {
  const addToProjectButton = (
    <Button
      className="granule-results-actions__proj-action granule-results-actions__proj-action--add"
      onClick={() => onAddProjectCollection(collectionId)}
      variant="link"
      bootstrapVariant="link"
      icon="plus-circle"
    >
      Add to project
    </Button>
  )
  const removeFromProjectButton = (
    <Button
      className="granule-results-actions__proj-action granule-results-actions__proj-action--remove"
      onClick={() => onRemoveCollectionFromProject(collectionId)}
      variant="link"
      bootstrapVariant="link"
      icon="times-circle"
    >
      Remove from project
    </Button>
  )

  const downloadAllButton = () => {
    const params = queryString.parse(location.search)
    let { p = '' } = params
    if (p.split('!').indexOf(collectionId) < 1) p = `${p}!${collectionId}`

    return (
      <Link
        className="granule-results-actions__download-all"
        onClick={() => onAddProjectCollection(collectionId)}
        to={{
          pathname: '/projects',
          search: stringify({
            ...params,
            p
          })
        }}
      >
        <Button
          className="granule-results-actions__download-all-button"
          badge={`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
          bootstrapVariant="success"
          icon="download"
          variant="full"
        >
          Download All
        </Button>
      </Link>
    )
  }

  // TODO: Implement maxOrderSizeReached login that currently exists in master

  const downloadButton = downloadAllButton()

  return (
    <div className="granule-results-actions">
      <div className="granule-results-actions__info">
        <span className="granule-results-actions__granule-count">
          <span className="granule-results-actions__granule-num">
            {`${commafy(granuleCount)} `}
          </span>
          {`${pluralize('Granule', granuleCount)}`}
        </span>
        {
          isCollectionInProject && removeFromProjectButton
        }
        {
          !isCollectionInProject && addToProjectButton
        }
      </div>
      {downloadButton}
    </div>
  )
}

GranuleResultsActions.defaultProps = {
  granuleCount: 0
}

GranuleResultsActions.propTypes = {
  collectionId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default GranuleResultsActions