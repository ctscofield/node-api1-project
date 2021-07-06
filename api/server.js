// BUILD YOUR SERVER HERE
const express = require("express");
const users = require("./users/model");
const server = express();

server.use(express.json());

server.get("/api/hello", (req, res) => {
    console.log(req.method);
    res.status(200).json({ message: "Sanity check."});
})


server.get("/api/users", (req, res) => {
    users.find()
        .then(user => {
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
})

server.get("/api/users/:id", (req, res) => {
    const id = req.params.id;
    users.findById(id)
        .then(user => {
            if (!user) {
                res.status(404).json({message: `User with id ${id} does not exist.`});
            } else {
                res.status(200).json(user);
            }
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        })
})

server.post("/api/users", (req, res) => {
    if (!req.body.name || !req.body.bio) {
        res.status(400).json({message: "Please provide name and bio for the user"});
    } else {
        const { name, bio } = req.body;
        users.insert({ name, bio })
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
    }
});

server.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, bio } = req.body;
    if (!name || !bio) {
        res.status(400).json({message: `Please provide name and bio for the user`})
    } else {
        users.update(id, { name, bio})
            .then(updated => {
                if (!updated) {
                    res.status(404).json({ message: `The user with the specified ID does not exist`});
                } else {
                    res.status(200).json(updated);
                }
            })
            .catch(err => {
                res.status(500).json({
                    message: `The user information could not be modified`,
                    error: err.message
                })
            })
    }
})

server.delete("/api/users/:id", async (req, res) => {
    try {
        const deleted = await users.remove(req.params.id);
        if (!deleted) {
            res.status(404).json({message: "The user with the specified ID does not exist"});
        } else {
            res.json(deleted);   
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
