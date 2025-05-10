Run A Race App - by up2158859

## Key features

My app's core features include: a simple login page, a timer/stopwatch, a list of all previous races recorded by the current user, and a light/dark mode accessibility feature


### Login Page

The login page is the first page seen by new users. For now, it only takes a username value from the user and compares it with a list of pre-approved usernames in the app. I had some issues with navigation surrounding the login page which is mentioned later on. I also added a small message in the bottom left of the screen to display to the user who is currently logged in, I styled this message to be sticky so that regardless of scrolling, its always visible.


### Timer/Stopwatch

My race timer is ideally the first place a user would navigate to after opening the app, hence its placement in the UI. I decided to use icons for my labels on the home page (i.e. stopwatch icon directs to the timer page), as I thought that the icons were recognisable and would lead to a more readable layout when viewed on mobile and smaller devices.
The timer has 4 buttons associated with it: 'start/stop', 'record time', 'reset', and 'export results'. I wanted the design of the page to have the race timer in a very large font at the top of the page so it can be easily visible, with the list of results at the bottom half of the page updating with each result recorded. For the 'start/stop' and 'record lap' buttons, I decided to use bright colours that would stand out against both light and dark backgrounds, to make them easily found. I used a mixture of icons and text labels for the buttons on this page, with understandable icons for the main two buttons, and more descriptive text labels for the less recognisable functions.


### Previous Races

My previous races page is reached by clicking the bottom half of the home page, and features a list of all exported race results from the currently logged-in user. For quite a while I originally had the list contain race results exported from all users, before I realised that users would only want to see their own races. As well as this, the original design included 'delete' buttons, however they were not present on this page, you would have to click on the race for the button to appear. I changed this later on to make it simpler and easier to navigate and use this part of the app. The design of the page is very simple, with the race date, time, and ID present on each button so users can be sure they're clicking the correct one. 


### Light/dark Mode

The light/dark mode feature is accessible via the settings page, and was something that I knew I wanted to add from the beginning, despite it being one of the last additions to the app. It was a challenge withing the CSS to modify certain colours and variables to accommodate the function, but it allowed me to tidy up some of my CSS in the process. I originally used an icon for this button aswell, however I soon realised that it wasn't immediately obvious what the button would do, so reverted to a text label for better readability. 


## AI

I used both ChatGPT and Deepseek occasionally throughout the creation of my app - sometimes for quick solutions to very simple mistakes that I completely overlooked, other times for help understanding how to create a certain function. Oftentimes I would give AI a prompt and it would provide me with whole functions as a response, which I did not want, so I made sure to never just copy/paste anything from the AI, and if using generated functions as examples, I always made sure to understand exactly what does what, and why it does what it does. Throughout the development of the app I have had consistent issues with my back button on the app's navbar, where the button is very inconsistent and unreliable, I used AI a few times to try and see if it could identify the issue, however it seems that any solution it provided would result in the same problem arising. Therefore, I abandoned the route I was going down with the AI and hardcoded some of the functions of the back button, resulting in bugs still being present with it, but fewer than previously.

### Prompt(s) to develop app routing, and list of previous races

I had an issue when turning my app into an SPA. I ended up with some duplicate functions and mixed approaches to routing, which caused confusion and issues within the app. I used these prompts to help identify what the issue was, before modifying my code to fix it -

>  within my app ive managed to get the app to navigate properly to the race-details page, however im struggling to see why it wont correctly navigate to the race-details page of the specific race that was clicked, what could be causing the issue?

-  The response to this prompt was initially not very helpful as I hadn't provided enough context with my existing code, so after that was provided, I was able to quickly see the issue with duplicate functions and app routing errors, which I could fix relatively quickly

>  sorry here is the relevant code from my race-details.js, i think maybe there are some conflicting functions?

-  This response was much more helpful as I had provided the context necessary to help the AI find what the problem was in my code, this is an example where it did provide some immediate solutions in the form of generated functions, however I didn't fully understand what the functions were doing straight away, so used further prompts to help me understand completely before implementing

### Prompt(s) to develop light/dark mode functionality

I knew I wanted my light/dark mode function from the beginning and had an idea with how it would have to be implemented but wasn't 100% sure on all the correct syntax and ways to make it function, so I used some prompts to give me a helping hand with the implementation -

>  ive got the following css variables defined in my styles.css page and want to implement a dark/light mode which can be toggled within the app, can you help me with a simple method of implementing it? will the current variables work with what im trying to do?

-  This response was very helpful as I already had a base idea of what needed to be done so the extra little help was great and allowed me to quickly add the theme function to the app, it also allowed me to improve my CSS in general, using variables more often leading to less hard coded colour values, improving maintainability

### Prompt(s) to develop the UI

Further with my styles.css, I had an issue when moving the 'delete' button onto the previous races page. I knew the UI layout that I wanted, and for some reason I couldn't achieve it no matter what I tried, so I tried to use a prompt to help me with the problem -

>  im trying to style the following page to have the current delete button on the right hand side with the race item to the left of it, however despite using flexbox i cant seem to get it to work how im intending, can you see what im doing wrong?

-  I asked a very similar prompt a couple times for this exact issue because every time the solutions were not working, and I eventually discovered the underlying problem on my own, which was very simple (i had defined an id but was calling a class in CSS) however the AI could not see the issue so in this case it may have been better to not rely on the AI to find my very small errors


## Overall State


### Bugs

There are a few bugs that I am aware of but simply didn't solve in time to submit the app -

-  If the user logs into the app, and then presses the back button in the **browser** (not the application navbar), they return to the login page whilst still logged in
-  When there are multiple races displayed on the previous races page - if the user clicks on one of the races to display its results, and then uses the app's navbar to go back to the list of races, the race details pages stop working when races are clicked on. Workaround for this is to used browser back buttons (unreliable) or click the logo on the navbar to return home
-  Occasionally, when the user attempts to delete a race, a confirm message will appear twice, and an alert will pop-up saying 'Failed to delete race', however the race will still be deleted as intended
-  A few consistency issues when using on a mobile (I visited myip:8080, not sure if that prevents certain features from functioning) such as the the back button not working when on settings page
