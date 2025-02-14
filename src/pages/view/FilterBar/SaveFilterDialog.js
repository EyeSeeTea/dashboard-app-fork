import {
    Button,
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    ModalTitle,
    InputField,
    SingleSelectOption,
    SingleSelectField,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '@dhis2/d2-i18n'
import {
    filterVisibility, privateVisiblity,
} from '../../../reducers/savedFilters'

const SaveFilterDialog = ({
    onCancel,
    onConfirm,
    filter = {},
    showScope = true,
}) => {
    const [visibility, setVisibility] = React.useState(filter.visibility || privateVisiblity)
    const [name, setName] = React.useState(filter.id ? filter.name : '')

    const handleVisibilityChange = ({ selected }) => {
        setVisibility(selected)
    }
    const handleNameChange = ({ value }) => {
        setName(value)
    }
    const handleConfirm = () => {
        onConfirm({ name, visibility, id: filter.id })
    }

    return (
        <Modal
            dataTest="save-filter-dialog"
            onClose={onCancel}
            small
            position="middle"
        >
            <ModalTitle>{i18n.t('Save Filter')}</ModalTitle>
            <ModalContent>
                <InputField
                    type="text"
                    placeholder={i18n.t('Untitled filter')}
                    label={i18n.t('Name')}
                    value={name}
                    onChange={handleNameChange}
                />
                {showScope && (
                    <SingleSelectField
                        label={i18n.t('Scope')}
                        selected={visibility}
                        onChange={handleVisibilityChange}
                    >
                        {filterVisibility.map((f) => (
                            <SingleSelectOption key={f} value={f} label={f} />
                        ))}
                    </SingleSelectField>
                )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button key="cancel" secondary onClick={onCancel}>
                        {'Cancel'}
                    </Button>

                    <Button key="confirm" destructive onClick={handleConfirm}>
                        {'Confirm'}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

SaveFilterDialog.propTypes = {
    open: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
    filter: PropTypes.object,
    showScope: PropTypes.bool,
}

export default SaveFilterDialog
