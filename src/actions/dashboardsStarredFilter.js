import { apiGetStarredDashboard } from '../api/starred.js'
import { SET_DASHBOARDS_STARRED_FILTER } from '../reducers/dashboardsStarredFilter.js'

// actions

export const acSetDashboardsStarredFilter = (value) => ({
    type: SET_DASHBOARDS_STARRED_FILTER,
    value,
})

// thunks

export const tSetStarredDashboard = () => async (dispatch) => {
    try {
        const starredValue = await apiGetStarredDashboard()
        return dispatch(acSetDashboardsStarredFilter(starredValue))
    } catch (error) {
        console.log('Error (apiGetStarredDashboard): ', error)
        return error
    }
}
