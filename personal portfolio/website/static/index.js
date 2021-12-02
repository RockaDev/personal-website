function deleteNote(noteId) {
    fetch('/delete-note', {
        method: 'POST',
        body: JSON.stringify({ noteId: noteId })

    }).then((_res) => {
        window.location.href= '/';
    });
}

function accessInfo() {
    document.getElementById("demo").innerHTML = "Hello Dear Visitor!</br> We are happy that you've chosen our website to learn programming languages. We're sure you'll become one of the best programmers in your country.<br/>Good luck to you!";
}