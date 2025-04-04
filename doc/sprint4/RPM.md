# Release Plan

## Release Name: 0.4.0

## Release Objectives

### Primary Goals

### Specific Goals

- **Image uploads for posts:**  
  Аs an existing user, I would like to upload an image to my post about my trips and experiences so that I can share real footage with others and inspire other travelers.

- **[Client] AI Budget-based travel suggestions:**
  Аs an existing user, I would like to input my budget and receive travel suggestions, so that I can explore options within my financial means.

- **CI/CD:**  
  As an existing user or a potential new user, I want to go to [ladaland.com](https://ladaland.com/), so that I can use all of LADA LAND's wonderful features from any web browser.

- **Map Bug Fix:**
  Bug: When marking some countries as 'visited' (like France and Norway), it also implicitly selected other countries. For ex., when a user marked France as 'visited', it also marked Norway as 'visited' and vice versa. 
  Desired output: when user marks a country as 'visited', only that country should be marked as 'visited'.

### Metrics for Measurement

- Each feature is associated with user stories that are divided into CORE and CLIENT tickets.
- Progress will be tracked by ensuring that all tickets for each feature, including integration tickets, are completed.

## Release Scope

### Included Features
- **Image uploads for posts:**  
  Аs an existing user, I would like to upload an image to my post about my trips and experiences so that I can share real footage with others and inspire other travelers.

- **[Client] AI Budget-based travel suggestions:**
  Аs an existing user, I would like to input my budget and receive travel suggestions, so that I can explore options within my financial means.

- **CI/CD:**  
  As an existing user or a potential new user, I want to go to [ladaland.com](https://ladaland.com/), so that I can use all of LADA LAND's wonderful features from any web browser.


### Excluded Features

None

### Bug Fixes

- **Map Bug Fix:**
  Bug: When marking some countries as 'visited' (like France and Norway), it also implicitly selected other countries. For ex., when a user marked France as 'visited', it also marked Norway as 'visited' and vice versa. 
  Desired output: when user marks a country as 'visited', only that country should be marked as 'visited'.

### Non-Functional Requirements

- **Performance:**  
  Our site should load all pages within 2 seconds.
- **Security:**  
  We utilize Express Session to ensure security for our site and user authentication.
- **Usability:**  
  We are using the Shadcn/UI library along with a consistent color palette for consistency across the site in both style and feel.

### Dependencies and Limitations

- **External Dependencies:**  
  OpenAI API, Shadcn/UI, Radix, Google Cloud Storage Bucket
- **Known Limitations:**  
  The Visa Requirement Tool depends on a static CSV file that is imported into the database.

---

## Additional Organizational Considerations
  Not required for the term project.