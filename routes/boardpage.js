const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const Board = require('../schemas/board');
const connect = require('../schemas/index');
connect();

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.session.prevUrl = 'authFail';
        res.redirect('/');
    }
}

function renderMainBoardPage(req, res, title) {
    Board.find({userid:req.user.userid})
        .then((articles) => {
            res.render('../views/board',{title:title, userid:req.user.userid, data:articles});
        });
}

function editBoardItem(req, res) {
    const updateData = {title:req.body.title, content:req.body.content};
    Board.updateOne({userid:req.user.userid,number:parseInt(req.body.number)},{$set:updateData})
        .then((result)=>{
            console.log('editBoardItem - result : ',result);
            renderMainBoardPage(req, res, 'edit complete!');
    });
}

function deleteBoardItem(req, res) {
    Board.remove({userid:req.user.userid, number:req.body.number})
        .then((result) => {
            console.log('deleteBoardItem - after remove', result);
            renderMainBoardPage(req, res, 'delete complete!');
    }).catch((err) => {console.log('error occured in deleteBoardItem : ',err)});
}

function createBoardItem(req, res) {
    const newArticle = new Board({number:0, userid:req.user.userid, title:req.body.title, content:req.body.content});
    newArticle.save()
        .then((result) => {
            console.log('createBoardItem - result : ',result);
            renderMainBoardPage(req, res, 'create complete!');
        });
}

router.get('/board', ensureAuthenticated, (req, res, next) => {
    console.log('/board - ',req.headers.actiontype);
    renderMainBoardPage(req, res, 'You can make your own articles!');
});

router.post('/board', ensureAuthenticated, (req, res, next) => {
    console.log('board post request', req.body);
    if (req.body.actiontype === 'edit') {
        editBoardItem(req, res);
    } else if (req.body.actiontype === 'delete') {
        deleteBoardItem(req, res);
    } else if (req.body.actiontype === 'create') {
        createBoardItem(req, res);
    }
});

module.exports = router;