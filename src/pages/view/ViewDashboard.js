import { useDhis2ConnectionStatus, useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { AlertStack, AlertBar } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { acClearEditDashboard } from '../../actions/editDashboard.js'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered.js'
import { acClearPrintDashboard } from '../../actions/printDashboard.js'
import {
    tSetSelectedDashboardById,
    tSetSelectedDashboardByIdOffline,
} from '../../actions/selected.js'
import { apiPostDataStatistics } from '../../api/dataStatistics.js'
import DashboardContainer from '../../components/DashboardContainer.js'
import DashboardsBar from '../../components/DashboardsBar/DashboardsBar.js'
import { DashboardsBar as DashboardsBarNew } from '../../components/DashboardsBarNew/DashboardsBar.js'
import LoadingMask from '../../components/LoadingMask.js'
import Notice from '../../components/Notice.js'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible.js'
import { useCacheableSection } from '../../modules/useCacheableSection.js'
import { sGetDashboardById } from '../../reducers/dashboards.js'
import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import { ROUTE_START_PATH } from '../start/index.js'
import FilterBar from './FilterBar/FilterBar.js'
import ItemGrid from './ItemGrid.js'
import classes from './styles/ViewDashboard.module.css'
import TitleBar from './TitleBar/TitleBar.js'

const ViewDashboard = ({
    clearEditDashboard,
    clearPrintDashboard,
    currentId,
    fetchDashboard,
    passiveViewRegistered,
    registerPassiveView,
    requestedDashboardName,
    requestedId,
    setSelectedAsOffline,
    username,
}) => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [loadFailed, setLoadFailed] = useState(false)
    const { isConnected: online } = useDhis2ConnectionStatus()
    const { isCached } = useCacheableSection(requestedId)
    const engine = useDataEngine()

    useEffect(() => {
        setHeaderbarVisible(true)
        clearEditDashboard()
        clearPrintDashboard()
    }, [clearEditDashboard, clearPrintDashboard])

    useEffect(() => {
        setLoaded(false)

        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach((container) => {
            container.scroll(0, 0)
        })
    }, [requestedId])

    useEffect(() => {
        if (!passiveViewRegistered && online) {
            apiPostDataStatistics('PASSIVE_DASHBOARD_VIEW', requestedId, engine)
                .then(() => {
                    registerPassiveView()
                })
                .catch((error) => console.info(error))
        }
    }, [passiveViewRegistered, engine])

    useEffect(() => {
        const loadDashboard = async () => {
            const alertTimeout = setTimeout(() => {
                if (requestedDashboardName) {
                    setLoadingMessage(
                        i18n.t('Loading dashboard – {{name}}', {
                            name: requestedDashboardName,
                        })
                    )
                } else {
                    setLoadingMessage(i18n.t('Loading dashboard'))
                }
            }, 500)

            try {
                await fetchDashboard(requestedId, username)
                setLoaded(true)
                setLoadFailed(false)
                setLoadingMessage(null)
                clearTimeout(alertTimeout)
            } catch (e) {
                setLoaded(false)
                setLoadFailed(true)
                setLoadingMessage(null)
                clearTimeout(alertTimeout)
                setSelectedAsOffline(requestedId, username)
            }
        }

        const requestedIsAvailable = online || isCached
        const switchingDashboard = requestedId !== currentId

        if (requestedIsAvailable && !loaded) {
            loadDashboard()
        } else if (!requestedIsAvailable && switchingDashboard) {
            setLoaded(false)
            setSelectedAsOffline(requestedId, username)
        }
    }, [requestedId, currentId, loaded, online])

    const onExpandedChanged = (expanded) => setControlbarExpanded(expanded)

    const getContent = () => {
        if (!online && !isCached && (requestedId !== currentId || !loaded)) {
            return (
                <Notice
                    title={i18n.t('Offline')}
                    message={
                        <>
                            <p>
                                {i18n.t(
                                    'This dashboard cannot be loaded while offline.'
                                )}
                            </p>
                            <div>
                                <Link
                                    to={ROUTE_START_PATH}
                                    className={classes.link}
                                >
                                    {i18n.t('Go to start page')}
                                </Link>
                            </div>
                        </>
                    }
                />
            )
        }

        if (loadFailed) {
            return (
                <Notice
                    title={i18n.t('Load dashboard failed')}
                    message={i18n.t(
                        'This dashboard could not be loaded. Please try again later.'
                    )}
                />
            )
        }

        return requestedId !== currentId ? (
            <LoadingMask />
        ) : (
            <>
                <TitleBar />
                <FilterBar />
                <ItemGrid />
            </>
        )
    }

    return (
        <>
            <div
                className={cx(classes.container, 'dashboard-scroll-container')}
                data-test="outer-scroll-container"
            >
                <DashboardsBar
                    expanded={controlbarExpanded}
                    onExpandedChanged={onExpandedChanged}
                />
                <DashboardsBarNew />
                <DashboardContainer covered={controlbarExpanded}>
                    {controlbarExpanded && (
                        <div
                            className={classes.cover}
                            onClick={() => setControlbarExpanded(false)}
                        />
                    )}
                    {getContent()}
                </DashboardContainer>
            </div>
            <AlertStack>
                {loadingMessage && (
                    <AlertBar
                        onHidden={() => setLoadingMessage(null)}
                        permanent
                    >
                        {loadingMessage}
                    </AlertBar>
                )}
            </AlertStack>
        </>
    )
}

ViewDashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    clearPrintDashboard: PropTypes.func,
    currentId: PropTypes.string,
    fetchDashboard: PropTypes.func,
    passiveViewRegistered: PropTypes.bool,
    registerPassiveView: PropTypes.func,
    requestedDashboardName: PropTypes.string,
    requestedId: PropTypes.string,
    setSelectedAsOffline: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboard = sGetDashboardById(state, ownProps.requestedId) || {}

    return {
        passiveViewRegistered: sGetPassiveViewRegistered(state),
        requestedDashboardName: dashboard.displayName || null,
        currentId: sGetSelectedId(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
    registerPassiveView: acSetPassiveViewRegistered,
    fetchDashboard: tSetSelectedDashboardById,
    setSelectedAsOffline: tSetSelectedDashboardByIdOffline,
})(ViewDashboard)
