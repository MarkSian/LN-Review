import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;



// Custom middleware to log request details
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Server static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse Form data
app.use(express.urlencoded({ extended: true }));

// Data storage for the project
let novels = [
    { id: 1, title: '"JoJos Bizarre Adventure', author: 'Hirohiko Araki', genre: 'Action' },
    { id: 2, title: 'Overlord', author: 'Kugane Maruyama', genre: 'Dark Fantasy' },
    { id: 3, title: 'Re:Zero', author: 'Tappei Nagatsuki', genre: 'Fantasy' }
];

let reviews = [
    { id: 1, novelId: 1, userId: 1, rating: 5, comment: 'Amazing character development and world building!' },
    { id: 2, novelId: 1, userId: 2, rating: 4, comment: 'Great world-building and love the dark setting' },
    { id: 3, novelId: 2, userId: 1, rating: 5, comment: 'Re:zero is a beautifully made light novel and the anime was adapted well.' }
];

let users = [
    { id: 1, username: 'lightnovel_fan', joinDate: '2024-01-19' },
    { id: 2, username: 'fantasy_person', joinDate: '2024-01-20' }
];

// Middleware For Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Routes

// Home Route
app.get('/', (req, res) => {
    res.render('index', { title: 'Light Novel Reviews' });
});


//app.listen to start the server *keep at the bottom of the file*
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


