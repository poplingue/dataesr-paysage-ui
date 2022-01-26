const baseUrl = Cypress.env('baseUrl');

context('Structure new form', () => {
    beforeEach(() => {
        cy.signIn();
        cy.visit(`${baseUrl}/update`);
    });

    afterEach(() => {
        cy.signOut();
    });

    it('should save new Structure officialName data', () => {
        cy.wait(100);
        cy.get('a[href="/update/structure"]').click();

        cy.get('[data-testid="officialName"]').find('input').type('Offiffi');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.reload();

        cy.get('[data-testid="officialName"]')
            .find('input')
            .should('have.value', 'Offiffi');
    });

    it('should save new Structure infinite otherName data', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .type('OtherName#1');

        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-field="update/structure@names#1_otherName#1"]')
            .find('input')
            .type('OtherName#2');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.reload();

        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .should('have.value', 'OtherName#1');

        cy.get('[data-field="update/structure@names#1_otherName#1"]')
            .find('input')
            .should('have.value', 'OtherName#2');
    });

    it('should save new Structure article data', () => {
        cy.get('a[href="/update/structure"]').click();

        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .type('OtherName#1');

        cy.get('[data-testid="noms#1-save-button"]').click();
        cy.reload();

        cy.get('[data-field="update/structure@names#1_otherName#0"]')
            .find('input')
            .should('have.value', 'OtherName#1');
    });
});
