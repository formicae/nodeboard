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

/**
 *
 * @param req
 * @param limitNumber {Number} number order for data that will be obtained
 * @returns {Promise<any>}
 */
function findMaxArticleNum (req, limitNumber) {
    return new Promise((resolve, reject) => {
        Board.find({userid: req.user.userid}).sort({number: -1}).limit(limitNumber)
            .then((result) => {
                if (result.length == 0) {
                    resolve(0);
                } else {
                    console.log(result[0]);
                    resolve(result[0].number);
                }
        });
    });
};

function getMaxArticleNum (req, actiontype) {
    return new Promise((resolve, reject) => {
        if (actiontype === 'create') {
            findMaxArticleNum(req, 1)
                .then((maxArticleNum) => {
                    console.log('create - getMaxArticleNum', maxArticleNum, typeof maxArticleNum);
                    resolve(maxArticleNum + 1);
                });
        } else if (actiontype === 'delete') {
            findMaxArticleNum(req, 1)
                .then((maxArticleNum) => {
                    if (req.body.number === maxArticleNum) {
                        return findMaxArticleNum(req, 2);
                    } else {
                        return maxArticleNum;
                    }
                }).then((maxArticleNum) => {
                    resolve(maxArticleNum);
                });
        }
    });
};

function editBoardItem(req, res) {
    const updateData = {title:req.body.title, content:req.body.content};
    Board.updateOne({userid:req.user.userid,number:parseInt(req.body.number)},{$set:updateData})
        .then((result)=>{
            console.log('editBoardItem - result : ',result);
            renderMainBoardPage(req, res, 'edit complete!');
    });
}

function deleteBoardItem(req, res) {
    getMaxArticleNum(req, 'delete')
        .then((maxArticleNum) => {
            console.log('maxArticleNum : ',maxArticleNum);
            return User.updateOne({userid: req.user.userid}, {$set: {maxNumber: maxArticleNum}});
        }).then(() => {
            console.log('prepareing to remove !');
            return Board.remove({userid:req.user.userid, number:req.body.number});
        }).then(() => {
            console.log('remove done!');
            renderMainBoardPage(req, res, 'delete complete!')
        }).catch((err) => {
            console.log('error occured in deleteBoardItem : ',err);
        });
};

function createBoardItem(req, res) {
    getMaxArticleNum(req, 'create')
        .then((nextMaxArticleNum) => {
            console.log('createBoard - get max article num : ',nextMaxArticleNum);
            const newArticle = new Board({number:nextMaxArticleNum, userid:req.user.userid, title:req.body.title, content:req.body.content});
            newArticle.save()
                .then((result) => {
                    console.log('createBoard - save success! : ', result);
                    return User.updateOne({userid:req.user.userid},{$set:{maxNumber:nextMaxArticleNum}});
                }).then(() => {
                    console.log('max Number update complete !')
                    renderMainBoardPage(req, res, 'create complete!')
            });
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