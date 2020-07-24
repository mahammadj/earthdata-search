import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import * as config from '../../../../../../sharedUtils/config'

import { FooterContainer } from '../FooterContainer'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps = {}) {
  const props = {
    loadTime: 2.2,
    location: {
      pathname: '/search'
    },
    portal: {
      footer: {
        attributionText: 'Mock text',
        displayVersion: true,
        primaryLinks: [{
          href: 'http://primary.example.com',
          title: 'Primary Example'
        }],
        secondaryLinks: [{
          href: 'http://secondary.example.com',
          title: 'Secondary Example'
        }]
      }
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<FooterContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('FooterContainer component', () => {
  test('displays version', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'prod',
      version: '2.0.0'
    }))

    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.footer__ver-pill').length).toEqual(1)
    expect(enzymeWrapper.find('.footer__ver-pill').text()).toEqual('v2.0.0')
  })

  test('does not display version if portal has it disabled', () => {
    jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
      env: 'prod',
      version: '2.0.0'
    }))

    const { enzymeWrapper } = setup({
      portal: {
        footer: {
          displayVersion: false
        }
      }
    })

    expect(enzymeWrapper.find('.footer__ver-pill').length).toEqual(1)
    expect(enzymeWrapper.find('.footer__ver-pill').text()).toEqual('')
  })

  test('displays attribution text', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.footer__info-bit').at(1).text()).toEqual('Mock text')
  })

  test('displays primary links', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.footer__info-link').first().props().href).toEqual('http://primary.example.com')
    expect(enzymeWrapper.find('.footer__info-link').first().text()).toEqual('Primary Example')
  })

  test('displays secondary links', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.footer__info-link').last().props().href).toEqual('http://secondary.example.com')
    expect(enzymeWrapper.find('.footer__info-link').last().text()).toEqual('Secondary Example')
  })

  describe('when in the prod environment', () => {
    test('does not display the environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        env: 'prod',
        version: '2.0.0'
      }))

      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.footer__env').length).toEqual(0)
    })
  })

  describe('when in a test environment', () => {
    test('displays the environment', () => {
      jest.spyOn(config, 'getApplicationConfig').mockImplementation(() => ({
        env: 'UAT',
        version: '2.0.0'
      }))

      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('.footer__env').length).toEqual(1)
      expect(enzymeWrapper.find('.footer__env').text()).toEqual('UAT')
    })
  })
})
