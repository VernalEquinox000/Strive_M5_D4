/*
     Students Portfolio Repo
     
     You are in charge of creating a Student Portfolio Repo for both Frontend and Backend.
     In this last "step" the application should enable file upload & reviews.
     A review could be posted by a user to whatever project he likes.
     A review is defined by:
     - projectID
     - name
     - text
     - date
     
     //BACKEND
     You are in charge of building the Backend using NodeJS + Express. The backend should include the extra following routes:
     POST /students/id/uploadPhoto => uploads a picture (save as idOfTheStudent.jpg in the public/img/students folder) for the student specified by the id. Add a field on the students model called image, in where you store the newly created URL (http://localhost:3000/img/students/idOfTheStudent.jpg)
     POST /projects/id/uploadPhoto => uploads a picture (save as idOfTheProject.jpg in the public/img/projects folder) for the project specified by the id. Add a field on the project model called image, in where you store the newly created URL (http://localhost:3000/img/projects/idOfTheProject.jpg)
     
     Configure Express to use the public folder to serve static files
     
     
     GET /projects => returns the list of projects
     GET /projects/id => returns a single project
     POST /projects => create a new project (Add an extra property NumberOfProjects on student and update it every time a new project is created)
     PUT /projects/id => edit the project with the given id
     DELETE /projects/id => delete the project with the given id
     
     GET /projects/id/reviews => get all the reviews for a given project
     POST /projects/id/reviews => add a new review for the given project
     [EXTRA] Edit & Delete
     
     //FRONTEND (extra)
     You are in charge of building the Frontend too. Use ReactJS to create an application for managing the students.
     Add the following features for the application
     - The user should be able to upload a picture for any given student
     - The user should be able to upload a picture for any given project
     - Create a component Avatar with picture and Name of the student. Use it on students' listing.
     - Change the Project Component to show the picture uploaded and the Reviews */