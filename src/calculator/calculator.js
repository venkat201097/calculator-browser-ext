window.onload = function(){
    document.body.focus();
    clearDisplay();
}

display = document.getElementById("display");
hasEvaluated = false;
inputKeys = new Set(["1","2","3","4","5","6","7","8","9","0","+","-","*","/",".","(",")","%"])
numericKeys = new Set(["1","2","3","4","5","6","7","8","9","0"])
evaluateKey = "Enter"
backspaceKey = "Backspace"
errorMsg = "ERROR"
buttons = document.getElementsByTagName("button")

// Disable button trigger on pressing "Enter".
Array.from(buttons).forEach(element => {
    element.addEventListener("keydown", function(event){
        if(event.key=="Enter"){
            event.preventDefault();
        }
    });
});

historyOn = false;
historyDropdown = document.getElementById("history-block");
document.addEventListener("click", function(event){
    if(event.target.id=='history-button'){
        return;
    }
    if(!historyDropdown.contains(event.target) || event.target.className == "history-dd-button"){
        historyOn = false;
        $('#history-block').hide()
    }

})
$('#history-button').click(function(event) {
    historyOn = !historyOn;
    if(historyOn)
        displayHistory();
    $('#history-button').toggleClass('show-history');
    $('#history-block').slideToggle();
});

// Handle keydown events in calculator. Ignore keydown if focus is on the display box (to prevent repeated handling).

document.addEventListener("keydown", function(event){
    historyOn = false;
    $('#history-block').hide();
    if(document.activeElement.id!="display")
        keydownEventHandler(event);
});

// Evaluate expression if "Enter" is hit in the input box.
document.getElementById("display").addEventListener("keydown", function(event){
    if(event.key=="Enter"){
        evaluateExpression();
    }
})

// Keydown handler
function keydownEventHandler(event){
    if(event.repeat)
        return;
    key = event.key;
    if(key == backspaceKey)
        backSpace()
    else if(key == evaluateKey){
        evaluateExpression()
    }
    else if(inputKeys.has(key)){
        changeDisplay(key)
    }
}

// function changeDisplay2(name, resetDisplay=false){
//     // display = document.getElementById("display");
//     if(display.value=="0" && name=="0")
//         return;
    
//     if(name==backspaceKey){
//         if(display.value==errorMsg)
//             display.value = ""
//         else
//             display.value = display.value.slice(0, -1);
//         if(display.value=="")
//             display.value = "0";
//         return;
//     }

//     if(hasEvaluated || display.value=="0"){
//         if(!isNaN(name) || resetDisplay){
//             display.value = "";
//         }
//         if(hasEvaluated)
//             hasEvaluated = false;
//     }
//     display.value += name;
// }

function backSpace(){
    if(display.value == errorMsg)
        clearDisplay()
    else{
        display.value = display.value.slice(0, -1);
        if(display.value == "")
            clearDisplay()
    }
}

function changeDisplay(value, resetDisplay=false){    
    if(display.value == errorMsg || ((display.value == "0" || hasEvaluated) && numericKeys.has(value)) || resetDisplay){
        display.value = "";
    }

    if(hasEvaluated)
        hasEvaluated = false;

    display.value += value;
}

function evaluateExpression(){
    hasEvaluated = true;
    expression = display.value;
    try{
        result = eval(expression).toString();
        display.value = result;
        if(isNaN(expression))
            store(expression, result);
    } 
    catch (error){
        display.value = errorMsg;
        console.log(error)
    }
}

function clearDisplay(){
    document.getElementById("display").value = 0;
}

async function store(expr, result){
    currentStore = await browser.storage.local.get({'calculator_storage':[]});
    currentStore = currentStore['calculator_storage'];
    console.log(typeof currentStore);
    currentStore.push([expr, result]);
    console.log(currentStore)
    browser.storage.local.set({
        'calculator_storage': currentStore
    });
}
async function clearHistory(){
    await browser.storage.local.clear();
    return displayHistory();
}
async function displayHistory(){
    historyContent = document.getElementById("history-content");
    clearHistoryButton = document.getElementById("clear-history");
    currentStore = await browser.storage.local.get({'calculator_storage':[]});
    currentStore = currentStore['calculator_storage'];
    if(currentStore.length == 0){
        clearHistoryButton.style.display = 'none';
        historyContent.innerHTML = "No calculations in storage";
        console.log(clearHistoryButton.style.display)
        return;
    }
    clearHistoryButton.style.display = 'block';
    displayHtml = "";
    tableBodyString = "";
    currentStore.forEach(entry => {
        lhs = entry[0];
        rhs = entry[1];
        lhsCellString = `<button name="${lhs}" onclick="clearDisplay(); changeDisplay(this.name, true)" class="history-dd-button">${lhs}</button>`
        rhsCellString = `<button name="${rhs}" onclick="clearDisplay(); changeDisplay(this.name, true)" class="history-dd-button">${rhs}</button>`
        rowString = `${lhsCellString} = ${rhsCellString}<br>`
        tableBodyString = rowString + tableBodyString;
    });
    historyTable = `${tableBodyString}`
    
    historyContent.innerHTML = historyTable
}

// function parseExpression(expr){
//     parsedExpr = "";
//     for(i=0;i<expr.length;i++){
//         if(!isNaN(expr[i]))
//             parsedExpr += expr[i];
//         else if()
//     }
// }