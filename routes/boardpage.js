const express = require('express');
const router = express.Router();
const Board = require('../schemas/board');
const multer = require('multer');
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
    const updateData = {title:req.body.title, content:req.body.content, imageFileName:req.body.imageFileName};
    Board.updateOne({userid:req.user.userid,number:req.body.number},{$set:updateData})
        .then((result)=>{
            renderMainBoardPage(req, res, 'edit complete!');
    });
}

function getFileName(req, res) {
    Board.findOne({userid:req.user.userid, number:req.body.number})
        .then((result) => {
            res.send(result.imageFileName || "");
        });
}

function deleteBoardItem(req, res) {
    Board.remove({userid:req.user.userid, number:req.body.number})
        .then((result) => {
            renderMainBoardPage(req, res, 'delete complete!');
    }).catch((err) => {console.log('error occured in deleteBoardItem : ',err)});
}

function createBoardItem(req, res) {
    const newArticle = new Board({number:0, userid:req.user.userid, title:req.body.title, content:req.body.content, imageFileName:req.body.imageFileName});
    newArticle.save()
        .then((result) => {
            renderMainBoardPage(req, res, 'create complete!');
        });
}

router.get('/board', ensureAuthenticated, (req, res, next) => {
    renderMainBoardPage(req, res, 'You can make your own articles!');
});

router.post('/board', ensureAuthenticated, (req, res, next) => {
    if (req.body.actiontype === 'edit') {
        editBoardItem(req, res);
    } else if (req.body.actiontype === 'getImageFileName') {
        getFileName(req, res);
    } else if (req.body.actiontype === 'delete') {
        deleteBoardItem(req, res);
    } else if (req.body.actiontype === 'create') {
        createBoardItem(req, res);
    }
});

const upload = multer({
    storage : multer.diskStorage({
        destination : function(req, file, callback) {
            callback(null, 'images/');
        },
        filename : function(req, file, callback) {
            callback(null, Date.now() + file.originalname);
        }
    }),
});

router.post('/board/upload/editTable', ensureAuthenticated, upload.single('editPageInputImage'), (req, res, next) => {
    res.send(req.file);
});
router.post('/board/upload/createTable', ensureAuthenticated, upload.single('createPageInputImage'), (req, res, next) => {
    res.send(req.file);
})

module.exports = router;