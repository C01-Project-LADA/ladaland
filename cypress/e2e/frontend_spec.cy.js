/// <reference types="cypress" />

function generateRandomUser() {
    // Use a random number as a unique suffix.
    const randomSuffix = Math.floor(Math.random() * 1000000);
    const username = `testuser${randomSuffix}`;
    const email = `testuser${randomSuffix}@example.com`;
    return { username, email };
}

describe('User Registration', () => {
    beforeEach(() => {
        // Intercept the POST request for registration.
        cy.intercept('POST', 'http://localhost:4000/api/register').as('registerUser');
  
        // Visit the page with the registration UI.
        cy.visit('http://localhost:3000/welcome');
    });
  
    it('should register a new user with randomized username and email', () => {
        // Generate randomized credentials.
        const { username, email } = generateRandomUser();
  
        // Open the registration form.
        cy.get('#get-started').click({ force: true });
  
        // Fill out the registration form with the random username and email.
        cy.get('input').eq(0).type(username);
        cy.get('input').eq(1).type(email);
        cy.get('input').eq(2).type('password123');
        cy.get('input').eq(3).type('password123');
  
        // Submit the form.
        cy.get('button[type="submit"]').contains('SIGN UP').click();
  
        // Wait for the API call.
        cy.wait('@registerUser').its('response.statusCode').should('eq', 201);
  
        // Assert redirection to the home page.
        cy.url().should('eq', 'http://localhost:3000/home', { timeout: 15000 });
    });
});

describe('Create a Post', () => {
    beforeEach(() => {
      // Spy on the POST request for creating a post.
      cy.intercept('POST', 'http://localhost:4000/api/posts').as('createPost');
  
      // Spy on the GET requests for loading posts (we'll wait on these).
      cy.intercept('GET', /http:\/\/localhost:4000\/api\/posts.*/).as('getPosts');
  
      // Visit the Social page (assuming user is logged in or testIsolation is off).
      cy.visit('http://localhost:3000/social');
    });
  
    it('should create a post and display it in the feed', () => {
        // Wait for the initial posts to load
        cy.wait('@getPosts');
    
        // 1) Click the "LOCATION" text to trigger mapPinButtonRef
        cy.contains('LOCATION').click();
    
        // 2) Select "Albania" in the CountrySelectDialog
        cy.contains('button', 'Albania').click({ force: true });
    
        // 3) Type the post content
        const postContent = `Hello from Albania! ${Date.now()}`;
        cy.get('textarea[placeholder="What\'s on your mind?"]')
            .type(postContent);
    
        // 4) Click the POST button
        cy.contains('POST').click();
    
        // 5) Wait for the actual POST request to finish
        cy.wait('@createPost')
            .its('response.statusCode')
            .should('eq', 201);
    
        // 6) After creating a post, your app likely reloads the post list
        cy.wait('@getPosts');
    
        // 7) Verify the new post content is visible on the page
        cy.contains(postContent).should('be.visible');
    });
  });

describe('Logout Test', () => {
    beforeEach(() => {
        cy.intercept('POST', 'http://localhost:4000/api/logout').as('logout');
        cy.visit('http://localhost:3000/home'); // assume logged in
    });
  
    it('logs out on hover + click', () => {
        // Hover over "PROFILE" using the plugin
        cy.contains('PROFILE').realHover();
        
        // Wait briefly for openDelay
        cy.wait(200);
    
        // Click the "LOG OUT" button (now visible in the HoverCard)
        cy.contains('LOG OUT').should('be.visible').click();
    
        // Verify the logout request
        cy.wait('@logout').its('response.statusCode').should('eq', 200);
    
        // Confirm redirect to "/"
        cy.url().should('eq', 'http://localhost:3000/welcome');
    });
});