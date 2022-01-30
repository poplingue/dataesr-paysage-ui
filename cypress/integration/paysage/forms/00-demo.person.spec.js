const baseUrl = Cypress.env('baseUrl');

context('Person form page', () => {
    beforeEach(() => {
        cy.deleteIndexDB();
        cy.visit(`${baseUrl}/demo/person`);
    });

    it('should render idRef input field', () => {
        cy.get('[data-testid="idref"]')
            .find('input')
            .type('12345')
            .should('have.value', '12345');
    });

    it('should add an infinite input field Autre dénomination', () => {
        cy.get('[data-testid="otherName"]').find('input').type('Maggie Smith');
        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-field="demo/person@denomination_otherName#1"]').should(
            'exist'
        );
        cy.get('[data-testid="btn-delete-autredenomination#1"]').should(
            'exist'
        );
    });

    it('should delete infinite input field', () => {
        cy.get('[data-testid="otherName"]').find('input').type('Maggie Smith');
        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-testid="btn-delete-autredenomination#1"]').click();
        cy.get('[data-field="demo/person@denomination_otherName#1"]').should(
            'not.exist'
        );
        cy.get('[data-testid="btn-delete-autredenomination#1"]').should(
            'not.exist'
        );
    });

    it('should create multiple infinite input field', () => {
        cy.get('[data-field="demo/person@denomination_otherName#0"]')
            .find('input')
            .type("Il n'y a de divinité");
        cy.get('[data-testid="btn-add"]').click();
        cy.scrollTo(0, 300);
        cy.get('[data-field="demo/person@denomination_otherName#1"]')
            .find('input')
            .type("qu'Allah");
        cy.get('[data-testid="btn-add"]').click();
        cy.scrollTo(0, 300);
        cy.get('[data-field="demo/person@denomination_otherName#2"]')
            .find('input')
            .type('et Mahomet est');
        cy.get('[data-testid="btn-add"]').click();
        cy.scrollTo(0, 300);
        cy.get('[data-field="demo/person@denomination_otherName#3"]')
            .find('input')
            .type('son messager');

        cy.get('[data-field="demo/person@denomination_otherName#0"]')
            .find('input')
            .should('have.value', "Il n'y a de divinité");
        cy.get('[data-field="demo/person@denomination_otherName#1"]')
            .find('input')
            .should('have.value', "qu'Allah");
        cy.get('[data-field="demo/person@denomination_otherName#2"]')
            .find('input')
            .should('have.value', 'et Mahomet est');
        cy.get('[data-field="demo/person@denomination_otherName#3"]')
            .find('input')
            .should('have.value', 'son messager');
    });

    it('should check', () => {
        cy.get('[data-cy="notsatisfied"] label').click();
        cy.get('[data-cy="notsatisfied"]').find('input').should('be.checked');
    });

    it('should uncheck on Label click', () => {
        cy.get('[data-cy="satisfied"] label').click();
        cy.get('[data-cy="satisfied"] label').click();
        cy.get('[data-cy="satisfied"] input').should('not.be.checked');
    });
});
