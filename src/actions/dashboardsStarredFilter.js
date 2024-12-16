import { apiGetStarredDashboard } from '../api/starred'
import { SET_DASHBOARDS_STARRED_FILTER } from '../reducers/dashboardsStarredFilter'

// actions

export const acSetDashboardsStarredFilter = (value) => ({
    type: SET_DASHBOARDS_STARRED_FILTER,
    value,
})

// thunks

export const tSetStarredDashboard = () => async (dispatch) => {
    try {
        const starredValue = await apiGetStarredDashboard()
        dispatch(acSetDashboardsStarredFilter(starredValue))
    } catch (err) {
        console.log('Error (apiGetStarredDashboard): ', error)
    }
}
