const dotenv = require('dotenv');
const firebase = require("firebase/app");
require("firebase/analytics");
require("firebase/auth");
require("firebase/firestore");

const express = require('express');
const _ = require('lodash/array');


dotenv.config({
    path: __dirname + '/../config/.env'
})

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.API_ID,
    measurementId: process.env.MEASUREMENT_ID
}
console.log(firebaseConfig)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const todoDoc = db.collection("todos").doc('KsTDHgIuVLcCMuHTM7vf');

async function getTodos() {
    return await todoDoc.get()
    .then((result) => {
        return result.data();
    })
}

// Frontend
app.get('/', async (_, res) => {
    let { incomplete, complete } = await getTodos();
    res.render("index", { incompleteTasks: incomplete, completeTasks: complete });
})

app.post('/addtask', async (req, res) => {
    const newTask = req.body.newTask;
    if (newTask) {
        let { incomplete } = await getTodos();
        incomplete.push(newTask);

        todoDoc.update({ incomplete })
        .then(() => {
            res.redirect("/");
        });
    } else {
        res.redirect("/");
    }
})

app.post("/removetask", async (req, res) => {
    let checkedTasks = req.body.check;
    if (typeof checkedTasks === "string") {
        let { complete, incomplete } = await getTodos();
        let completedTask = _.remove(incomplete, (el) => el === checkedTasks); //removes tasks from incomplete task
        complete.push(...completedTask); //adds task to complete
        todoDoc.update({ complete, incomplete }).then(() => {
            res.redirect("/");
        })
    } else if (typeof checkedTasks === "object") {
        let { complete, incomplete } = await getTodos();
        let completedTasks = [];
        checkedTasks.forEach((checkedTask) => {
            completedTasks.push(..._.remove(incomplete, (el) =>  el === checkedTask)); 
        })
        complete.push(...completedTasks);
        todoDoc.update({ complete, incomplete }).then(() => {
            res.redirect("/");
        })
    } else {
        res.redirect("/");
    }
})

// Backend
app.get('/api/todoTasks', async (_, res) => {
    // let incomplete = await db.collection("todos").doc('kTR8StfWMfW7ic2rh5kg').get()
    // .then((res) => {
    //     return res.data().incomplete;
    // })
    // todoTasks.push(...incomplete);
    res.json({ todoTasks })
})

app.get('/api/completeTasks', (_, res) => {
    res.json({ completeTasks });
})

app.post('/api/addTask', (req, res) => {
    const { task } = req.body;
    todoTasks.push(task);
    res.json({ todoTasks });
})

app.post('/api/removeTasks', (req, res) => {
    const { selectedTasks } = req.body;
    const removedTasks = [];

    selectedTasks.forEach( (task) => {
        removedTasks.push(..._.remove(todoTasks, (el) => el === task));
    })
    completeTasks.push(...removedTasks);

    res.json({ todoTasks, completeTasks });
})

module.exports = app; 
app.listen(8080, () => console.log("app is running on port 8080"));
app.set('view engine', 'ejs');