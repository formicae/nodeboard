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
        }).catch((e)=>console.log(e));
}

function editBoardItem(req, res) {
    const filename = req.file ? req.file.filename : "";
    const updateData = {title:req.body.title, content:req.body.content, imageFileName:filename};
    console.log('editBoardItem : ',updateData);
    console.log('   ',req.body);
    Board.updateOne({userid:req.user.userid, _id:req.body.boardId},{$set:updateData})
        .then((result)=>{
            renderMainBoardPage(req, res, 'edit complete!');
    });
}

function getFileName(req, res) {
    Board.findOne({userid:req.user.userid, _id:req.body.boardId})
        .then((result) => {
            res.send(result.imageFileName || "");
        });
}

function deleteBoardItem(req, res) {
    Board.remove({userid:req.user.userid, _id:req.body.boardId})
        .then((result) => {
            renderMainBoardPage(req, res, 'delete complete!');
    }).catch((err) => {console.log('error occured in deleteBoardItem : ',err)});
}

function createBoardItem(req, res) {
    const filename = req.file ? req.file.filename : "";
    const newArticle = new Board({number:0, userid:req.user.userid, title:req.body.title, content:req.body.content, imageFileName:filename});
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

router.post('/board/upload/edit', ensureAuthenticated, upload.single('editPageInputImage'), (req, res, next) => {
    console.log('edit post',req.body);
    editBoardItem(req, res);
});
router.post('/board/upload/create', ensureAuthenticated, upload.single('createPageInputImage'), (req, res, next) => {
    createBoardItem(req, res);
});

module.exports = router;