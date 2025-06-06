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

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Data storage for the project
let novels = [
    { id: 1, title: '"JoJos Bizarre Adventure', author: 'Hirohiko Araki', genre: 'Action' },
    { id: 2, title: 'Overlord', author: 'Kugane Maruyama', genre: 'Dark Fantasy' },
    { id: 3, title: 'Re:Zero', author: 'Tappei Nagatsuki', genre: 'Fantasy' }
];

let reviews = [
    { id: 1, novelId: 1, userId: 1, rating: 5, comment: 'Amazing character development and world building!' },
    { id: 2, novelId: 2, userId: 2, rating: 4, comment: 'Great world-building and love the dark setting' },
    { id: 3, novelId: 3, userId: 1, rating: 5, comment: 'Re:zero is a beautifully made light novel and the anime was adapted well.' }
];

let users = [
    { id: 1, username: 'lightnovel_fan', joinDate: '2024-01-19' },
    { id: 2, username: 'fantasy_person', joinDate: '2024-01-20' }
];



// Routes

// Home Route
app.get('/', (req, res) => {
    res.render('index', { title: 'Light Novel Reviews' });
});

// GET all novels
app.get('/novels', (req, res) => {
    // Filter by genre if query parameter exists
    const genreFilter = req.query.genre;
    let filteredNovels = novels;

    if (genreFilter) {
        filteredNovels = novels.filter(novel =>
            novel.genre.toLowerCase() === genreFilter.toLowerCase()
        );
    }

    res.render('novels', {
        title: 'Light Novels',
        novels: filteredNovels,
        genreFilter
    });
});

// GET novel by ID
app.get('/novels/:id', (req, res) => {
    const novel = novels.find(n => n.id === parseInt(req.params.id));
    if (!novel) return res.status(404).render('404', { title: 'Novel Not Found' });

    const novelReviews = reviews.filter(r => r.novelId === novel.id);
    res.render('novel-detail', {
        title: novel.title,
        novel,
        reviews: novelReviews
    });
});

// POST new novel
app.post('/novels', (req, res) => {
    const newNovel = {
        id: novels.length + 1,
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre
    };
    novels.push(newNovel);
    res.redirect('/novels');
});

// PUT update novel
app.put('/novels/:id', (req, res) => {
    if (!req.body) {
        return res.status(400).send('Bad Request: Missing request body');
    }

    console.log(req.body); // Debugging: Log the request body
    const novel = novels.find(n => n.id === parseInt(req.params.id));
    if (!novel) return res.status(404).render('404', { title: 'Novel Not Found' });

    // Novel properties
    novel.title = req.body.title || novel.title;
    novel.author = req.body.author || novel.author;
    novel.genre = req.body.genre || novel.genre;

    res.redirect(`/novels/${novel.id}`);
});

// DELETE novel by ID
app.delete('/novels/:id', (req, res) => {
    const novelIndex = novels.findIndex(n => n.id === parseInt(req.params.id));
    if (novelIndex === -1) return res.status(404).render('404', { title: 'Novel Not Found' });

    novels.splice(novelIndex, 1);
    // Also remove associated reviews
    reviews = reviews.filter(r => r.novelId !== parseInt(req.params.id));

    res.redirect('/novels');
});

// GET all reviews
app.get('/reviews', (req, res) => {
    res.render('reviews', {
        title: 'Reviews',
        reviews: reviews.map(review => ({
            ...review,
            novel: novels.find(n => n.id === review.novelId),
            user: users.find(u => u.id === review.userId)
        })),
        novels,
        users
    });
});

// POST new review
app.post('/reviews', (req, res) => {
    const newReview = {
        id: reviews.length + 1,
        novelId: parseInt(req.body.novelId),
        userId: parseInt(req.body.userId),
        rating: parseInt(req.body.rating),
        comment: req.body.comment
    };
    reviews.push(newReview);
    res.redirect('/reviews');
});

// Error handling for 404
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Middleware For Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

//app.listen to start the server *keep at the bottom of the file*
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


