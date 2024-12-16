import { DEFAULT_STATE } from '../reducers/dashboardsStarredFilter.js'
import {
    apiGetUserDataStoreValue,
    apiPostUserDataStoreValue,
} from './userDataStore.js'

const KEY_SHOW_STARRED_DASHBOARDS = 'show_starred'

export const apiGetStarredDashboard = async () =>
    await apiGetUserDataStoreValue(KEY_SHOW_STARRED_DASHBOARDS, DEFAULT_STATE)

export const apiPostStarredDashboard = async (value) =>
    await apiPostUserDataStoreValue(KEY_SHOW_STARRED_DASHBOARDS, value)
