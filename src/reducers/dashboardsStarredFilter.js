import { validateReducer } from '../modules/util.js'

export const SET_DASHBOARDS_STARRED_FILTER = 'SET_DASHBOARDS_STARRED_FILTER'

export const DEFAULT_STATE = ''
export const STARRED_STATE = 'starred'

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case SET_DASHBOARDS_STARRED_FILTER: {
            return validateReducer(action.value, DEFAULT_STATE)
        }
        default:
            return state
    }
}

// selectors

export const sGetDashboardsStarredFilter = (state) =>
    state.dashboardsStarredFilter
