import request from 'request-promise'
import { getEchoProfileData } from '../getEchoProfileData'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getClientId from '../../../../sharedUtils/getClientId'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getEchoProfileData', () => {
  test('correctly requests a users data from urs', async () => {
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ echoRestRoot: 'http://echorest.example.com' }))
    jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ lambda: 'eed-edsc-test-serverless-lambda' }))

    const ursGetMock = jest.spyOn(request, 'get')
      .mockImplementationOnce(() => jest.fn())

    await getEchoProfileData('fake.access.token')

    expect(ursGetMock).toBeCalledTimes(1)
    expect(ursGetMock).toBeCalledWith({
      uri: 'http://echorest.example.com/users/current.json',
      headers: {
        'Echo-Token': 'fake.access.token:clientId',
        'Client-Id': 'eed-edsc-test-serverless-lambda'
      },
      json: true,
      resolveWithFullResponse: true
    })
  })

  test('correctly returns the users data', async () => {
    jest.spyOn(getEarthdataConfig, 'getSecretEarthdataConfig').mockImplementation(() => ({ clientId: 'clientId' }))
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://echorest.example.com' }))

    jest.spyOn(request, 'get')
      .mockImplementationOnce(() => ({
        body: {
          first_name: 'test',
          last_name: 'user'
        }
      }))

    const ursData = await getEchoProfileData('fake.access.token')

    expect(ursData).toEqual({
      first_name: 'test',
      last_name: 'user'
    })
  })
})
