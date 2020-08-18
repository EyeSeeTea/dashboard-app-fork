import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { Link } from 'react-router-dom'
import { a4LandscapeWidthPx } from '../../modules/printUtils'

import classes from './PrintActionsBar.module.css'

const PrintActionsBar = ({ id }) => {
    const width =
        a4LandscapeWidthPx < window.innerWidth
            ? a4LandscapeWidthPx
            : window.innerWidth

    return (
        <div className={classes.container}>
            <div className={classes.inner} style={{ width }}>
                <Link className={classes.link} to={`/${id}`}>
                    <Button>{i18n.t('Exit print preview')}</Button>
                </Link>
                <Button onClick={window.print}>{i18n.t('Print')}</Button>
            </div>
        </div>
    )
}

PrintActionsBar.propTypes = {
    id: PropTypes.string,
}

export default PrintActionsBar