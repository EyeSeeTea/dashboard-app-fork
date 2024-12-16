import reducer, {
    DEFAULT_STATE,
    SET_DASHBOARDS_STARRED_FILTER,
} from '../dashboardsStarredFilter'

describe('dashboards filter reducer', () => {
    it('returns empty string as a default state', () => {
        const actualState = reducer(DEFAULT_STATE, {})
        expect(actualState).toEqual('')
    })

    it('set starred filter to starred ', () => {
        const starredValue = 'starred'
        const action = {
            type: SET_DASHBOARDS_STARRED_FILTER,
            value: starredValue,
        }

        const actualState = reducer(undefined, action)

        expect(actualState).toEqual(starredValue)
    })
})
