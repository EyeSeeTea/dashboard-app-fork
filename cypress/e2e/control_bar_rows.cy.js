// import {
//     dashboardTitleSel,
//     dashboardsBarContainerSel,
//     showMoreLessSel,
// } from '../elements/viewDashboard.js'
import { openSLDashboard } from '../helpers/open_the_SL_dashboard.js'
import { getApiBaseUrl, EXTENDED_TIMEOUT } from '../support/utils.js'

// const MIN_DASHBOARDS_BAR_HEIGHT = 71
// const MAX_DASHBOARDS_BAR_HEIGHT = 431

describe.skip('Control bar rows', () => {
    beforeEach(() => {
        cy.request({
            method: 'PUT',
            url: `${getApiBaseUrl()}/api/userDataStore/dashboard/controlBarRows`,
            headers: {
                'content-type': 'application/json',
            },
            body: '1',
        }).then((response) => expect(response.status).to.equal(201))
    })

    // Scenario: I expand the control bar
    it('expands the control bar', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openSLDashboard('Delivery')
        // Then the control bar should be at collapsed height
        // When I toggle show more dashboards
        // Then the control bar should be expanded to full height
    })

    // Scenario: I expand the control bar when dashboard not found
    it('expands the control bar when dashboard not found', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        // Given I type an invalid dashboard id in the browser url
        // Then a message displays informing that the dashboard is not found
        // And the control bar should be at collapsed height
        // When I toggle show more dashboards
        // Then the control bar should be expanded to full height
    })
})
