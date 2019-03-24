const userid = document.getElementById('boardTable').className;
const cells = document.getElementById('boardTable').getElementsByTagName('tr');
const editForm = document.getElementById('editForm')
    ,createForm = document.getElementById('createForm')
    ,articleForm = document.getElementById('articleForm');
function createNewAjax(data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        callback(xhr);
    });
    xhr.open('post','/board', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
function editPageLoad(boardId, title, content){
    editForm.dataset.boardId = boardId;
    editForm.title.value = title;
    editForm.content.value = content;
    const data = {title:editForm.title.value, content:editForm.content.value, boardId:boardId, actiontype:'getImageFileName'};
    createNewAjax(data, (xhr) => {
        renderImageFile('editImage', xhr.responseText, editForm);
        showEditPage();
    });
}
function deleteAjax(boardId, title, content){
    const data = {title:title, content:content, boardId:boardId, actiontype:'delete'};
    createNewAjax(data, (xhr) => {
        showMainPage();
        window.location.reload();
    });
}
function renderImageFile(imageTagId, fileName, form){
    const image = document.getElementById(imageTagId);
    image.width = !!fileName ? 250 : 0;
    image.height = !!fileName ? 300 : 0;
    image.src = !!fileName ? fileName : "";
    form.image.value = !!fileName ? "Image : " : "";
}
function detailAjax(boardId, title, content) {
    const data = {title:title, content:content, boardId:boardId, actiontype:'getImageFileName'};
    createNewAjax(data, (xhr) => {
        articleForm.dataset.boardId = boardId;
        articleForm.title.value = title;
        articleForm.content.value = content;
        renderImageFile('articleImage', xhr.responseText, articleForm);
        showArticlePage();
    });
}
for (let i=1,len=cells.length; i<len; i++) {
    const innerCells = cells[i].getElementsByTagName('td');
    const title = innerCells[0].innerText
        ,content = innerCells[1].innerText
        ,boardId = innerCells[0].className;
    innerCells[0].addEventListener('click', () => {
        detailAjax(boardId, title, content);
    });
    innerCells[1].addEventListener('click', () => {
        detailAjax(boardId, title, content);
    });
    document.getElementById('edit'+boardId).addEventListener('click', () => {
        editPageLoad(boardId, title, content);
    });
    document.getElementById('delete'+boardId).addEventListener('click', () => {
        deleteAjax(boardId, title, content);
    });
}
function articleToEditPage(){
    editPageLoad(articleForm.dataset.boardId, articleForm.title.innerText, articleForm.content.innerText);
    showEditPage();
}
function articleToDelete(){
    deleteAjax(articleForm.dataset.boardId, articleForm.title.innerText, articleForm.content.innerText);
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
function formDataAjax(inputForm, inputButton, targetPath){
    document.getElementById(inputButton).addEventListener('click', () => {
        const formData = new FormData(inputForm);
        formData.append('boardId', inputForm.dataset.boardId);
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            showMainPage();
            window.location.reload();
        });
        xhr.open('post', targetPath, true);
        xhr.send(formData);
    });
}
function onImageChange(inputFileTag, imageTag, form) {
    document.getElementById(inputFileTag).onchange = (event) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.srcElement.files[0]);
        reader.onload = function () {
            var fileContent = reader.result;
            renderImageFile(imageTag, fileContent, form);
        }
    }
}
formDataAjax(editForm, 'editFormSubmit', '/board/upload/edit');
formDataAjax(createForm,'createFormSubmit','/board/upload/create');
window.addEventListener('load', function() {
    onImageChange('createImgInput', 'createImage', createForm);
    onImageChange('editImgInput', 'editImage', editForm);
});