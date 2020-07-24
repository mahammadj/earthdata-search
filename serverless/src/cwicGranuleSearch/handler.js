import request from 'request-promise'
import { parse as parseXml } from 'fast-xml-parser'
import { pick } from '../util/pick'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { prepareExposeHeaders } from '../util/cmr/prepareExposeHeaders'
import { parseError } from '../../../sharedUtils/parseError'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Get the URL that will be used to retrieve granules from OpenSearch
 * @param {String} collectionId The collection ID to retrieve the url for.
 * @return {Object} An object representing the OpenSearch OSDD or an error message
 */
const getCwicGranulesUrl = async (collectionId) => {
  const collectionTemplate = `https://cwic.wgiss.ceos.org/opensearch/datasets/${collectionId}/osdd.xml?clientId=eed-edsc-dev`

  console.log(`OpenSearch OSDD: ${collectionTemplate}`)

  try {
    const osddResponse = await request.get({
      time: true,
      uri: collectionTemplate,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().lambda
      }
    })

    console.log(`Request for granules URL for CWIC collection '${collectionId}' successfully completed in ${osddResponse.elapsedTime} ms`)

    const osddBody = parseXml(osddResponse.body, {
      ignoreAttributes: false,
      attributeNamePrefix: ''
    })

    const { OpenSearchDescription: opensearchDescription = {} } = osddBody
    const { Url: granuleUrls = [] } = opensearchDescription

    return {
      statusCode: osddResponse.statusCode,
      body: granuleUrls.find(url => url.type === 'application/atom+xml')
    }
  } catch (e) {
    return parseError(e)
  }
}

/**
 * Replaces all valid keys from the users request within the granule url template provided by OpenSearch
 * @param {String} template - An OpenSearch string template representing the URL to retreive granules with.
 * @param {Object} params - The parameters from the users request to supply to the template.
 * @return {String} A formatted URL with the users request parameters inserted
 */
const renderOpenSearchTemplate = (template, params) => {
  // Ampersands in the URL throw off OpenSearch
  let renderedTemplate = template.replace(/&amp;/g, '&')

  let pageSize = 20
  if (params.page_size) {
    pageSize = params.page_size
  }
  renderedTemplate = renderedTemplate.replace(/{count\??}/, pageSize)

  if (params.page_num) {
    const startIndex = ((params.page_num * pageSize) + 1)
    renderedTemplate = renderedTemplate.replace(/{startIndex\??}/, startIndex)
  }

  if (params.bounding_box) {
    renderedTemplate = renderedTemplate.replace(/{geo:box}/, params.bounding_box)
  }

  if (params.point) {
    // OpenSearch doesn't support point search so to add that functionality to
    // to our app we use the point and make a tiny bounding box around the point
    const [lon, lat] = params.point.split(',')
    const epsilon = 0.001

    const boundingBoxFromPoint = [
      lon - epsilon,
      lat - epsilon,
      lon + epsilon,
      lat + epsilon
    ].join(',')

    renderedTemplate = renderedTemplate.replace(/{geo:box}/, boundingBoxFromPoint)
  }

  if (params.temporal) {
    const [timeStart, timeEnd] = params.temporal.split(',')

    renderedTemplate = renderedTemplate.replace(/{time:start}/, timeStart.replace(/\.\d{3}Z$/, 'Z'))
    renderedTemplate = renderedTemplate.replace(/{time:end}/, timeEnd.replace(/\.\d{3}Z$/, 'Z'))
  }

  // Remove any empty params from the template
  return renderedTemplate.replace(/[?&][^=]*=\{[^}]*\}/g, '')
}

/**
 * Retrieve granules from CWIC
 * @param {Object} event Details about the HTTP request that it received
 */
const cwicGranuleSearch = async (event) => {
  // The headers we'll send back regardless of our response
  const { defaultResponseHeaders } = getApplicationConfig()
  const responseHeaders = {
    ...defaultResponseHeaders,
    'Content-Type': 'application/xml'
  }

  const { body } = event
  const { params } = JSON.parse(body)

  // Whitelist parameters supplied by the request
  const permittedCmrKeys = [
    'boundingBox',
    'echoCollectionId',
    'pageNum',
    'pageSize',
    'point',
    'temporal'
  ]

  console.log(`Parameters received: ${Object.keys(params)}`)

  const obj = pick(params, permittedCmrKeys)

  console.log(`Filtered parameters: ${Object.keys(obj)}`)

  const conceptUrl = await getCwicGranulesUrl(obj.echoCollectionId)

  console.log(`Completed OSDD request with status ${conceptUrl.statusCode}.`)

  if (conceptUrl.statusCode !== 200) {
    return {
      isBase64Encoded: false,
      statusCode: conceptUrl.statusCode,
      headers: responseHeaders,
      body: conceptUrl.body
    }
  }

  const { template } = conceptUrl.body

  const renderedTemplate = renderOpenSearchTemplate(template, obj)

  console.log(`CWIC Granule Query: ${renderedTemplate}`)

  try {
    const granuleResponse = await request.get({
      time: true,
      uri: renderedTemplate,
      resolveWithFullResponse: true,
      headers: {
        'Client-Id': getClientId().lambda
      }
    })

    console.log(`CWIC Granule Request took ${granuleResponse.elapsedTime} ms`)

    return {
      isBase64Encoded: false,
      statusCode: granuleResponse.statusCode,
      headers: {
        ...responseHeaders,
        'access-control-expose-headers': prepareExposeHeaders(responseHeaders)
      },
      body: granuleResponse.body
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default cwicGranuleSearch
