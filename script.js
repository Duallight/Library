/*
    Daniel Treichel
    This library app works to keep track books you have read or not. 
    Currently it just displays books in the library, and tracks if you have read them or not.
    TO-DO:
        Add sort Functionality
        Add local storage option
        Fix form requirements
*/
// Initialize library, and get the bookshelf element
let myLibrary = [];
let shelf = document.getElementById("bookShelf");

//Book constructor
class Book {
    constructor(title, author, genre, isRead) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.isRead = isRead;
    }
}
//Adds book to the array, then updates the book shelf to display changes
function addBookToLibrary(newBook) {
    myLibrary.push(newBook);
    updateShelf();
    saveToLocalStorage();
}
//Removes book from array, then updates shelf to reflect changes
function removeBook(name) {
    for (let i = 0; i < myLibrary.length; i++) {
        if (myLibrary[i].title === name) {
            myLibrary.splice(i, 1);
            break;
        }
    }
    saveToLocalStorage();
    updateShelf();
}
//Clears the shelf, then creates a new card for each book in library array
function updateShelf() {
    shelf.innerHTML = "";
    myLibrary.forEach(createCard);
}

//Function to create a new card to display
function createCard(book) {
    //Create elements of card
    bookCard = document.createElement("div");
    title = document.createElement("h3");
    author = document.createElement("h5");
    genre = document.createElement("h5");
    readButton = document.createElement("button");
    removeButton = document.createElement("button");
    //Changes state of read button to reflect read status
    if(book.isRead) {
        readButton.textContent="Finished";
        readButton.className = "finished-button";

    } else {
        readButton.textContent = "Not Finished";
        readButton.className = "unfinished-button";

    }
    //sets values, then adds all to the book card element
    removeButton.textContent = "Delete";
    title.textContent=book.title;
    author.textContent=book.author;
    genre.textContent=book.genre;
    bookCard.append(title);
    bookCard.append(author);
    bookCard.append(genre);
    bookCard.append(readButton);
    bookCard.append(removeButton);

    //Sets classes, adds card to book shelf
    bookCard.className = "book";
    removeButton.className = "delete-button";
    shelf.append(bookCard);

    //functionality for buttons
    removeButton.addEventListener("click", () =>{
        removeBook(book.title);
    });
    readButton.addEventListener("click", () => {
        if(book.isRead) {
            book.isRead = false;
        } else {
            book.isRead = true;
        }
        updateShelf();
    });
    saveToLocalStorage();
}
//the new book button brings up the form to add a new book
document.getElementById("addButton").onclick = function() {
   document.getElementById("addBookForm").style.display = "block";
}
//Cancel button on form closes form, and resets values
document.getElementById("cancel").onclick = function() {
    document.getElementById("addBookForm").style.display = "none";
    document.getElementById("form").reset();
}

//On form submit, create a new book from inputed values, add to library, hide form, and reset its values.
document.getElementById("addToLibrary").onclick = function() {
    let bookTitle = document.getElementById("getTitle").value;
    let bookAuthor = document.getElementById("getAuthor").value;
    let bookGenre = document.getElementById("getGenre").value;
    let read = false;
    if (document.getElementById("finishedCheckBox").checked) {
        read = true;
    }
    let newBook = new Book(bookTitle, bookAuthor, bookGenre, read);
    addBookToLibrary(newBook);
    document.getElementById("addBookForm").style.display = "none";
    document.getElementById("form").reset();
}
//Function used to check if local storage is available. Code taken from MDN Web Docs, which is in the public domain
function storageAvailable(type) { 
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
function saveToLocalStorage() {
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
}
function restoreLibraryFromStorage() {
    myLibrary = JSON.parse(localStorage.getItem("myLibrary"));
    if (myLibrary === null) {
        myLibrary =[];
        //Sets up example books for library if library hasn't been used yet
        let book1 = new Book("Ender's Game", "Orson Scott Card", "Sci-Fi", true);
        let book2 = new Book("Moby-Dick", "Herman Melville", "Fiction", false);
        let book3 = new Book("Storm Front", "Jim Butcher", "Detective Fiction", true);
        let book4 = new Book("The Fellowship of the Ring", "J. R. R. Tolkien", "Adventure", true);
        let book5 = new Book("Howl's Moving Castle", "Diana Wynne Jones", "Fiction", true);
        let book6 = new Book("The Count of Monte Cristo", "Alexandre Dumas", "Adventure", false);
        addBookToLibrary(book1);
        addBookToLibrary(book2);
        addBookToLibrary(book3);
        addBookToLibrary(book4);
        addBookToLibrary(book5);
        addBookToLibrary(book6);
    }
    updateShelf();
}
//Checks if local storage is supported. 
if (storageAvailable("localStorage")) {
    restoreLibraryFromStorage();
} else {
    alert("Your browser doesn't support local storage, your library will not be saved on page refresh");
}
