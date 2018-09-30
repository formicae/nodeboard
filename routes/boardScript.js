const userid = document.getElementById('boardTable').className;
const cells = document.getElementById('boardTable').getElementsByTagName('tr');
const allTables = document.getElementsByTagName('table');
class Table {
    constructor(name) {
        this.name = name;
        this.labels = {};
        this.inputs = {};
    }
    setData(dataset) { this.data = dataset; }
    setLabels(param, label) { this.labels[param] = label; }
    setInputs(param, input) { this.inputs[param] = input; }
    setImage(image) { this.image = image; }
}
const boardTable = new Table('board');
const editTable = new Table('edit');
const articleTable = new Table('article');
const createTable = new Table('create');
const tempTableArray = [boardTable, articleTable, createTable, editTable];
for (let i=0; i<allTables.length; i++) {
    const tempTable = tempTableArray[i];
    let tempLabel = allTables[i].getElementsByTagName('label');
    let tempInputs = allTables[i].getElementsByTagName('input');
    tempTable.setData(allTables[i].dataset);
    tempTable.setImage(allTables[i].getElementsByTagName('img')[0]);
    for (let k=0; k<tempLabel.length; k++) {
        tempTable.setLabels(tempLabel[k].className, tempLabel[k]);
    }
    for (let j=0; j<tempInputs.length; j++) {
        if (tempInputs[j].type === 'text') {
            tempTable.setInputs(tempInputs[j].name, tempInputs[j]);
        }
    }
}
function createNewAjax(data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        callback(xhr);
    });
    xhr.open('post','/board', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
function editPageLoad(number, title, content){
    editTable.labels.title.innerText = title;
    editTable.labels.content.innerText = content;
    editTable.data.number = number;
    editTable.data.title = title;
    editTable.data.content = content;
    const data = {title:title, content:content, number:number, actiontype:'getImageFileName'};
    createNewAjax(data, (xhr) => {
        renderImageFile('editImage', xhr.responseText);
        showEditPage();
    });
}
function deleteAjax(number, title, content){
    const data = {title:title, content:content, number:number, actiontype:'delete'};
    createNewAjax(data, (xhr) => {
        showMainPage();
        window.location.reload();
    });
}
function editAjax() {
    const data = {
        title: editTable.inputs.title.value || editTable.data.title,
        content: editTable.inputs.content.value || editTable.data.content,
        number: editTable.data.number,
        actiontype: 'edit',
        imageFileName: editTable.image.src,
    };
    createNewAjax(data, (xhr) => {
        showMainPage();
        window.location.reload();
    });
}
function createAjax() {
    const data = {
        title : createTable.inputs.title.value,
        content : createTable.inputs.content.value,
        actiontype : 'create',
        imageFileName : createTable.image.src,
    };
    createNewAjax(data, (xhr) => {
        showMainPage();
        window.location.reload();
    });
}
function renderImageFile(imageTagId, fileName){
    const image = document.getElementById(imageTagId);
    image.width = !!fileName ? 250 : 0;
    image.height = !!fileName ? 300 : 0;
    image.src = !!fileName ? fileName : "";
    document.getElementById(imageTagId+'Label').innerText = !!fileName ? "Image : " : "";
}
function detailAjax(number, title, content) {
    const data = {title:title, content:content, number:number, actiontype:'getImageFileName'};
    createNewAjax(data, (xhr) => {
        articleTable.data.number = number;
        articleTable.labels.title.innerText = title;
        articleTable.labels.content.innerText = content;
        renderImageFile('articleImage', xhr.responseText);
        showArticlePage();
    });
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
    editPageLoad(articleTable.data.number, articleTable.labels.title.innerText, articleTable.labels.content.innerText);
    showEditPage();
}
function articleToDelete(){
    deleteAjax(articleTable.data.number, articleTable.labels.title.innerText, articleTable.labels.content.innerText);
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
                renderImageFile(imageTag, JSON.parse(xhr.responseText).filename);
            }
        });
        xhr.open('post', '/board/upload/'+targetTable, true);
        xhr.send(formData);
    });
}
imageUpload('createPageImageUpload', 'createPageUpload', 'createTable', 'createImage');
imageUpload('editPageImageUpload', 'editPageUpload', 'editTable', 'editImage');