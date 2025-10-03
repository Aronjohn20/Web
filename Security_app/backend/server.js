const fs = require('fs');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
const PORT = 8443;

// --- MongoDB Setup ---
mongoose.connect('mongodb://localhost:27017/secure_notes', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// --- Note Schema ---
const noteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Note = mongoose.model('Note', noteSchema);

// --- Middlewares ---
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

// --- CORS Setup ---
app.use(cors({
    origin: `https://localhost:${PORT}`, // same origin now
    credentials: true
}));

// --- CSRF ---
const csrfProtection = csurf({ cookie: true });

// --- Serve frontend ---
app.use(express.static('public'));

// --- Routes ---

// Home page served automatically from public/index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Get CSRF token
app.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Get all notes
app.get('/notes', async (req, res) => {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
});

// Add note
app.post('/add-note', csrfProtection, async (req, res) => {
    const note = new Note({ text: req.body.text });
    await note.save();
    res.json({ success: true, note });
});

// Delete note
app.post('/delete-note/:id', csrfProtection, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

// --- HTTPS Setup ---
const options = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem')
};

https.createServer(options, app).listen(PORT, () => {
    console.log(`Secure Notes App running at https://localhost:${PORT}`);
});

