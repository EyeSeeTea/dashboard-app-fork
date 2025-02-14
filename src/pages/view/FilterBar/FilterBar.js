import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import {
    acRemoveItemFilter,
    acClearItemFilters,
} from '../../../actions/itemFilters.js'
import ConfirmActionDialog from '../../../components/ConfirmActionDialog.js'
import { sGetNamedItemFilters } from '../../../reducers/itemFilters.js'
import FilterBadge from './FilterBadge.js'
import classes from './styles/FilterBar.module.css'
import { Button, colors, FlyoutMenu, IconMore16 } from '@dhis2/ui'
import {
    acSetActiveFilter,
    tDeleteActiveFilter,
    tSaveFilter,
    tToggleActiveFilterVisibility,
} from '../../../actions/savedFilters'
import { useCachedDataQuery } from '@dhis2/analytics'
import {
    privateVisiblity,
    sGetActiveFilter,
} from '../../../reducers/savedFilters'
import { deepEqual } from '../../../modules/util'
import MenuItem from '../../../components/MenuItemWithTooltip'
import DropdownButton from '../../../components/DropdownButton/DropdownButton'
import SaveFilterDialog from './SaveFilterDialog'
import { isFilterActionAllowed } from '../../../api/savedFilters'

const FilterBar = ({
    filters,
    removeFilter,
    removeAllFilters,
    saveFilter,
    updateActiveFilter,
    deleteFilter,
    activeFilter,
    toggleFilterVisibility,
}) => {
    const { isConnected: online } = useDhis2ConnectionStatus()
    const { currentUser } = useCachedDataQuery()
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [filterDialogIsOpen, setFilterDialogIsOpen] = useState(false)
    const [filterDialogData, setFilterDialogData] = useState(activeFilter)
    const [moreOptionsIsOpen, setMoreOptionsIsOpen] = useState(false)
    const [showScope, setShowScope] = useState(true)

    const onRemoveFilter = (filterId) => {
        if (!online && filters.length > 1) {
            setDialogIsOpen(true)
        } else {
            removeFilter(filterId)
        }
    }

    const closeDialog = () => setDialogIsOpen(false)

    const closeFilterDialog = useCallback(() => {
        setFilterDialogIsOpen(false)
        setShowScope(true)
    }, [activeFilter])
    const onConfirmFilterDialog = useCallback(
        async ({ name, visibility, id }) => {
            await handleSaveFilter({ ...activeFilter, name, visibility, id })
            closeFilterDialog()
        },
        [activeFilter, closeFilterDialog]
    )

    const hasActiveSavedFilter = Boolean(activeFilter.id)
    const savedFilterHasChanges = useMemo(
        () => hasActiveSavedFilter && !deepEqual(activeFilter.values, filters),
        [activeFilter, filters]
    )

    const toggleMoreActions = () => {
        setMoreOptionsIsOpen((prev) => !prev)
    }
    const showFilterAction = isFilterActionAllowed(activeFilter, currentUser)

    const handleSaveFilter = useCallback(async (filter = {}) => {
        await saveFilter(currentUser, {...activeFilter, ...filter})
        setMoreOptionsIsOpen(false)
    }, [currentUser, activeFilter])
    const handleSaveNewFilter = useCallback(() => {
        setFilterDialogData({ id: 'new' })
        setFilterDialogIsOpen(true)
    }, [activeFilter])
    const handleRenameFilter = useCallback(() => {
        setShowScope(false)
        setFilterDialogData(activeFilter)
        setFilterDialogIsOpen(true)
        setMoreOptionsIsOpen(false)
    }, [activeFilter])
    const handleDeleteFilter = useCallback(async () => {
        await deleteFilter(currentUser)
        setMoreOptionsIsOpen(false)
    }, [currentUser])
    const handleToggleVisibility = useCallback(async () => {
        await toggleFilterVisibility(currentUser)
        setMoreOptionsIsOpen(false)
    }, [currentUser])

    useEffect(() => {
        if (!filters.length) {
            updateActiveFilter(null)
        }
    }, [filters])

    const getMoreActions = useMemo(
        () => (
            <FlyoutMenu>
                {showFilterAction && (
                    <>
                        <MenuItem
                            dense
                            label={i18n.t('Rename')}
                            onClick={handleRenameFilter}
                        />
                        <MenuItem
                            dense
                            label={i18n.t('Delete')}
                            onClick={handleDeleteFilter}
                        />
                    </>
                )}
                {savedFilterHasChanges && (
                    <>
                        {showFilterAction &&
                            <MenuItem
                                dense
                                label={i18n.t('Save')}
                                onClick={handleSaveFilter}
                            />
                        }
                        <MenuItem
                            dense
                            label={i18n.t('Save as new filter')}
                            onClick={handleSaveNewFilter}
                        />
                    </>
                )}
                {showFilterAction &&
                    <MenuItem
                        dense
                        label={
                            activeFilter?.visibility === privateVisiblity
                                ? i18n.t('Make it public')
                                : i18n.t('Make it private')
                        }
                        onClick={handleToggleVisibility}
                    />
                }
            </FlyoutMenu>
        ),
        [
            savedFilterHasChanges,
            handleRenameFilter,
            handleDeleteFilter,
            handleSaveNewFilter,
            handleSaveFilter,
            handleToggleVisibility,
            activeFilter,
            showFilterAction,
        ]
    )

    return filters.length ? (
        <>
            <div className={classes.bar} style={{ alignItems: 'center' }}>
                {hasActiveSavedFilter && <div>{activeFilter.name}:</div>}
                {filters.map((filter) => (
                    <FilterBadge
                        key={filter.id}
                        filter={filter}
                        onRemove={onRemoveFilter}
                    />
                ))}
                {online && !hasActiveSavedFilter && (
                    <Button secondary small onClick={handleSaveNewFilter}>
                        {i18n.t('Save')}
                    </Button>
                )}
                {online && hasActiveSavedFilter && (showFilterAction || savedFilterHasChanges) && (
                    <DropdownButton
                        dataTest="more-actions-button"
                        secondary
                        small
                        showArrow={false}
                        open={moreOptionsIsOpen}
                        disabledWhenOffline={true}
                        onClick={toggleMoreActions}
                        icon={<IconMore16 color={colors.grey700} />}
                        component={getMoreActions}
                    >
                        <wbr />
                    </DropdownButton>
                )}
            </div>
            <ConfirmActionDialog
                open={dialogIsOpen}
                title={i18n.t('Removing filters while offline')}
                message={i18n.t(
                    'Removing this filter while offline will remove all other filters. Do you want to remove all filters on this dashboard?'
                )}
                cancelLabel={i18n.t('No, cancel')}
                confirmLabel={i18n.t('Yes, remove filters')}
                onConfirm={removeAllFilters}
                onCancel={closeDialog}
            />
            {filterDialogIsOpen && (
                <SaveFilterDialog
                    open={filterDialogIsOpen}
                    filter={filterDialogData}
                    showScope={showScope}
                    onCancel={closeFilterDialog}
                    onConfirm={onConfirmFilterDialog}
                />
            )}
        </>
    ) : null
}

FilterBar.propTypes = {
    filters: PropTypes.array.isRequired,
    removeAllFilters: PropTypes.func.isRequired,
    removeFilter: PropTypes.func.isRequired,
    updateActiveFilter: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired,
    toggleFilterVisibility: PropTypes.func.isRequired,
    activeFilter: PropTypes.object,
}

FilterBar.defaultProps = {
    filters: [],
}

const mapStateToProps = (state) => ({
    filters: sGetNamedItemFilters(state),
    activeFilter: sGetActiveFilter(state),
})

export default connect(mapStateToProps, {
    removeAllFilters: acClearItemFilters,
    removeFilter: acRemoveItemFilter,
    saveFilter: tSaveFilter,
    updateActiveFilter: acSetActiveFilter,
    deleteFilter: tDeleteActiveFilter,
    toggleFilterVisibility: tToggleActiveFilterVisibility,
})(FilterBar)
