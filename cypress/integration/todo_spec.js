context('Todo Frontend', () => {
    beforeEach(() => {
        cy.visit('localhost:8080/')
    })
    
    describe('Todo App', () => {
        it('Adds a Todo', () => {
            cy.get('.addTask-text').type('testTask')
            cy.get('.addTask-btn').click()
            cy.get('form').find('li').last().should('have.text', 'testTask')
        })
        
        it('Completes a Todo', () => {
            cy.get('form').find('li').last().find('input').check()
            cy.get('.removeTask-btn').click()
            cy.contains('testTask').should('have.text', 'testTask')
        })
    })
})