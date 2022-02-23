const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    it('should save new Structure automatic today data', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            const now = new Date();
            const currentYear = now.getFullYear().toString();
            const currentMonth = (now.getMonth() + 1)
                .toString()
                .padStart(2, '0');
            const currentDay = now.getDate().toString().padStart(2, '0');

            cy.intercept('PATCH', '/api/structure/**').as('patch');

            cy.get('[data-testId="today-enddate"]').click();

            cy.get(`[data-testid="Noms#${id}-save-button"]`).click();

            cy.wait('@patch');

            cy.reload();

            cy.get(`[data-field="update/structure@names#${id}_endDateDay"]`)
                .find('select')
                .should('have.value', currentDay);
            cy.get(`[data-field="update/structure@names#${id}_endDateMonth"]`)
                .find('select')
                .should('have.value', currentMonth);
            cy.get(`[data-field="update/structure@names#${id}_endDateYear"]`)
                .find('select')
                .should('have.value', currentYear);
        });
    });

    it('should save new Structure automatic today data', () => {
        cy.getCookie('nameId').then((cookie) => {
            const id = cookie.value;

            cy.get('[data-testId="today-enddate"]').click();

            cy.get('[data-testId="btn-delete-enddate"]').click();

            cy.get(`[data-field="update/structure@names#${id}_endDateDay"]`)
                .find('select')
                .should('have.value', null);
            cy.get(`[data-field="update/structure@names#${id}_endDateMonth"]`)
                .find('select')
                .should('have.value', null);
            cy.get(`[data-field="update/structure@names#${id}_endDateYear"]`)
                .find('select')
                .should('have.value', null);
        });
    });
});
