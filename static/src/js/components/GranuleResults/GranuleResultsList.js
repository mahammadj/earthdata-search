import React from 'react'
import { PropTypes } from 'prop-types'
import AutoSizer from 'react-virtualized-auto-sizer'

import GranuleResultsListBody from './GranuleResultsListBody'

import './GranuleResultsList.scss'

/**
 * Renders GranuleResultsList.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - The collection ID.
 * @param {Array} props.excludedGranuleIds - List of excluded granule IDs.
 * @param {String} props.focusedGranule - The focused granule ID.
 * @param {Array} props.granules - List of formatted granule.
 * @param {Boolean} props.isCwic - Flag designating CWIC collections.
 * @param {Boolean} props.isCollectionInProject - Flag designating if the collection is in the project.
 * @param {Function} props.isGranuleInProject - Function to detirmine if the granule is in the project.
 * @param {Function} props.isItemLoaded - Callback to detirmine if a granule has been loaded.
 * @param {Number} props.itemCount - Number of total granule list itmes.
 * @param {Function} props.loadMoreItems - Callback to load more granules.
 * @param {Object} props.location - The location provided by react-router.
 * @param {Function} props.onAddGranuleToProjectCollection - Callback to add a granule to the project.
 * @param {Function} props.onExcludeGranule - Callback to exclude a granule.
 * @param {Function} props.onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} props.onMetricsDataAccess - Callback to record data access metrics.
 * @param {Function} props.onRemoveGranuleFromProjectCollection - Callback to remove a granule to the project.
 * @param {Object} props.portal - Portal object passed from the store.
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the visible middle index.
 * @param {Number} props.visibleMiddleIndex - The current visible middle index.
 */
export const GranuleResultsList = ({
  collectionId,
  excludedGranuleIds,
  focusedGranule,
  granules,
  isCwic,
  isCollectionInProject,
  isGranuleInProject,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  location,
  onAddGranuleToProjectCollection,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  onRemoveGranuleFromProjectCollection,
  portal,
  setVisibleMiddleIndex,
  visibleMiddleIndex
}) => (
  <div className="granule-results-list">
    <AutoSizer style={{ position: 'relative', height: '100%', width: '100%' }}>
      {
        ({ height, width }) => (
          <GranuleResultsListBody
            collectionId={collectionId}
            excludedGranuleIds={excludedGranuleIds}
            focusedGranule={focusedGranule}
            granules={granules}
            height={height}
            isCwic={isCwic}
            isCollectionInProject={isCollectionInProject}
            isGranuleInProject={isGranuleInProject}
            location={location}
            onExcludeGranule={onExcludeGranule}
            onFocusedGranuleChange={onFocusedGranuleChange}
            onMetricsDataAccess={onMetricsDataAccess}
            onAddGranuleToProjectCollection={onAddGranuleToProjectCollection}
            onRemoveGranuleFromProjectCollection={onRemoveGranuleFromProjectCollection}
            portal={portal}
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMoreItems}
            setVisibleMiddleIndex={setVisibleMiddleIndex}
            visibleMiddleIndex={visibleMiddleIndex}
            width={width}
          />
        )
      }
    </AutoSizer>
  </div>
)

GranuleResultsList.defaultProps = {
  setVisibleMiddleIndex: null,
  visibleMiddleIndex: null
}

GranuleResultsList.propTypes = {
  collectionId: PropTypes.string.isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  isCwic: PropTypes.bool.isRequired,
  isGranuleInProject: PropTypes.func.isRequired,
  isItemLoaded: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddGranuleToProjectCollection: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number
}

export default GranuleResultsList
