# ProMan :rocket:

---

### ProMan is a project management tool designed to help teams streamline their workflow using the Kanban methodology. With its intuitive UI, customizable boards, and efficient task management capabilities, ProMan is the go-to solution for teams looking to supercharge their project delivery.

---

## Features :star:

- **Customizable Boards**: Create, customize and manage multiple boards to match your project's requirements.
- **Advanced Task Management**: Add, edit, archive, or delete tasks with ease. 
- **User Management**: Register, login, and manage user profiles.
- **Interactive Modals**: Utilize dynamic modals for user interactions.
- **Drag & Drop**: Easily change task statuses with intuitive drag & drop functionality.
- **Activity History**: Keep track of all activities and changes made in the project.

---

## Technologies Used :wrench:

![JavaScript](https://img.icons8.com/color/48/000000/javascript.png) ![HTML5](https://img.icons8.com/color/48/000000/html-5.png)
- **CSS3** ![CSS3](https://img.icons8.com/color/48/000000/css3.png)
- **Python** ![Python](https://img.icons8.com/color/48/000000/python.png)
- **Flask** ![Flask](https://img.icons8.com/color/48/000000/flask.png)
- **PostgreSQL** ![PostgreSQL](https://img.icons8.com/color/48/000000/postgreesql.png)

---

![App Screenshot](https://github.com/aneta-k/ProMan/blob/development/design-materials/READMEpage1.jpg)

---

## Project team :busts_in_silhouette:

- [Aneta Kuśnierz](https://github.com/aneta-k)
- [Tomek Citko](https://github.com/TomaszCitko)
- [Oskar Rudy](https://github.com/Ostin-Oskarose)

This was a group project and we dedicated two weeks of intensive work to bring ProMan to life.

---

## Requirements :clipboard:

- PostgreSQL version: 12.12
- Python version: 3.10.9

## Database Configuration :floppy_disk:

Before running ProMan, ensure you have PostgreSQL installed. Adjust the database connection settings in the application's configuration to match your setup (.env.template). You'll need to provide:

- Database name
- Username
- Password
- Host

## Database Setup :floppy_disk:

1. **Create the ProMan database**:
```bash
createdb proman
```

2. **Initialize the database with sample data**:
- Navigate to the project directory.
- Use the provided SQL script to set up the database schema and populate it with sample data:
```bash
psql proman -f proman_sample_data.sql
```

Remember to adjust the database connection settings in the application configuration to match your setup.

## Installation and Running :gear:

1. **Clone the application**: 
    ```
    git@github.com:aneta-k/ProMan.git
    ```
2. **Navigate to the project directory and install dependencies**:
    ```
    cd ProMan
    pip install -r requirements.txt
    ```
3. **Start the application**:
    ```
    flask run
    ```
    The application will be accessible at: [http://localhost:5000](http://localhost:5000)
