import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sGetSelected } from '../../../reducers/selected'
import { sGetShowDescription } from '../../../reducers/showDescription'
import ActionsBar from './ActionsBar'
import Description from './Description'
import LastUpdatedTag from './LastUpdatedTag'
import classes from './styles/TitleBar.module.css'

const ViewTitleBar = ({
    id,
    displayName,
    displayDescription,
    showDescription,
}) => {
    return (
        <div className={classes.container}>
            <div className={classes.titleBar} data-test="title-bar">
                <span
                    className={classes.title}
                    data-test="view-dashboard-title"
                >
                    {displayName}
                </span>
                <ActionsBar />
            </div>
            {showDescription && (
                <Description description={displayDescription} />
            )}
            {<LastUpdatedTag id={id} />}
        </div>
    )
}

ViewTitleBar.propTypes = {
    displayDescription: PropTypes.string,
    displayName: PropTypes.string,
    id: PropTypes.string,
    showDescription: PropTypes.bool,
}

const mapStateToProps = state => {
    const dashboard = sGetSelected(state)

    return {
        ...dashboard,
        showDescription: sGetShowDescription(state),
    }
}

export default connect(mapStateToProps)(ViewTitleBar)
