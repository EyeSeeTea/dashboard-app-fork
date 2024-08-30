// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { Divider, spacers } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useMemo, useRef } from 'react'
import { connect, useSelector } from 'react-redux'
import { EDIT, isEditMode } from '../../../modules/dashboardModes.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import { getAvailableDimensions } from '../getAvailableDimensions.js'
import ItemHeader from '../ItemHeader/ItemHeader.js'
import MissingPluginMessage from '../ItemMessage/MissingPluginMessage.js'
import { getIframeSrc } from './getIframeSrc.js'

const AppItem = ({ dashboardMode, windowDimensions, item, itemFilters }) => {
    const { d2 } = useD2()
    const contentRef = useRef()
    const headerRef = useRef()
    const dashboardId = useSelector(sGetSelectedId)

    const { isCached } = useCacheableSection(dashboardId)

    let appDetails

    const appKey = item.appKey

    if (appKey) {
        appDetails = d2.system.installedApps.find((app) => app.key === appKey)
    }

    const pluginProps = useMemo(
        () => ({
            dashboardItemId: item.id,
            dashboardItemFilters: itemFilters,
            cacheId: `${dashboardId}-${item.id}`,
            isParentCached: isCached,
        }),
        [dashboardId, item.id, isCached, itemFilters]
    )

    // See DHIS2-9605
    const hideTitle =
        appDetails?.settings?.dashboardWidget?.hideTitle &&
        dashboardMode !== EDIT

    const renderPlugin = (iframeSrc) => {
        // style must be computed at runtime.
        // header/content elements need to be rendered first, otherwise the dimensions returned are the previous ones
        const style =
            headerRef.current && contentRef.current
                ? getAvailableDimensions({
                      item,
                      headerRef,
                      contentRef,
                      dashboardMode,
                      windowDimensions,
                  })
                : {}

        return appDetails.appType === 'APP' ? (
            // modern plugins
            <Plugin
                pluginSource={iframeSrc}
                hasFixedDimensions={true}
                width={style.width}
                height={style.height}
                {...pluginProps}
            />
        ) : (
            // legacy widgets
            <iframe
                title={appDetails.name}
                src={iframeSrc}
                className={
                    !hideTitle
                        ? 'dashboard-item-content'
                        : 'dashboard-item-content-hidden-title'
                }
                style={{
                    border: 'none',
                    width: style.width,
                    height: style.height,
                }}
            />
        )
    }

    if (appDetails) {
        const iframeSrc = getIframeSrc(appDetails, item, itemFilters)

        return (
            <>
                {!hideTitle && (
                    <>
                        <ItemHeader
                            ref={headerRef}
                            title={appDetails.name}
                            itemId={item.id}
                            dashboardMode={dashboardMode}
                            isShortened={item.shortened}
                        />
                        <Divider margin={`0 0 ${spacers.dp4} 0`} />
                    </>
                )}
                <div className="dashboard-item-content" ref={contentRef}>
                    {renderPlugin(iframeSrc)}
                </div>
            </>
        )
    } else {
        return (
            <MissingPluginMessage
                pluginName={item.appKey}
                dashboardMode={dashboardMode}
            />
        )
    }
}

AppItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    windowDimensions: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
    const itemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetItemFiltersRoot(state)
        : DEFAULT_STATE_ITEM_FILTERS

    return { itemFilters }
}

export default connect(mapStateToProps)(AppItem)
