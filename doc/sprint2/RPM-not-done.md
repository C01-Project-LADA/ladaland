# Release Plan

## Release Name: 0.2.0

## Release Objectives

### Primary Goals

### Specific Goals

- **Show % of Countries Visited:**  
  As an existing user, I want to be shown the percentage of countries I've visited so that I can track my progress and feel motivated to visit more places.

- **Mark Visited Countries on the Globe/Map:**  
  As an existing user, I would like to mark the countries I’ve visited on a world globe so that I can visualize my travel history in a fun way.

- **Basic Social Media Functionalities:**  
  As an existing user, I would like to create, share, and delete travel posts, as well as like, dislike, and comment on other users' posts, so that I can share my trip details as well as get insights from other users' trips.

- **Introduce Earning Points For Interacting With the App:** 
  Аs an existing user, I would like to earn points for each post I make about my travel experience and how many likes my posts get, so that I can level up and feel motivated to share my experiences with others in an interesting format.

- **Logout Functionality:** 
  As a logged in user, I would like to be able to log out of my account, so that I can login with another account and/or not worry that someone will use my account without me knowing.

### Metrics for Measurement

- Each feature is associated with user stories that are divided into CORE and CLIENT tickets.
- Progress will be tracked by ensuring that all tickets for each feature, including integration tickets, are completed.

## Release Scope

### Included Features
- **Show % of Countries Visited:**  
  As an existing user, I want to be shown the percentage of countries I've visited so that I can track my progress and feel motivated to visit more places.

- **Mark Visited Countries on the Globe/Map:**  
  As an existing user, I would like to mark the countries I’ve visited on a world globe so that I can visualize my travel history in a fun way.

- **Basic Social Media Functionalities:**  
  As an existing user, I would like to create, share, and delete travel posts, as well as like and dislike other users' posts, so that I can share my trip details as well as get insights from other users' trips.

- **Introduce Earning Points For Interacting With the App:** 
  Аs an existing user, I would like to earn points for each post I make about my travel experience and how many likes my posts get, so that I can level up and feel motivated to share my experiences with others in an interesting format.

- **Logout Functionality:** 
  As a logged in user, I would like to be able to log out of my account, so that I can login with another account and/or not worry that someone will use my account without me knowing.

- **[Core] Comment on travel posts:**  
  As an existing user, I would like to comment on other travellers' posts, so that I can share my own ideas, thoughts and opinions related to the topic.

- **[Core] Earn points for comments:** 
  Аs an existing user, I would like to earn 5 points for each valuable comment I make under someone else's post, so that I can feel motivated to engage with others on the platform.

- **[Core] Earn points for liked posts:** 
  Аs an existing user, I would like to receive points for every few 'likes' that I get on my posts, so that I am motivated to share high-quality content and engage more with the community.

### Excluded Features

- CLIENT Tickets for:
  - AI Budget-Based Travel Suggestions
  - Comment on travel posts
  - Earn points for comments
  - Earn points for liked posts

  **Reasoning:** Client tickets have been very time consuming; however, they rely heavily on the backend functionality being put in place for integration purposes, so we feel comfortable being ahead on core work.

### Bug Fixes

- None

### Non-Functional Requirements

- **Performance:**  
  Our site should load all pages within 2 seconds.
- **Security:**  
  We utilize Express Session to ensure security for our site and user authentication.
- **Usability:**  
  We are using the Shadcn/UI library along with a consistent color palette for consistency across the site in both style and feel.

### Dependencies and Limitations

- **External Dependencies:**  
  OpenAI API, Shadcn/UI, Radix
- **Known Limitations:**  
  The Visa Requirement Tool depends on a static CSV file that is imported into the database.

---

## Additional Organizational Considerations

### Deployment Instructions

*Note:* I would complete this section by ensuring there is a **very detailed** step-by-step instruction on how to perform each operation needed for deployment. Personally, I would see to it that deployment is as automated as possible due to human error risks.

1. **Pre-deployment Checks**
2. **Backup and Version Control**
3. **Deployment Execution Steps**
4. **Validation and Verification**

### Post Implementation Verification (PIV) Instructions

*Note:* I would complete this section by gathering acceptance criteria from our tickets and organizing the most important functionality into a test suite for testing in a UAT environment during a regression cycle prior to production release.

- **Verification Criteria:**  
  Outline key checks to confirm successful deployment.
- **User Acceptance Testing (UAT):**  
  Describe procedures to ensure end-user validation.

### Post Deployment Monitoring

*Note:* I would fill this out with a list of tools we use for monitoring and a consistent, in-depth method for diagnosing and responding to high and low priority bugs.

- **Monitoring Tools:**  
  Utilize metrics and dashboards to track performance.
- **Error Handling:**  
  Establish a process for identifying and resolving issues.

### Rollback Strategy

*Note:* I would fill this out by clarifying what sort of bug or issue warrants a rollback and then providing step-by-step instructions on how this would be done. Similar to deployment, I would like this to be as automated as possible to avoid human error.

- **Rollback Triggers:**  
  Define conditions that warrant a rollback.
- **Rollback Steps:**  
  Provide a detailed guide for reverting to the previous version.
- **Impact Analysis:**  
  Analyze and document risks associated with a rollback.
