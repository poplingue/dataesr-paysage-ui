context('App', () => {
    it('should load our app and show content', () => {
        cy.visit('http://localhost:3000')
        cy.contains('Plateforme d\'échanges et d\'informations de la DGESIP et de la DGRI')
    })
})
