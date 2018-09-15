const cells = document.getElementById('boardTable').getElementsByTagName('tr');
for (let i=1,len=cells.length; i<len; i++) {
    const innerCells = cells[i].getElementsByTagName('td');
    const number = innerCells[0].innerText
        ,title = innerCells[1].innerText
        ,content = innerCells[2].innerText;
    document.getElementById('edit'+number).addEventListener('click', () => {
        document.getElementById('prevTitleLabel').innerText = title;
        document.getElementById('prevContentLabel').innerText = content;
        document.getElementById('editTable').dataset.number = number;
        document.getElementById('editTable').dataset.title = title;
        document.getElementById('editTable').dataset.content = content;
        showEditPage();
    });
    document.getElementById('delete'+number).addEventListener('click', () => {
        const xhr = new XMLHttpRequest();
        const data = {title:title, content:content, number:number, actiontype:'delete'};
        xhr.addEventListener('load', () => {
            showMainPage();
            window.location.reload();
        });
        xhr.open('post','/board',true);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify(data));
    });
}
function postCreateData() {
    const xhr = new XMLHttpRequest();
    const title = document.getElementById('createTitle').value;
    const content = document.getElementById('createContent').value;
    const data = {title:title, content:content, actiontype:'create'};
    xhr.addEventListener('load', () => {
        showMainPage();
        window.location.reload();
    });
    xhr.open('post','/board', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
function postEditData() {
    const xhr = new XMLHttpRequest();
    const number = document.getElementById('editTable').dataset.number;
    const title = document.getElementById('editTitle').value;
    const content = document.getElementById('editContent').value;
    const data = {title:title, content:content, number:number, actiontype:'edit'};
    xhr.addEventListener('load', () => {
        showMainPage();
        window.location.reload();
    });
    xhr.open('post','/board', true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify(data));
}
function showMainPage(){
    document.querySelector('#mainBoardPage').className = 'showPage';
    document.querySelector('#createBoardPage').className = 'hidePage';
    document.querySelector('#editBoardPage').className = 'hidePage'
}
function showCreatePage(){
    document.querySelector('#mainBoardPage').className = 'hidePage';
    document.querySelector('#createBoardPage').className = 'showPage';
    document.querySelector('#editBoardPage').className = 'hidePage'
}
function showEditPage(){
    document.querySelector('#mainBoardPage').className = 'hidePage';
    document.querySelector('#createBoardPage').className = 'hidePage';
    document.querySelector('#editBoardPage').className = 'showPage'
}