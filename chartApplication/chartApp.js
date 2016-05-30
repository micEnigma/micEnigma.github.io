
// This code draws charts on an html5 canvas based on user data input

// Declare global variables for canvas and context

let canvas = 0;  
let appCtx = 0;
let chartDiagram = '';
let chartLabels = [];
let chartValues = [];
let valueTotal = 0;

// Check that the browser is compatible with Html5 Canvas

function checkCompatibility() {
    canvas = document.getElementById('board');    
    if (canvas.getContext) {
        // if browser is compatible get the 2d canvas ready
        appCtx = canvas.getContext('2d');      
    }
    else {
        alert('Your current browser is not compatible with this application. Please try a different one.');
    }
}

// Accept user data input and display entries by the user

function enterData() {
    let lastLabel= document.getElementById('Dlabel').value;
    let lastValues= parseInt(document.getElementById('Dvalue').value);
    // Disallow users from inputing negative numbers
    if(lastValues < 0) {
        alert('Negative values are not accepted in this version, think positively');
    }
    else {
        chartLabels.push(lastLabel);
        chartValues.push(lastValues);
        valueTotal += lastValues;
        let lastEntered= 'Data entered: ' + 'Label: ' + chartLabels + ', ' + 'Value: ' + chartValues;    
        document.getElementById('feedback').innerHTML = lastEntered;       
    }
}    
    

// Delete the last data entered to correct errors

function delData() {
    let approveDel = confirm('Are you sure you want to delete the last data entered?')
    if(approveDel) {
        valueTotal -= chartValues[chartValues.length-1]
        chartLabels.pop();
        chartValues.pop();
        lastEntered= 'Data entered: ' + 'Label: ' + chartLabels + ', ' + 'Value: ' + chartValues;
        document.getElementById('feedback').innerHTML = lastEntered
    }    
}

// Accept user command to draw

function drawSelected(){
    let radios = document.getElementsByName('chart');
    for (i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {            
            confirm('You are about to draw a ' + radios[i].value);
            chartDiagram =  radios[i].value;           

            // only one radio can be logically checked, don't check the rest
            break;
        }
    }    
    draw(chartDiagram);
    // reset the arrays after drawing
    chartLabels = [];
    chartValues = [];
}

//Draw cases

function draw(chartType){
    switch(chartType){
        case 'Pie Chart': 
            // convert input to radians
            function valueAngle(num){
                return 2*Math.PI*num/valueTotal;
            }
          
            pieChart(chartLabels, chartValues.map(valueAngle));
            break;

        case 'Histogram':     
            histogram(chartLabels,chartValues);
            break;

        case 'Bar Chart':            
            barChart(chartLabels,chartValues);
            break;

        case 'Line Chart':            
            lineChart(chartLabels,chartValues);
            break;

        case 'Table Chart':            
            tableChart(chartLabels,chartValues);
            break;

        default:
            alert('Input not understood, please refresh page and try again');            
    }    
}

//Chart functions section

//Pie Chart

function pieChart(arr1,arr2){
    let pieStart = 0;
    let pieEnd = 0;
    for(i=0; i<arr2.length; i++){
        pieStart = pieEnd;
        pieEnd += arr2[i];        
        
        // this changes the colour of the chart sectors from red through to blue
        appCtx.fillStyle = 'rgba(' + Math.floor(128-128*i/arr2.length) +',' + Math.floor(192*i/arr2.length) + ',' + Math.floor(255*i/arr2.length) + ',0.8)';

        appCtx.beginPath();
        appCtx.arc(100, 75, 60, pieStart, pieEnd);
        appCtx.lineTo(100,75);
        appCtx.fill();

        appCtx.font = '10px arial';        
        appCtx.fillText('Legend by colour: ', 200,20);
        appCtx.fillText('Label', 200, 35); 
        appCtx.fillText('Value', 250, 35);  
        appCtx.fillText(arr1[i], 200, 50+15*i);  
        appCtx.fillText(chartValues[i], 250, 50+15*i);               
    };
}

// Normalize function ensures that charts stay within the visible Y-axis

function normalize(num,arr2) {
    return 120*arr2[i]/Math.max.apply(Math,chartValues);
}

//This function draws the X and Y axes on the canvas

function xYAxis() {
    if(chartValues.length !== 0){
        appCtx.beginPath();
        appCtx.moveTo(45,0);
        appCtx.lineTo(45,120);
        appCtx.lineTo(300,120);
        appCtx.strokeStyle = 'black';
        appCtx.stroke();
        appCtx.moveTo(45,0);
    }    
}

//Histogram

function histogram(arr1, arr2){     
    xYAxis();
        
    for(i=0; i<arr2.length; i++){        

        appCtx.fillStyle = 'rgba(' + Math.floor(255-128*i/arr2.length) +',' + Math.floor(128*i/arr2.length) + ',' + Math.floor(255*i/arr2.length) + ',1)';        

        appCtx.fillRect(45+40*i,120-normalize(i, arr2),40,normalize(i, arr2));        
        appCtx.font = '7px arial';
        appCtx.fillText(arr1[i], 45+40*i,130);
        appCtx.fillStyle = 'black'
        appCtx.fillText(arr2[i], 45+40*i,125-normalize(i, arr2));
    };
}

//Bar Chart

function barChart(arr1, arr2){
    xYAxis();
    
    for(i=0; i<arr2.length; i++){
        appCtx.fillStyle = 'rgba(' + Math.floor(255-128*i/arr2.length) +',' + Math.floor(128*i/arr2.length) + ',' + Math.floor(255*i/arr2.length) + ',1)';   
        appCtx.fillRect(55+45*i,120-normalize(i, arr2),30,normalize(i, arr2));
        appCtx.font = '7px arial';
        appCtx.fillText(arr1[i], 55+45*i,130);
        appCtx.fillStyle = 'black'
        appCtx.fillText(arr2[i], 47+45*i,125-normalize(i, arr2));
    };
}

//Line Chart

function lineChart(arr1, arr2){
    xYAxis();    
        
    appCtx.moveTo(45,120-normalize(0, arr2));
    for(i=0; i<arr2.length; i++){        
        appCtx.lineTo(45+40*i,120-normalize(i, arr2));
        appCtx.stroke();
        appCtx.strokeStyle= 'blue';
        appCtx.font = '7px arial';
        appCtx.fillText(arr1[i], 45+40*i,130);
        appCtx.fillText(arr2[i], 46+40*i,128-normalize(i, arr2));
    };
}

//Table of Values

function tableHeading() {
    appCtx.beginPath();
    appCtx.strokeRect(45, 0, 120, 15);

    appCtx.font = '10px arial';
    appCtx.fillText('Data Labels', 65, 10);

    appCtx.strokeRect(165, 0, 120, 15);
    appCtx.fillText('Data Values', 185, 10);

    appCtx.strokeStyle = 'black';       
}

function tableChart(arr1, arr2){
    if(arr2.length !== 0){
        tableHeading();
    }
    
    for(i=0; i<arr2.length; i++){
     
        appCtx.strokeRect(45,15+15*i,120,15);
        appCtx.strokeRect(165,15+15*i,120,15);
        appCtx.font = '10px arial';
        appCtx.fillText(arr1[i], 65,25+15*i);
        appCtx.fillText(arr2[i], 185,25+15*i);
    }
}
