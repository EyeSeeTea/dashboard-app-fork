import { fireEvent } from '@testing-library/dom'
import { render, waitFor, screen } from '@testing-library/react'
import React from 'react'
import { getGridItemDomElementClassName } from '../../../../../modules/getGridItemDomElementClassName.js'
import { useSystemSettings } from '../../../../SystemSettingsProvider.jsx'
import WindowDimensionsProvider from '../../../../WindowDimensionsProvider.jsx'
import ItemContextMenu from '../ItemContextMenu.jsx'

jest.mock('../../../../SystemSettingsProvider.jsx', () => {
    return {
        __esModule: true,
        default: jest.fn((children) => <div>{children}</div>),
        useSystemSettings: jest.fn(),
    }
})

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(() => ({
        isConnected: true,
        isDisconnected: false,
    })),
    useConfig: jest.fn(() => ({ baseUrl: 'dhis2' })),
}))

const mockSystemSettingsDefault = {
    systemSettings: {
        allowVisOpenInApp: true,
        allowVisShowInterpretations: true,
        allowVisViewAs: true,
        allowVisFullscreen: true,
    },
}

const defaultProps = {
    item: {
        type: 'CHART',
        id: 'rainbowdash',
    },
    visualization: {
        type: 'BAR',
    },
    onSelectActiveType: Function.prototype,
    onToggleFooter: Function.prototype,
    activeFooter: false,
    activeType: 'CHART',
    fullscreenSupported: true,
    loadItemFailed: false,
}

test('renders just the button when menu closed', () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} />
        </WindowDimensionsProvider>
    )

    expect(getByRole('button')).toBeTruthy()
    expect(queryByText('View as Map')).toBeNull()
    expect(queryByText('View as Chart')).toBeNull()
    expect(queryByText('View as Pivot table')).toBeNull()
    expect(queryByTestId('divider')).toBeNull()
    expect(queryByText('Open in Data Visualizer app')).toBeNull()
    expect(queryByText('Show details and interpretations')).toBeNull()
    expect(queryByText('View fullscreen')).toBeNull()
})

test('renders exit fullscreen button', () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const gridItemClassName = getGridItemDomElementClassName(
        defaultProps.item.id
    )

    const { rerender } = render(
        <WindowDimensionsProvider>
            <div className={gridItemClassName}>
                <ItemContextMenu {...defaultProps} />
            </div>
        </WindowDimensionsProvider>
    )

    document.fullscreenElement = document.querySelector(`.${gridItemClassName}`)

    rerender(
        <WindowDimensionsProvider>
            <div className={{ gridItemClassName }}>
                <ItemContextMenu {...defaultProps} />
            </div>
        </WindowDimensionsProvider>
    )

    document.fullscreenElement = null
    expect(screen.getByTestId('exit-fullscreen-button')).toBeTruthy()
})

test('renders popover menu for BAR chart', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        visualization: {
            type: 'BAR',
        },
    })

    const { getByRole, queryByText, queryByTestId } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeTruthy()
        expect(queryByText('View as Chart')).toBeNull()
        expect(queryByText('View as Pivot table')).toBeTruthy()
        expect(queryByTestId('divider')).toBeTruthy()
        expect(queryByText('Open in Data Visualizer app')).toBeTruthy()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('renders popover menu for SINGLE_VALUE chart', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        visualization: {
            type: 'SINGLE_VALUE',
        },
    })

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeNull()
        expect(queryByText('View as Chart')).toBeNull()
        expect(queryByText('View as Pivot table')).toBeNull()
        expect(queryByTestId('divider')).toBeNull()
        expect(queryByText('Open in Data Visualizer app')).toBeTruthy()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('renders popover menu for YEAR_OVER_YEAR_LINE chart', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        visualization: {
            type: 'YEAR_OVER_YEAR_LINE',
        },
    })

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeNull()
        expect(queryByText('View as Chart')).toBeNull()
        expect(queryByText('View as Pivot table')).toBeNull()
        expect(queryByTestId('divider')).toBeNull()
        expect(queryByText('Open in Data Visualizer app')).toBeTruthy()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('renders popover menu for GAUGE chart', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        visualization: {
            type: 'GAUGE',
        },
    })

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeNull()
        expect(queryByText('View as Chart')).toBeNull()
        expect(queryByText('View as Pivot table')).toBeNull()
        expect(queryByTestId('divider')).toBeNull()
        expect(queryByText('Open in Data Visualizer app')).toBeTruthy()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('renders popover menu for PIE chart', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        visualization: {
            type: 'PIE',
        },
    })

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeNull()
        expect(queryByText('View as Chart')).toBeNull()
        expect(queryByText('View as Pivot table')).toBeNull()
        expect(queryByTestId('divider')).toBeNull()
        expect(queryByText('Open in Data Visualizer app')).toBeTruthy()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('renders popover menu for PIVOT_TABLE', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        item: {
            type: 'REPORT_TABLE',
        },
        visualization: {
            type: 'PIVOT_TABLE',
        },
        activeType: 'REPORT_TABLE',
    })

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeTruthy()
        expect(queryByText('View as Chart')).toBeTruthy()
        expect(queryByText('View as Pivot table')).toBeNull()
        expect(queryByTestId('divider')).toBeTruthy()
        expect(queryByText('Open in Data Visualizer app')).toBeTruthy()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('renders popover menu for MAP', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        item: {
            type: 'MAP',
        },
        visualization: {},
        activeType: 'MAP',
    })

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeNull()
        expect(queryByText('View as Chart')).toBeTruthy()
        expect(queryByText('View as Pivot table')).toBeTruthy()
        expect(queryByTestId('divider')).toBeTruthy()
        expect(queryByText('Open in Maps app')).toBeTruthy()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })
})

