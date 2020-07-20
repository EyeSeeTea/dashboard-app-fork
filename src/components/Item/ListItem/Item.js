import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { colors } from '@dhis2/ui'
import DescriptionIcon from '../../../icons/Description'

import DeleteIcon from '../../../icons/Delete'
import Line from '../../../widgets/Line'
import { itemTypeMap, getItemUrl } from '../../../modules/itemTypes'
import { orArray } from '../../../modules/util'
import { tRemoveListItemContent } from './actions'
import { sGetSelectedDashboardMode } from '../../../reducers/selected'
import ItemHeader from '../ItemHeader/ItemHeader'
import { isViewMode } from '../../Dashboard/dashboardModes'
import classes from './Item.module.css'

const getItemTitle = item => itemTypeMap[item.type].pluralTitle

const getContentItems = item =>
    orArray(item[itemTypeMap[item.type].propName]).filter(
        (item, index, array) =>
            array.findIndex(el => el.id === item.id) === index
    )

const ListItem = (props, context) => {
    const { item, dashboardMode, tRemoveListItemContent } = props
    const contentItems = getContentItems(item)

    const getLink = contentItem => {
        const deleteButton = (
            <button
                className={classes.deletebutton}
                onClick={() => tRemoveListItemContent(item, contentItem)}
            >
                <DeleteIcon className={classes.deleteicon} />
            </button>
        )

        return (
            <>
                <a
                    className={classes.link}
                    style={{ color: colors.grey900 }}
                    href={getItemUrl(item.type, contentItem, context.d2)}
                >
                    {contentItem.name}
                </a>
                {!isViewMode(dashboardMode) ? deleteButton : null}
            </>
        )
    }

    return (
        <>
            <ItemHeader title={getItemTitle(item)} itemId={item.id} />
            <Line />
            <div className="dashboard-item-content">
                <ul className={classes.list}>
                    {contentItems.map(contentItem => (
                        <li className={classes.item} key={contentItem.id}>
                            <DescriptionIcon className={classes.itemicon} />
                            {getLink(contentItem)}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

ListItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    tRemoveListItemContent: PropTypes.func,
}

ListItem.contextTypes = {
    d2: PropTypes.object,
}

const mapStateToProps = state => ({
    dashboardMode: sGetSelectedDashboardMode(state),
})

export default connect(mapStateToProps, {
    tRemoveListItemContent,
})(ListItem)
