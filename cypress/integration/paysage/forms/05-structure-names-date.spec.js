const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
        cy.newStructure();
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should save new Structure full date data', () => {
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
        cy.sectionsNoSticky();

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
        cy.get('[data-field="update/structure@names#1_startDateMonth"]')
            .find('select')
            .select('05', { force: true });
        cy.get('[data-field="update/structure@names#1_startDateYear"]')
            .find('select')
            .select('2013', { force: true });

        cy.get('[data-testid="noms#1-save-button"]').click({ force: true });
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
});
