import {
    dashboardTitleSel,
    dashboardDescriptionSel,
} from '../elements/viewDashboard.js'
import {
    clickViewActionButton,
    clickEditActionButton,
    startNewDashboard,
    addDashboardTitle,
    addDashboardItems,
    saveDashboard,
    openDashboard,
    chooseToEditDashboard,
    expectDashboardToDisplayInViewMode,
} from '../helpers/index.js'
import {
    EXTENDED_TIMEOUT,
    createDashboardTitle,
    getApiBaseUrl,
} from '../support/utils.js'

let norwegianTitle = ''
let norwegianDesc = ''

const TEST_DASHBOARD_TITLE = createDashboardTitle('ax')

beforeEach(() => {
    // set dblocale to English
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'en'
    ).then((response) => {
        expect(response.status).to.equal(200)
    })
})

// When('I add translations for dashboard name and description', () => {
export const addTranslationsForDashboardNameAndDescription = () => {
    const now = new Date().toUTCString()
    norwegianTitle = 'nor title ' + now
    norwegianDesc = 'nor desc ' + now

    clickEditActionButton('Translate')
    cy.contains('Select locale').click()
    cy.contains('Select locale').type('Norwegian{enter}')
    cy.get('[placeholder="Name"]').clear()
    cy.get('[placeholder="Name"]').type(norwegianTitle)
    cy.get('[placeholder="Description"]').clear()
    cy.get('[placeholder="Description"]').type(norwegianDesc)
    cy.get('button').contains('Save', EXTENDED_TIMEOUT).click()
}

// Then('Norwegian title and description are displayed', () => {
export const expectNorwegianTitleAndDescriptionToBeDisplayed = () => {
    // set dblocale to Norwegian
    cy.request(
        'POST',
        `${getApiBaseUrl()}/api/userSettings/keyDbLocale`,
        'no'
    ).then((response) => {
        expect(response.status).to.equal(200)
    })

    // reload the dashboard
    cy.visit('/')

    cy.getBySel(dashboardTitleSel, EXTENDED_TIMEOUT)
        .should('be.visible')
        .and('contain', norwegianTitle)

    clickViewActionButton('More')
    cy.contains('Show description').click()

    cy.get(dashboardDescriptionSel)
        .should('be.visible')
        .and('contain', norwegianDesc)

    clickViewActionButton('More')
    cy.contains('Hide description').click()
}

// FIXME
describe.skip('Translate title and description', () => {
    it('creates a new dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT).log(Cypress.env('dhis2BaseUrl'))
        startNewDashboard()
        addDashboardTitle(TEST_DASHBOARD_TITLE)
        addDashboardItems()
        saveDashboard()
        expectDashboardToDisplayInViewMode(TEST_DASHBOARD_TITLE)
    })

    it('adds translations to a dashboard and save dashboard', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        //     And I add translations for dashboard name and description
        //     And dashboard is saved
        //     Then Norwegian title and description are displayed
    })

    // FIXME
    it('adds translations to a dashboard and discard dashboard changes', () => {
        cy.visit('/', EXTENDED_TIMEOUT)
        openDashboard(TEST_DASHBOARD_TITLE)
        chooseToEditDashboard()
        //     And I add translations for dashboard name and description
        clickEditActionButton('Exit without saving')
        //     Then Norwegian title and description are displayed
    })

    it('deletes the dashboard', () => {
        // FIXME
    })
})