test('renders popover menu when interpretations displayed', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        visualization: {
            type: 'BAR',
        },
        activeFooter: true,
    })

    const { getByRole, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('Hide details and interpretations')).toBeTruthy()
    })
})

test('does not render "View as" options if settings do not allow', async () => {
    useSystemSettings.mockReturnValue({
        systemSettings: Object.assign(
            {},
            mockSystemSettingsDefault.systemSettings,
            {
                allowVisViewAs: false,
            }
        ),
    })

    const { getByRole, queryAllByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} />
        </WindowDimensionsProvider>
    )
    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryAllByText(/View as/i)).toHaveLength(0)
    })
})

test('does not render "Open in [app]" option if settings do not allow', async () => {
    useSystemSettings.mockReturnValue({
        systemSettings: Object.assign(
            {},
            mockSystemSettingsDefault.systemSettings,
            {
                allowVisOpenInApp: false,
            }
        ),
    })

    const { getByRole, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} />
        </WindowDimensionsProvider>
    )
    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText(/Open in/i)).toBeNull()
    })
})

test('renders only View in App when item load failed', async () => {
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)
    const props = Object.assign({}, defaultProps, {
        item: {
            type: 'MAP',
        },
        visualization: {},
        activeType: 'MAP',
        loadItemFailed: true,
    })

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeNull()
        expect(queryByText('View as Chart')).toBeNull()
        expect(queryByText('View as Pivot table')).toBeNull()
        expect(queryByTestId('divider')).toBeNull()
        expect(queryByText('Open in Maps app')).toBeTruthy()
        expect(queryByText('Show details and interpretations')).toBeNull()
        expect(queryByText('View fullscreen')).toBeNull()
    })
})

test('does not render "fullscreen" option if settings do not allow', async () => {
    useSystemSettings.mockReturnValue({
        systemSettings: Object.assign(
            {},
            mockSystemSettingsDefault.systemSettings,
            {
                allowVisFullscreen: false,
            }
        ),
    })

    const { getByRole, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} />
        </WindowDimensionsProvider>
    )
    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View fullscreen')).toBeNull()
    })
})

test('does not render "Show interpretations" option if settings do not allow', async () => {
    useSystemSettings.mockReturnValue({
        systemSettings: Object.assign(
            {},
            mockSystemSettingsDefault.systemSettings,
            {
                allowVisShowInterpretations: false,
            }
        ),
    })

    const { getByRole, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} />
        </WindowDimensionsProvider>
    )
    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('Show details and interpretations')).toBeNull()
    })
})

test('renders null if all relevant settings are false', async () => {
    useSystemSettings.mockReturnValue({
        systemSettings: {
            allowVisOpenInApp: false,
            allowVisShowInterpretations: false,
            allowVisViewAs: false,
            allowVisFullscreen: false,
        },
    })

    const { container } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} />
        </WindowDimensionsProvider>
    )

    expect(container).toMatchSnapshot()
})

test('renders correct options for BAR in small screen', async () => {
    global.innerWidth = 480
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...defaultProps} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeTruthy()
        expect(queryByText('View as Chart')).toBeNull()
        expect(queryByText('View as Pivot table')).toBeTruthy()
        expect(queryByTestId('divider')).toBeTruthy()
        expect(queryByText('Open in Data Visualizer app')).toBeNull()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })

    global.innerWidth = 800
})

test('renders correct options for PIE in small screen', async () => {
    global.innerWidth = 480
    useSystemSettings.mockReturnValue(mockSystemSettingsDefault)

    const props = Object.assign({}, defaultProps, {
        visualization: {
            type: 'PIE',
        },
    })

    const { getByRole, queryByTestId, queryByText } = render(
        <WindowDimensionsProvider>
            <ItemContextMenu {...props} />
        </WindowDimensionsProvider>
    )

    fireEvent.click(getByRole('button'))

    await waitFor(() => {
        expect(queryByText('View as Map')).toBeNull()
        expect(queryByText('View as Chart')).toBeNull()
        expect(queryByText('View as Pivot table')).toBeNull()
        expect(queryByTestId('divider')).toBeNull()
        expect(queryByText('Open in Data Visualizer app')).toBeNull()
        expect(queryByText('Show details and interpretations')).toBeTruthy()
        expect(queryByText('View fullscreen')).toBeTruthy()
    })

    global.innerWidth = 800
})
