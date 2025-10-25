let boxes=document.getElementsByClassName('palette-box');

for(let box of boxes)
    {
    var select = document.querySelector('#selecter')
    box.addEventListener("click", function(){
        var color = box.getAttribute("data-fame");
        document.body.style.backgroundColor=color
        select.textContent=color
    }
    
)}
    