import arraySort from 'd2-utilizr/lib/arraySort.js'
import { isFilterStarred } from '../../pages/view/TitleBar/ActionsBar'

export const getFilteredDashboards = (
    dashboards,
    filterText,
    starredFilter
) => {
    const onlyStarred = isFilterStarred(starredFilter)
    const filteredDashboards = arraySort(
        Object.values(dashboards)
            .filter((d) =>
                d.displayName.toLowerCase().includes(filterText.toLowerCase())
            )
            .filter((d) => (onlyStarred ? d.starred === true : true)),
        'ASC',
        'displayName'
    )

    return [
        ...filteredDashboards.filter((d) => d.starred),
        ...filteredDashboards.filter((d) => !d.starred),
    ]
}
