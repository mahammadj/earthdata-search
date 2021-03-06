import config from '../static.config.json'
import { cmrEnv } from './cmrEnv'
import secretConfig from '../secret.config.json'

export const getApplicationConfig = () => config.application
export const getEarthdataConfig = env => config.earthdata[env]
export const getEnvironmentConfig = env => config.environment[env || process.env.NODE_ENV]

export const getSecretEarthdataConfig = env => secretConfig.earthdata[env]
export const getSecretEnvironmentConfig = () => secretConfig.environment[process.env.NODE_ENV]
export const getSecretCypressConfig = () => secretConfig.cypress
export const getSecretAdminUsers = () => secretConfig.admins

export const getClientId = () => {
  // Check the static config file to determine if we are running in CI
  const { ciMode } = getApplicationConfig()

  if (process.env.NODE_ENV === 'test' || ciMode === 'true') return getEarthdataConfig('test').clientId
  if (process.env.NODE_ENV === 'development') return getEarthdataConfig('dev').clientId

  return getEarthdataConfig(cmrEnv()).clientId
}
