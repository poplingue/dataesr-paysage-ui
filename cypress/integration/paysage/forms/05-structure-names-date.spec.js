const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should save new Structure full date data', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-field="update/structure@names#1_startDateDay"]')
            .find('select')
            .select('04');
        cy.get('[data-field="update/structure@names#1_startDateMonth"]')
            .find('select')
            .select('08');
        cy.get('[data-field="update/structure@names#1_startDateYear"]')
            .find('select')
            .select('2000');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.wait('@patch');

        cy.reload();

        cy.get('[data-field="update/structure@names#1_startDateDay"]')
            .find('select')
            .should('have.value', '04');
        cy.get('[data-field="update/structure@names#1_startDateMonth"]')
            .find('select')
            .should('have.value', '08');
        cy.get('[data-field="update/structure@names#1_startDateYear"]')
            .find('select')
            .should('have.value', '2000');
    });

    it('should save new Structure partial date data', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-field="update/structure@names#1_startDateMonth"]')
            .find('select')
            .select('05');
        cy.get('[data-field="update/structure@names#1_startDateYear"]')
            .find('select')
            .select('2013');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.wait('@patch');

        cy.reload();

        cy.get('[data-field="update/structure@names#1_startDateDay"]')
            .find('select')
            .should('have.value', null);
        cy.get('[data-field="update/structure@names#1_startDateMonth"]')
            .find('select')
            .should('have.value', '05');
        cy.get('[data-field="update/structure@names#1_startDateYear"]')
            .find('select')
            .should('have.value', '2013');
    });

    it('should save new Structure automatic first January data', () => {
        const now = new Date();
        const currentYear = now.getFullYear().toString();

        cy.get('a[href="/update/structure"]').click();

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-testId="firstJanuary-startdate"]').click();

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.wait('@patch');

        cy.reload();

        cy.get('[data-field="update/structure@names#1_startDateDay"]')
            .find('select')
            .should('have.value', '01');
        cy.get('[data-field="update/structure@names#1_startDateMonth"]')
            .find('select')
            .should('have.value', '01');
        cy.get('[data-field="update/structure@names#1_startDateYear"]')
            .find('select')
            .should('have.value', currentYear);
    });

    it('should save new Structure automatic today data', () => {
        const now = new Date();
        const currentYear = now.getFullYear().toString();
        const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        const currentDay = now.getDate().toString().padStart(2, '0');

        cy.get('a[href="/update/structure"]').click();

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-testId="today-enddate"]').click();

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.wait('@patch');

        cy.reload();

        cy.get('[data-field="update/structure@names#1_endDateDay"]')
            .find('select')
            .should('have.value', currentDay);
        cy.get('[data-field="update/structure@names#1_endDateMonth"]')
            .find('select')
            .should('have.value', currentMonth);
        cy.get('[data-field="update/structure@names#1_endDateYear"]')
            .find('select')
            .should('have.value', currentYear);
    });

    it('should save new Structure automatic today data', () => {
        const now = new Date();

        cy.get('a[href="/update/structure"]').click();

        cy.intercept('PATCH', '/api/structure/**').as('patch');

        cy.get('[data-testId="today-enddate"]').click();

        cy.get('[data-testId="btn-delete-enddate"]').click();

        cy.get('[data-field="update/structure@names#1_endDateDay"]')
            .find('select')
            .should('have.value', null);
        cy.get('[data-field="update/structure@names#1_endDateMonth"]')
            .find('select')
            .should('have.value', null);
        cy.get('[data-field="update/structure@names#1_endDateYear"]')
            .find('select')
            .should('have.value', null);
    });
});
