import { DEFAULT_STATE } from '../reducers/dashboardsStarredFilter.js'
import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from './userDataStore.js'

const KEY_SHOW_STARRED_DASHBOARDS = 'showStarred'

export const apiGetStarredDashboard = () =>
    apiGetUserDataStoreValue(KEY_SHOW_STARRED_DASHBOARDS, DEFAULT_STATE)

export const apiPostStarredDashboard = (value) =>
    apiPostUserDataStoreValue(KEY_SHOW_STARRED_DASHBOARDS, value)
