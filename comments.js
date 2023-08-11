// Create web server 
var express = require("express");
var router = express.Router();
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middleware");

// =================
// COMMENTS ROUTES
// =================

// Comments new
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function (req, res) {
    // find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) console.log(err);
        else res.render("comments/new", { campground: campground });
    });
});

// Comments create
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function (req, res) {
    // lookup campground using ID
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        // create new comment
        else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) console.log(err);
                else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground show page
                    req.flash("success", "Successfully added comment.");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// Comments edit
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) console.log(err);
        else res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
    });
});

// Comments update
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) console.log(err);
        else {
            req.flash("success", "Successfully edited comment.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Comments destroy
router.delete("/campgrounds/:id/comments/:comment_id", middleware