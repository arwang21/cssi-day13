/**************   SPICY : add archive functionality   *************/

let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

/**********   MILD 2: sort notes by alphabetical order   *********/
const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    const titleArr = [];
    const keyArr = [];
    for (let key in data) {
        if(data[key].archived != null && data[key].archived == true) {
            console.log(data[key].archived);
            titleArr.push(data[key].title);
            keyArr.push([data[key].title, key]);
        } else {
            console.log(data[key].archived);
        }  
    }
    titleArr.sort();
    const keyObj = Object.fromEntries(keyArr);
    for (let title of titleArr) {
        const sortedKey = keyObj[title];
        const note = data[sortedKey];
        destination.innerHTML += createCard(note, sortedKey);
    }
};

const createCard = (note, noteId) => {
    return `<div id='${noteId}' class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                    </div> 
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item" onclick="deleteNote('${noteId}')">
                            Delete
                        </a>
                        <a href="#" class="card-footer-item" onclick="unarchiveNote('${noteId}')">
                            Unarchive
                        </a>
                    </footer>
                </div>
            </div>`;
};

/********   MEDIUM : confirm delete note   ********/
const deleteNote = (noteId) => {
    const noteToDeleteRef = firebase.database().ref(`users/${googleUserId}/${noteId}`);
    if (confirm("Are you sure?")) {
        noteToDeleteRef.remove();
    }
}

const unarchiveNote = (noteId) => {
    const noteToArchiveRef = firebase.database().ref(`users/${googleUserId}/${noteId}`);

    noteToArchiveRef.update({
        archived: false
    })
}

const closeModal = () => {
    const editNoteModal = document.querySelector("#editNoteModal");
    editNoteModal.classList.remove("is-active");
}