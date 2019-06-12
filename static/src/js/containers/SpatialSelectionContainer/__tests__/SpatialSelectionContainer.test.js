import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { SpatialSelectionContainer } from '../SpatialSelectionContainer'
import SpatialSelection from '../../../components/SpatialSelection/SpatialSelection'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    boundingBoxSearch: 'Test value',
    onChangeMap: jest.fn(),
    onChangeQuery: jest.fn(),
    pathname: '/search',
    pointSearch: 'Test value',
    polygonSearch: 'Test value'
  }

  const enzymeWrapper = shallow(<SpatialSelectionContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SpatialSelectionContainer component', () => {
  test('passes its props and renders a single SpatialSelection component', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(SpatialSelection).length).toBe(1)
    expect(enzymeWrapper.find(SpatialSelection).props().boundingBoxSearch).toEqual('Test value')
    expect(enzymeWrapper.find(SpatialSelection).props().isProjectPage).toEqual(false)
    expect(enzymeWrapper.find(SpatialSelection).props().pointSearch).toEqual('Test value')
    expect(enzymeWrapper.find(SpatialSelection).props().polygonSearch).toEqual('Test value')
    expect(typeof enzymeWrapper.find(SpatialSelection).props().onChangeMap).toEqual('function')
    expect(typeof enzymeWrapper.find(SpatialSelection).props().onChangeQuery).toEqual('function')
  })
})