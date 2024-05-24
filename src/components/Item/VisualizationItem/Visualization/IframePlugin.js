import { useConfig } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { Plugin } from '@dhis2/app-runtime/experimental'
import { CenteredContent, CircularLoader } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { acAddIframePluginStatus } from '../../../../actions/iframePluginStatus.js'
import {
    CHART,
    REPORT_TABLE,
    VISUALIZATION,
} from '../../../../modules/itemTypes.js'
import { getPluginOverrides } from '../../../../modules/localStorage.js'
import { useCacheableSection } from '../../../../modules/useCacheableSection.js'
import {
    INSTALLATION_STATUS_INSTALLING,
    INSTALLATION_STATUS_UNKNOWN,
    sGetIframePluginStatus,
} from '../../../../reducers/iframePluginStatus.js'
import { useUserSettings } from '../../../UserSettingsProvider.js'
import MissingPluginMessage from './MissingPluginMessage.js'
import { getPluginLaunchUrl } from './plugin.js'
import classes from './styles/IframePlugin.module.css'
import VisualizationErrorMessage from './VisualizationErrorMessage.js'

const IframePlugin = ({
    activeType,
    filterVersion,
    style,
    visualization,
    dashboardMode,
    dashboardId,
    itemId,
    itemType,
    isFirstOfType,
}) => {
    const dispatch = useDispatch()
    const iframePluginStatus = useSelector(sGetIframePluginStatus, shallowEqual)

    const { d2 } = useD2()
    const { baseUrl } = useConfig()

    const { userSettings } = useUserSettings()
    const [error, setError] = useState(null)

    // When this mounts, check if the dashboard is recording
    const { isCached, recordingState } = useCacheableSection(dashboardId)

    // set this to false after first props transfer with true flag
    const [recordOnNextLoad, setRecordOnNextLoad] = useState(
        recordingState === 'recording'
    )

    const pluginType = [CHART, REPORT_TABLE].includes(activeType)
        ? VISUALIZATION
        : activeType

    const onError = () => setError('plugin')
    const onInstallationStatusChange = useCallback(
        (installationStatus) => {
            if (isFirstOfType) {
                dispatch(
                    acAddIframePluginStatus({
                        pluginType,
                        status: installationStatus,
                    })
                )
            }
        },
        [dispatch, isFirstOfType, pluginType]
    )
    const onPropsReceived = useCallback(() => {
        if (recordOnNextLoad) {
            setRecordOnNextLoad(false)
        }
    }, [recordOnNextLoad])

    const pluginProps = useMemo(
        () => ({
            isVisualizationLoaded: true,
            forDashboard: true,
            displayProperty: userSettings.keyAnalysisDisplayProperty,
            visualization,
            onError,
            onInstallationStatusChange,
            onPropsReceived,

            // For caching: ---
            // Add user & dashboard IDs to cache ID to avoid removing a cached
            // plugin that might be used in another dashboard also
            // TODO: May also want user ID too for multi-user situations
            cacheId: `${dashboardId}-${itemId}`,
            isParentCached: isCached,
            recordOnNextLoad,
        }),
        [
            userSettings,
            visualization,
            dashboardId,
            itemId,
            isCached,
            onInstallationStatusChange,
            onPropsReceived,
            recordOnNextLoad,
        ]
    )

    const getIframeSrc = useCallback(() => {
        // 1. check if there is an override for the plugin
        const pluginOverrides = getPluginOverrides()

        if (pluginOverrides && pluginOverrides[pluginType]) {
            return pluginOverrides[pluginType]
        }

        // 2. check if there is an installed app for the pluginType
        // and use its plugin launch URL
        const pluginLaunchUrl = getPluginLaunchUrl(pluginType, d2, baseUrl)

        if (pluginLaunchUrl) {
            return pluginLaunchUrl
        }

        setError('missing-plugin')
    }, [d2, baseUrl, pluginType])

    const iframeSrc = getIframeSrc()

    useEffect(() => {
        setError(null)
    }, [filterVersion, visualization.type])

    if (error) {
        return error === 'missing-plugin' ? (
            <div style={style}>
                <MissingPluginMessage
                    itemType={itemType}
                    dashboardMode={dashboardMode}
                />
            </div>
        ) : (
            <div style={style}>
                <VisualizationErrorMessage
                    itemType={itemType}
                    visualizationId={visualization.id}
                    dashboardMode={dashboardMode}
                />
            </div>
        )
    }

    if (
        [INSTALLATION_STATUS_INSTALLING, INSTALLATION_STATUS_UNKNOWN].includes(
            iframePluginStatus[pluginType]
        ) &&
        !isFirstOfType
    ) {
        return (
            <div
                style={{
                    width: style.width || '100%',
                    height: style.height || '100%',
                }}
            >
                <CenteredContent>
                    <CircularLoader />
                </CenteredContent>
            </div>
        )
    }

    return (
        <div className={classes.wrapper}>
            {iframeSrc ? (
                <Plugin
                    pluginSource={iframeSrc}
                    width={style.width}
                    height={style.height}
                    {...pluginProps}
                />
            ) : null}
        </div>
    )
}

IframePlugin.propTypes = {
    activeType: PropTypes.string,
    dashboardId: PropTypes.string,
    dashboardMode: PropTypes.string,
    filterVersion: PropTypes.string,
    isFirstOfType: PropTypes.bool,
    itemId: PropTypes.string,
    itemType: PropTypes.string,
    style: PropTypes.object,
    visualization: PropTypes.object,
}

// Memoize the whole component to avoid re-rendering when the parent component re-renders.
// This happens when the interpretations panel is toggled because the `item` prop changes (height)
// causing the `Item` component to re-render.

export default React.memo(IframePlugin)
