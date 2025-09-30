# GameStore Application
The GameStore application manages an inventory of video games — both classic and modern. It allows users to:
- Search and view a list of games
- See details such as price, rating, and release date
- Add new games to the inventory
- Update details of an existing game
- Delete games that are no longer available
- Filter, sort, and paginate game listings for faster browsing

This project was built as a demonstration of a full-stack application using CRUD (Create, Read, Update, Delete) operations along with enhanced querying features.

## Technologies Used
### Backend
- Java 1.8
- Spring Boot
- Hibernate ORM
- PostgreSQL,
### Frontend
- Angular v11
- TypeScript
- HTML/CSS
- Bootstrap
- Angular Material (UI components)
- Font Awesome (icons)
### Environment/Tools
- Apache Tomcat
- Visual Studio Code

## Features
- Full CRUD operations for video games
- Advanced filtering and sorting options
- Pagination for large game libraries
- Responsive UI styled with Angular Material
- Iconography powered by Font Awesome

## Setup Instructions 
### Backend (GameStoreMS)
1. Open GameStoreMS project within Eclipse.
2. Run as a Spring Boot App.
3. This will initialize the PostgreSQL database and start the backend API. Then, open GameStoreApp within
VS Code, open terminal and run command 'ng serve -o' to render the view of the application within the browser.
### Frontend (GameStoreApp)
1. Open the GameStoreApp project in VS Code.
2. In the terminal, run: `ng serve -o`
3. The application will open in your browser (default: http://localhost:4200).
