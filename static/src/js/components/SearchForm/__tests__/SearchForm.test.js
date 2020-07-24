import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Autosuggest from 'react-autosuggest'

import SearchForm from '../SearchForm'
import PortalFeatureContainer from '../../../containers/PortalFeatureContainer/PortalFeatureContainer'
import AdvancedSearchDisplayContainer from '../../../containers/AdvancedSearchDisplayContainer/AdvancedSearchDisplayContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    advancedSearch: {},
    autocomplete: {
      suggestions: []
    },
    authToken: '',
    keywordSearch: 'Test value',
    showFilterStackToggle: false,
    onCancelAutocomplete: jest.fn(),
    onChangeQuery: jest.fn(),
    onChangeFocusedCollection: jest.fn(),
    onClearFilters: jest.fn(),
    onToggleAdvancedSearchModal: jest.fn(),
    onClearAutocompleteSuggestions: jest.fn(),
    onFetchAutocomplete: jest.fn(),
    onSelectAutocompleteSuggestion: jest.fn(),
    onSuggestionsFetchRequested: jest.fn(),
    onSuggestionsClearRequested: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<SearchForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('SearchForm component', () => {
  test('should render self and form fields', () => {
    const { enzymeWrapper } = setup()
    const keywordSearch = enzymeWrapper.find(Autosuggest)

    expect(keywordSearch.prop('inputProps')).toEqual(expect.objectContaining({
      name: 'keywordSearch',
      value: 'Test value'
    }))
  })

  test('onAutoSuggestChange updates the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().keywordSearch).toEqual('Test value')

    enzymeWrapper.instance().onAutoSuggestChange({}, { newValue: 'new value' })
    expect(enzymeWrapper.state().keywordSearch).toEqual('new value')
  })

  test('should call onClearFilters when the Clear Button is clicked', () => {
    const { enzymeWrapper, props } = setup()
    const button = enzymeWrapper.find('.search-form__button--clear')

    button.simulate('click')

    expect(props.onClearFilters.mock.calls.length).toBe(1)
  })

  test('componentWillReceiveProps sets the state', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.state().keywordSearch).toEqual('Test value')
    const newSearch = 'new seach'
    enzymeWrapper.setProps({ keywordSearch: newSearch })
    expect(enzymeWrapper.state().keywordSearch).toEqual(newSearch)
  })

  describe('advanced search button', () => {
    test('renders the advanced search button under PortalFeatureContainer', () => {
      const { enzymeWrapper } = setup()

      const button = enzymeWrapper
        .find(PortalFeatureContainer)
        .find('.search-form__button--advanced-search')
      const portalFeatureContainer = button.parents(PortalFeatureContainer)

      expect(button.exists()).toBeTruthy()
      expect(portalFeatureContainer.props().advancedSearch).toBeTruthy()
    })

    test('renders the AdvancedSearchDisplayContainer under PortalFeatureContainer', () => {
      const { enzymeWrapper } = setup()

      const advancedSearchDisplayContainer = enzymeWrapper
        .find(PortalFeatureContainer)
        .find(AdvancedSearchDisplayContainer)
      const portalFeatureContainer = advancedSearchDisplayContainer.parents(PortalFeatureContainer)

      expect(advancedSearchDisplayContainer.exists()).toBeTruthy()
      expect(portalFeatureContainer.props().advancedSearch).toBeTruthy()
    })

    test('fires the action to open the advanced search modal', () => {
      const { enzymeWrapper, props } = setup()

      enzymeWrapper.find('.search-form__button--advanced-search').simulate('click')

      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAdvancedSearchModal).toHaveBeenCalledWith(true)
    })
  })

  describe('autocomplete', () => {
    test('cancels inflight requests if search form is submitted', () => {
      const { enzymeWrapper, props } = setup({
        keywordSearch: 'AST'
      })

      // Force the state change so that the form submit actually happens
      enzymeWrapper.setState({
        keywordSearch: 'ASTER'
      })

      enzymeWrapper.find('.search-form__form').simulate('submit', { preventDefault: jest.fn() })

      expect(props.onCancelAutocomplete).toHaveBeenCalledTimes(1)
    })
  })
})
