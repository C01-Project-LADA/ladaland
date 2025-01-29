* User stories should follow the format as taught in the lecture, along with proper acceptance criteria.

* All user stories should be documented in JIRA.
* JIRA access should be provided to assigned TA before the sprint ends.

* STORIES:

1. As a future user, I want to be able to create an account with a unique username, secure password, email address and optional phone number, so that I can have a unique LADA Land account.
* Acceptance Criteria:
    * Given the user provides a unique username, valid email, secure password, and (optionally) a phone number, when they submit the registration form, then the system should create an account and redirect the user to the login page.
    * Given the user enters a username that already exists in the system, when they attempt to register, then they should receive an error message: “Username is already taken. Please choose another one.”
    * Given the user enters an email in an incorrect format, when they try to submit the form, then they should receive an error message: “Please enter a valid email address.”
    * Given the user leaves the username, email, or password fields empty, when they attempt to register, then the system should display an error message indicating which fields are required.

2. As an existing user, I want to be able to log into my account using my unique username and secure password, so that I can can keep track of my travel progress, points, leaderboard, and posts on LADA Land.
* Acceptance Criteria:
    * Given the user enters a valid username and correct password, when they click the "Log In" button, then they should be successfully logged into their account and redirected to their dashboard.
    * Given the user enters an invalid or non-existing username and/or password, when they click "Log In", then they should see an error message saying "Incorrect username and/or password."
    * Given the user does not enter a username or password, when they click "Log In", then they should receive an error message: "Please fill in both fields to log in."

3. As an existing user, I would like to mark the countries I’ve visited on a map, so that I can visualize my travel history in a fun way.
* Acceptance Criteria:
    * Given the user is logged in and viewing the world map, when they select a country and mark it as "visited," then the country should change color to green and be saved to their profile.
    * Given the user has already marked a country as visited, when they click on it again and choose “Remove from visited,” then the country should revert to its default color and be removed from their travel history.

