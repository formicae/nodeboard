const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Board = require('../schemas/board');
const ArticleNumber = require('../schemas/ArticleNumber');
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

function renderBoardPage(req, res, filename) {
    const renderFile = '../views/' + filename;
    console.log('render page : ',renderFile);
    res.render(renderFile, {title:filename, userid:req.user.userid});
}

function renderMainBoardPage(req, res, title) {
    Board.find({userid:req.user.userid})
        .then((articles) => {
            res.render('../views/board',{title:title, userid:req.user.userid, data:articles});
        });
}

function findMaxArticleNum (req, limitNumber) {
    return new Promise((resolve, reject) => {
        ArticleNumber.find({userid: req.user.userid}).sort({number: -1}).limit(limitNumber).then((maxArticleNum) => {
            resolve(maxArticleNum);
        });
    });
};

function getMaxArticleNum (req, actiontype) {
    return new Promise((resolve, reject) => {
        if (actiontype === 'create') {
            findMaxArticleNum(req, 1).then((maxArticleNum) => {
                const newMax = maxArticleNum + 1;
                ArticleNumber.update({userid:req.user.userid},{$set:{number:newMax}}).then(() => {
                    resolve(newMax);
                });
            });
        } else if (actiontype === 'delete') {
            findMaxArticleNum(req, 1).then((maxArticleNum) => {
                if (req.body.number === maxArticleNum) {
                    findMaxArticleNum(req, 2).then((nextMaxArticleNum) => {
                        resolve(nextMaxArticleNum);
                    });
                } else {
                    resolve(maxArticleNum);
                }
            });
        }
    });
};

function editBoardItem(req, res) {
    const updateData = {title:req.body.title, content:req.body.content};
    Board.update({userid:req.user.userid,number:req.body.number},{$set:updateData}).then(()=>{
        renderMainBoardPage(req, res, 'edit complete!');
    });
}

function deleteBoardItem(req, res) {
    getMaxArticleNum(req, 'delete').then((maxArticleNum) => {
        Board.remove({userid:req.user.userid, number:req.body.number}).then(() => {
            renderMainBoardPage(req, res, 'delete complete!')
        });
    });
};

function createBoardItem(req, res) {
    getMaxArticleNum(req, 'create').then((nextMaxArticleNum) => {
        console.log('createBoard - get max article num : ',nextMaxArticleNum);
        const newArticle = new Board({number:nextMaxArticleNum, userid:req.user.userid, title:req.body.title, content:req.body.content});
        newArticle.save().then((result) => {
            console.log('createBoard - save success! : ', result);
            renderMainBoardPage(req, res, 'create complete!')
        });
    });
}

router.get('/board', ensureAuthenticated, (req, res, next) => {
    console.log('/board - ',req.headers.actiontype);
    if (req.headers.actiontype === 'create' && req.headers.actionstatus === 'start') {
        console.log('create board start !!');
        renderBoardPage(req, res, 'createBoard');
    } else if (req.headers.actiontype === 'edit' && req.headers.actionstatus === 'start') {
        renderBoardPage(req, res, 'editBoard');
    } else if (req.headers.actiontype === 'delete') {
        deleteBoardItem(req, res);
    } else {
        renderMainBoardPage(req, res, 'You can make your own articles!');
    }
});

router.post('/board', ensureAuthenticated, (req, res, next) => {
    console.log('board post request', req.body);
    if (req.body.actiontype === 'create' && req.body.actionstatus === 'end') {
        console.log('board - post - create start!!');
        createBoardItem(req, res);
    } else if (req.body.actiontype === 'edit' && req.body.actionstatus === 'end') {
        editBoardItem(req, res);
    }
});

module.exports = router;