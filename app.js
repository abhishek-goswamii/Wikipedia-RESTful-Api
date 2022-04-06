const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")
const res = require("express/lib/response")

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("public"))

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true })

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("articles", articleSchema)


app.route("/articles/:title/").get((req, res) => {

    Article.findOne({ title: req.params.title }, (err, result) => {
        if (err) {
            res.send("no article with this name")
        } else {
            res.send(result)
        }
    })
}

).put((req, res) => {

    console.log("Inside patch request");
    console.log(req.params.title);

    Article.updateOne({ title: req.params.title },
        
        { title: req.body.title, content: req.body.content }, (err, result) => {
            console.log(err, result);
            if(!err){
                res.send("success");
            }else{
                
                res.send(err);
            }

        })

})

app.route("/articles").get((req, res) => {

    Article.find((err, result) => {
        if (err) {
            res.send(err)

        } else {
            res.send(result)
        }
    })

}).post((req, res) => {

    const ar = new Article({
        title: req.body.title,
        content: req.body.content
    })

    ar.save((err) => {
        if (err) {
            res.send(err)
        } else {
            res.send("successfull")
        }
    })

}).delete((req, res) => {

    Article.deleteMany((err) => {
        if (err) {
            res.send(err)
        } else {
            res.send("successful")
        }
    })

})



app.listen(4000, (res) => {
    console.log(`at port 4000`);
})