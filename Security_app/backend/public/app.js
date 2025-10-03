const notesList = document.getElementById('notesList');
const noteForm = document.getElementById('noteForm');
const noteText = document.getElementById('noteText');
let csrfToken = '';

// Fetch CSRF token
fetch('https://localhost:8443/csrf-token', { credentials: 'include' })
    .then(res => res.json())
    .then(data => csrfToken = data.csrfToken);

// Load notes
function loadNotes() {
    fetch('https://localhost:8443/notes', { credentials: 'include' })
        .then(res => res.json())
        .then(notes => {
            notesList.innerHTML = '';
            notes.forEach(note => {
                const li = document.createElement('li');
                li.textContent = note.text;
                
                const delBtn = document.createElement('button');
                delBtn.textContent = 'Delete';
                delBtn.onclick = () => deleteNote(note._id);
                
                li.appendChild(delBtn);
                notesList.appendChild(li);
            });
        });
}

// Add note
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch('https://localhost:8443/add-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CSRF-Token': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({ text: noteText.value })
    }).then(() => {
        noteText.value = '';
        loadNotes();
    });
});

// Delete note
function deleteNote(id) {
    fetch(`https://localhost:8443/delete-note/${id}`, {
        method: 'POST',
        headers: { 'CSRF-Token': csrfToken },
        credentials: 'include'
    }).then(() => loadNotes());
}

// Initial load
loadNotes();