4. As an existing user, I want to be shown the percentage of countries I've visited, so that I can track my progress and feel motivated to visit more places.
* Acceptance Criteria:
    * Given the user is logged in and viewing the world map, when they view their travel map, then the system should display a message like: "You have visited X/195 countries, which is Y% of the world!" (even if user didn't mark any countries, then it should still say 0%).
    * Given the user adds or removes a country as visited, when they view their travel percentage, then the percentage should update in real time to reflect the new total.
    * Given the total number of visited countries is calculated, when the percentage is displayed, then it should be rounded to two decimal places for clarity.

5. Аs an existing user, I would like to see a leaderboard of top travelers, so that I can see others' progress, compete with them, and stay motivated to explore more.
* Acceptance Criteria:
    * Given the user is logged in, when they navigate to the leaderboard page, then they should see a ranked list of top travelers based on the number of countries visited.
    * Given the user is logged in, when they select a sorting option, then the leaderboard should update to display rankings based on different criteria (such as most countries visited or most points earned).
    * Given the user is logged in, when they navigate to the leaderboard page, then their ranking should be highlighted with a message like "You are ranked #15 out of 100 travelers!"

6. Аs an existing user, I would like to input my budget and receive travel suggestions, so that I can explore options within my financial means.
* Acceptance Criteria:
    * Given the user is logged in, when they enter a budget amount in CAD, then the system should return a list of suggested destinations within that budget.
    * Given the user enters a very low budget, when there are no available travel options, then they should receive a message: "No destinations found within this budget."

7. Аs an existing user with more than one passport or with a specific passport, I would like to see the visa requirements for different countries, so that I can plan my trips without surprises.
* Acceptance Criteria:
    * Given the user is logged in, when they enter their passport country, then the system should display visa requirements for all countries based on that passport.
    * Given the user has more than one passport, when they enter both passport countries, then the user should see options for all passports.

8. Аs an existing user, I would like to post about my trips and experiences, so that I can share them with others and inspire other travelers.
* Acceptance Criteria:
    * Given the user is logged in, when they navigate to the “Create Post” section and enter text, images, or videos, then they should be able to successfully submit the post, which will appear in the travel feed.
    * Given the user has already created a post, when they choose "Delete Post," then the post should be permanently removed from the travel feed.

9. Аs an existing user, I would like to rate other travellers' posts by liking or disliking them, so that I can express my opinion on the quality of the post. 
* Acceptance Criteria:
    * Given the user is logged in and viewing a travel post, when they click the "Like" button, then the like count should increase by one, and their interaction should be saved.
    * Given the user has already liked a post, when they click the "Like" button again, then their like should be removed, and the like count should decrease by one.
    * Given the user is logged in and viewing a post, when they click the "Dislike" button, then the dislike count should increase by one, and their interaction should be saved.
    * Given the user has already disliked a post, when they click the "Dislike" button again, then their dislike should be removed, and the dislike count should decrease by one.
    * Given the user has already liked a post, when they click the "Dislike" button, then their like should be removed, and the dislike should be added instead.
    * Given the user has already disliked a post, when they click the "Like" button, then their dislike should be removed, and the like should be added instead.
    * Given the user is logged in and viewing a travel post, when they look at the number of likes and dislikes for the post, then they should see the total number of likes and dislikes.

10. Аs an existing user, I would like to comment on other travellers' posts, so that I can share my own ideas, thoughts and opinions related to the topic.
* Acceptance Criteria:
    * Given the user is logged in and viewing a post, when they enter text in the comment box and click "Post Comment," then their comment should appear below the post.
    * Given the user has posted a comment, when they select "Delete Comment," then the comment should be permanently removed.
    * Given a post has multiple comments, when the user looks at them, then they should be paginated with a button giving the option to see more comments.
    * Given a post has multiple comments, when the user scrolls through them, then there should be a sorting option to display the comments based on most recent, most liked, or most disliked.
    * Given the user is viewing comments on a post, when they click the "Like" button on a comment, then the like count should increase by one.
    * Given the user is viewing comments on a post, when they click the "Dislike" button on a comment, then the dislike count should increase by one.

11. Аs an existing user, I would like to be able to 'favourite' destinations, so that I can plan future trips and stay organized.
* Acceptance Criteria:
    * Given the user is logged in and viewing a destination page, when they click the "Add to Favourites" button, then the destination should be saved to their favourites list, and the button text should change to "Favourited" instead of "Add to Favourites."
    * Given the user is browsing a list of destinations, when they scroll through destinations they have previously favourited, then those destinations should display the label "Favourited" instead of "Add to Favourites."
    * Given the user has already favourited a destination, when they click the "Favourited" button again, then the destination should be removed from their favourites list, and the button should revert to "Add to Favourites."

12. Аs an existing user, I would like to rate a destination I've been to, so that I can share with others how much I liked or disliked a place.
* Acceptance Criteria:
    * 
13. Аs an existing user, I would like to earn 20 points for each post I make about my travel experience, so that I can level up and feel motivated to share my experiences with others.
* Acceptance Criteria:
    * 
14. Аs an existing user, I would like to earn 10 points for each valuable comment I make under someone else's post, so that I can feel motivated to engage with others on the platform. 
* Acceptance Criteria:
    * 
15. Аs an existing user, I would like to add tags related to a country, city and/or destination I visited on my post, so that these posts can be discovered by others searching for a specific category.
* Acceptance Criteria:
    * 
16. Аs an existing user, I would like to search for posts based on country, city and destination tags, so that I can easily find relevant content for my next trip.
* Acceptance Criteria:
    * 
17. Аs an existing user, I would like to level up based on my travel activity and points, so that I feel a sense of achievement.
* Acceptance Criteria:
    * 
18. Аs an existing user, I would like to see if a destination is marked as a 'local quest', so that I know that I'll receive extra points for visiting it on my trip.
* Acceptance Criteria:
    * 
19. Аs an existing user, I would like to sort posts based on most/least liked, and most/least recent, so that I can quickly find the most relevant, popular, or latest travel experiences that interest me. 
* Acceptance Criteria:
    * 
20. Аs an existing user, I would like to sort destinations based on most/least liked, so that I can easily find the most popular or least recommended places based on community feedback.
* Acceptance Criteria:
    * 
21. Аs an existing user, I would like to receive points for every few 'likes' that I get on my posts, so that I am motivated to share high-quality content and engage more with the community. 
* Acceptance Criteria:
    * 
22. Аs an existing user, I would like to add a destination to 'next trip', so that I can see everything in one place related the next trip I want to go on.
* Acceptance Criteria:
    * 
23. Аs an existing user, I would like to access my saved 'favourites' so that so that I can quickly find destinations, posts, or experiences that interest me without searching for them again.
* Acceptance Criteria:
    * 
24. Аs an existing user, I would like to access my saved 'next trip' ideas so that I can see all destinations in one view to easily compare options, plan my itinerary, and make informed travel decisions.
* Acceptance Criteria:
    * 
25. Аs an existing user, I would like to see how much my trip will cost me before travel expenditures, so that I can budget accordingly and avoid unexpected expenses.
* Acceptance Criteria:
    * 