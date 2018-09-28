const userid = document.getElementById('boardTable').className;
const cells = document.getElementById('boardTable').getElementsByTagName('tr');
function editPageLoad(number, title, content){
    document.getElementById('editTitleLabel').innerText = title;
    document.getElementById('editContentLabel').innerText = content;
    document.getElementById('editTable').dataset.number = number;
    document.getElementById('editTable').dataset.title = title;
    document.getElementById('editTable').dataset.content = content;
    const xhr = new XMLHttpRequest();
    const data = {title:title, content:content, number:number, actiontype:'getImageFileName'};
    xhr.addEventListener('load', () => {
        renderImageFile('editImage', xhr.responseText);
        showEditPage();
    });
    xhr.open('post','/board',true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
function deleteAjax(number, title, content){
    const xhr = new XMLHttpRequest();
    const data = {title:title, content:content, number:number, actiontype:'delete'};
    xhr.addEventListener('load', () => {
        showMainPage();
        window.location.reload();
    });
    xhr.open('post','/board',true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
function editAjax() {
    const xhr = new XMLHttpRequest();
    const number = document.getElementById('editTable').dataset.number;
    const title = document.getElementById('editTitle').innerHTML || document.getElementById('editTitleLabel').innerHTML;
    const content = document.getElementById('editContent').innerHTML || document.getElementById('editContentLabel').innerHTML;;
    const imageFileName = !!document.getElementById('editTable').dataset.imageFileName ? document.getElementById('editImage').src : document.getElementById('editTable').dataset.imageFileName;
    const data = {title:title, content:content, number:number, actiontype:'edit', imageFileName:imageFileName};
    xhr.addEventListener('load', () => {
        showMainPage();
        window.location.reload();
    });
    xhr.open('post','/board', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
function createAjax() {
    const xhr = new XMLHttpRequest();
    const title = document.getElementById('createTitle').value;
    const content = document.getElementById('createContent').value;
    const imageFileName = document.getElementById('createTable').dataset.imageFileName;
    const data = {title:title, content:content, actiontype:'create', imageFileName:imageFileName};
    xhr.addEventListener('load', () => {
        showMainPage();
        window.location.reload();
    });
    xhr.open('post','/board', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
function renderImageFile(imageTagId, fileName){
    if (!!fileName) {
        document.getElementById(imageTagId).width = 250;
        document.getElementById(imageTagId).height = 300;
        document.getElementById(imageTagId).src = fileName;
        document.getElementById(imageTagId+'Label').innerHTML = "Image : ";
    } else {
        document.getElementById(imageTagId).width = 0;
        document.getElementById(imageTagId).height = 0;
        document.getElementById(imageTagId).src = "";
        document.getElementById(imageTagId+'Label').innerHTML = "";
    }
}
function detailAjax(number, title, content) {
    const xhr = new XMLHttpRequest();
    const data = {title:title, content:content, number:number, actiontype:'getImageFileName'};
    xhr.addEventListener('load', () => {
        document.getElementById('articleTable').dataset.number = number;
        document.getElementById('articleTitle').innerHTML = title;
        document.getElementById('articleContent').innerHTML = content;
        renderImageFile('articleImage', xhr.responseText);
        showArticlePage();
    });
    xhr.open('post','/board', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
for (let i=1,len=cells.length; i<len; i++) {
    const innerCells = cells[i].getElementsByTagName('td');
    const number = innerCells[0].innerText
        ,title = innerCells[1].innerText
        ,content = innerCells[2].innerText;
    document.getElementById('edit'+number).addEventListener('click', () => {
        editPageLoad(number, title, content);
    });
    document.getElementById('delete'+number).addEventListener('click', () => {
        deleteAjax(number, title, content);
    });
    document.getElementById('detail'+number).addEventListener('click', () =>{
        detailAjax(number, title, content);
    });
}
function articleToEditPage(){
    const number = document.getElementById('articleTable').dataset.number;
    const title = document.getElementById('articleTitle').innerHTML;
    const content = document.getElementById('articleContent').innerHTML;
    editPageLoad(number, title, content);
    showEditPage();
}
function articleToDelete(){
    const number = document.getElementById('articleTable').dataset.number;
    const title = document.getElementById('articleTitle').innerHTML;
    const content = document.getElementById('articleContent').innerHTML;
    deleteAjax(number, title, content);
}
function pageConfig(inp1, inp2, inp3, inp4){
    document.querySelector('#mainBoardPage').className = inp1;
    document.querySelector('#createBoardPage').className = inp2;
    document.querySelector('#editBoardPage').className = inp3;
    document.querySelector('#articlePage').className = inp4;
}
function showMainPage(){
    pageConfig('showPage', 'hidePage', 'hidePage', 'hidePage');
}
function showCreatePage(){
    pageConfig('hidePage', 'showPage', 'hidePage', 'hidePage');
}
function showEditPage(){
    pageConfig('hidePage', 'hidePage', 'showPage', 'hidePage');
}
function showArticlePage(){
    pageConfig('hidePage', 'hidePage', 'hidePage', 'showPage');
}
function imageUpload(inputForm, inputButton, targetTable, imageTag){
    document.getElementById(inputButton).addEventListener('click', () => {
        const form = document.getElementById(inputForm);
        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (!!xhr.responseText) {
                document.getElementById(targetTable).dataset.imageFileName = JSON.parse(xhr.responseText).filename;
                renderImageFile(imageTag, JSON.parse(xhr.responseText).filename);
            }
        });
        xhr.open('post', '/board/upload/'+targetTable, true);
        xhr.send(formData);
    });
}
imageUpload('createPageImageUpload', 'createPageUpload', 'createTable', 'createImage');
imageUpload('editPageImageUpload', 'editPageUpload', 'editTable', 'editImage');