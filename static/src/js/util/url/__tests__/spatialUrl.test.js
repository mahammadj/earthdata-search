import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes pointSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          spatial: {
            ...emptyDecodedResult.query.collection.spatial,
            point: '0,0'
          }
        }
      }
    }
    expect(decodeUrlParams('?sp=0%2C0')).toEqual(expectedResult)
  })

  test('decodes boundingBoxSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          spatial: {
            ...emptyDecodedResult.query.collection.spatial,
            boundingBox: '0,10,20,30'
          }
        }
      }
    }
    expect(decodeUrlParams('?sb=0%2C10%2C20%2C30')).toEqual(expectedResult)
  })

  test('decodes polygonSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          spatial: {
            ...emptyDecodedResult.query.collection.spatial,
            polygon: '-77,38,-77,38,-76,38,-77,38'
          }
        }
      }
    }
    expect(decodeUrlParams('?polygon=-77%2C38%2C-77%2C38%2C-76%2C38%2C-77%2C38')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('encodes pointSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      pointSearch: '0,0'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sp=0%2C0')
  })

  test('encodes boundingBoxSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      boundingBoxSearch: '0,10,20,30'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sb=0%2C10%2C20%2C30')
  })

  test('encodes polygonSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      polygonSearch: '-77,38,-77,38,-76,38,-77,38'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?polygon=-77%2C38%2C-77%2C38%2C-76%2C38%2C-77%2C38')
  })
})