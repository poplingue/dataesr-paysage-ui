context('Person form page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/person/create');
    });

    it('should display current page BreadCrumbs', () => {
        cy.get('[data-cy="current-page"]').find('a').should('have.text', 'Ajouter une personne');
    });

    it('should render idRef input field', () => {
        cy.clearIndexDB();

        cy.get('[data-testid="IdRef"]').find('input').type('12345').should('have.value', '12345');
    });

    it('should render infinite input field Autre dénomination', () => {
        cy.clearIndexDB();

        cy.get('[data-testid="Autre dénomination"]').find('input').type('Maggie Smith');
        cy.get('[data-testid="btn-add"]').click();

        cy.get('[data-field="person/create@denomination/autre-denomination#1"]').should('exist');
        cy.get('[data-testid="btn-delete"]').should('exist');

        cy.get('[data-testid="btn-delete"]').click();
        cy.get('[data-testid="btn-delete"]').should('not.exist');
    });

});
