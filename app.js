var methodOverride  = require("method-override");
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    
// DB Setup and default views extension setup
app.set("view engine", "ejs");
mongoose.connect('mongodb://localhost:27017/books_blog',  { useNewUrlParser: true });

// Use Statements
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

// Model Setup
var bookSchema = new mongoose.Schema({
    name: String,
    image: String,
    readOn: Date,
    desc: String
});

var Book = mongoose.model('Book', bookSchema);

// RESTFUL ROUTES

// INDEX ROUTES
app.get("/", function(req, res) {
    res.redirect('/books');
});
app.get("/books", function(req, res) {
    // Book.create(req.body)
    
    Book.find({}, function(err, foundBook) {
        if(err) {
            console.log("Error!");
        }
        else {
            res.render('index', {books: foundBook});
        }
    });
});

// NEW ROUTE
app.get("/books/new", function(req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/books", function(req, res) {
    Book.create(req.body.book, function(err, newBook) {
        if(err) {
            console.log("error creating record!!");
            res.send("error creating record!!");
        } else{
            res.redirect("/books");
        }
    });
});

// SHOW ROUTE
app.get("/books/:id", function(req, res) {
    Book.findById(req.params.id, function(err, foundBook) {
        if(err) {
            console.log("No Book Found! (SHOW Route)");
            res.send("No Book Found!");
        } else {
            res.render("show", {book: foundBook});
        }
    });
});

// EDIT ROUTE
app.get("/books/:id/edit", function(req, res) {
    Book.findById(req.params.id, function(err, foundBook) {
        if(err) {
            console.log("No Book Found! (EDIT Route)");
            res.send("No Book Found!");
        } else {
            res.render("update", {book: foundBook});
        }
    }); 
});

// UPDATE ROUTE
app.put("/books/:id", function(req, res) {
    Book.findByIdAndUpdate(req.params.id,req.body.book, function(err, updatedBook) {
        if(err) {
            console.log("Error Updating!!");
            res.send("Error Updating!!");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/books/:id", function(req, res) {
    Book.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            console.log("Eror in Removing");
            res.send("Eror in Removing");
        } else {
            res.redirect("/books");
        }
    });
});

app.listen(8080, function() {
    console.log('Server Started!!')
});