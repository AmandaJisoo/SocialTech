# SocialTech 

## Project Description
### Background
Homelessness has been a serious growing problem in the United States due to a growing shortage of affordable rental housing and increase in the cost of living. According to a report released by the U.S. Department of Housing and Urban Development (HUD), Washington State experienced a 6.2% increase in homelessness between 2019-2020, during which time 30 out of every 10,000 people in the state were homeless. The 2020 Point-in-Time count for Seattle/King County found 11,751 people experiencing homelessness on one night in January, with 53% sheltered and 47% unsheltered. It is important to care about the unsheltered homeless as it could often lead to isolation, a higher risk of mental illness, and physical vulnerability such as hate crime and disease. 
### Problem Statement
How might Individuals in need of shelter gain better access to shelter information so that they can make better-informed decisions about the condition and risk before arriving?


### Propsed solution
rWe aim to create platform that provides information on shelter to help individuals to find shelters that meets their need and concern. From our research, we learned that one bad experience or rumors on shelters make people hesitant to visit shelter for both new and experienced homeless. Therefore, creating an environment where everyone is welcomed to freely talk about their experience on shelters could reduce one’s concern/ fear on making visits on shelters

### Technical Description
#### Potential Architecture (might change in the future)
<img src="backend_design/homeless_shelter_design_proposal.png" width="800" height="600">

### User Stories
| Priority | User | Description |
| ----------- | ----------- | ----------- |
P0 | As a user |I want to share my experince on shelter by making post to share with others|
P0 | As a user |I want to do CRUD with information about a shelter on a post I made|
P0 | As a user |I want to be able to share images of shelters|
P0 | As a user |I want to be able to save a post about a shelter for future reference|
P0 | As a user |I want to be able to endorse a comment if I feel the information is important|
P0 | As a user |I want to do CRUD on a comment I made on the post|


### Endpoints
| load_overview | |
| --- | --- |
| load_overview | load overview of each shelter files |
| Request| zipcode (type: str) |
| Response |  
    {
    ids: [0, 7, 4]} represents id of each existing post|'
    }

| load_summary | |
| --- | --- |
| Load_summary | when user click on the overview image and full detail page is loaded |
| Request| post_id (type: num) |
| Response |
    {
    title: “Sweet Home”, rate: 3.5, tags: [“clean”, “food”, “warm”],address: [“zipcode”:98105, “street”: Main st, “City”: Seattle, State: “WA”]
    }

| load_comments | |
| --- | --- |
| load_comments | load existing comments on selected post |
| Request| post_id (type: num)|
| Response 
    {user_id:  str ex) “ed200,
    rate: num ex) 3.5, 
    Comment_body:str ex) “omg so good”, 
    tags: str[] ex) [“clean”, “food”, “warm”],
    likes: num ex) 135], 
    profile_pic: str ex)KEY_TO_S3_LOCATION}
    }

| create_comment | |
| --- | --- |
| create_comment | users create new comment |
| Request payload | 
    {   
            post_id: ex) num 2, 
            rate: num ex) 4.5,  
            username: num ex) “Ed”,
            comment: str ex)“Omgk”, 
            tags: str[] ex) [“clean”, “food”, “warm”], 
            img: str key to s3 locatoin ex)KEY_TO_S3_Object
    }

| update_comment | |
| --- | --- |
| update_comment | users update existing comment made on post|
| Request payload | 
    {   
            post_id: ex) num 2, 
            comment_id: num ex) 2, 
            rate: num ex) 4.5,  
            username: num ex) “Ed”,
            comment: str ex)“Omgk”, 
            tags: str[] ex) [“clean”, “food”, “warm”], 
            img: str key to s3 locatoin ex)KEY_TO_S3_Object
    }


| delete_comment | |
| --- | --- |
| delete_comment | user delete existing comment on the selected post|
| Request | comment_id(type: num), user_id(type: num)|
| Response |  N/A

| heart_comment | |
| --- | --- |
| heart_comment |handles users like/unlike comment|
| Request |comment_id(type: num), username (type: str) 
| Response |  N/A

| bookmark_comment | |
| --- | --- |
| bookmark_comment |user can bookmark post |
| Request |post_id(type: num), username(type: str)
| Response |  N/A

| create_post | |
| --- | --- |
| create_post |users create post|
| Request |title(type: str), zipcode(type: str),street:(type: str), city(type:str), state(type:str), 
| Response |  N/A

| edit_post | |
| --- | --- |
| create_post |users create post|
| Request |title(type: str), zipcode(type: str),street:(type: str), city(type:str), state(type:str), 
| Response |  N/A

### Data Models
Coming soon...

### Team Collaboation Rules
- create code review before pushing the code 
- work on local/seperate branch and later merge to main once code review is approved
- write clear comments on each commit to track workflow easier

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yern start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

