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
        // To avoid blurred lines
        appCtx.translate(0.5, 0.5) 
        // set the width and height of the canvas   
        appCtx.canvas.width  = 600;
        appCtx.canvas.height = 300;
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

function delData(approve) {
    approve = confirm('Are you sure you want to delete the last data entered?')
    if(approve) {
        valueTotal -= chartValues[chartValues.length-1]
        chartLabels.pop();
        chartValues.pop();
        lastEntered= 'Data entered: ' + 'Label: ' + chartLabels + ', ' + 'Value: ' + chartValues;
        document.getElementById('feedback').innerHTML = lastEntered
    }    
}

// Accept user command to draw

function drawSelected(approveChart){
    if (chartValues.length === 0) {
        alert('You have not entered any values yet, please enter some values and try again.')
    }
    else {
        let radios = document.getElementsByName('chart');
        for (i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {                            
                chartDiagram =  radios[i].value;           

                // only one radio can be logically checked, don't check the rest
                break;
            }
        }
        approveChart = confirm('You are about to draw a ' + radios[i].value + '. Click OK to continue or cancel to choose another chart type.');
        if (approveChart){
            draw(chartDiagram);
            // reset the arrays after drawing
            chartLabels = [];
            chartValues = [];
            valueTotal = 0;
        }
    }
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
        appCtx.fillStyle = 'rgba(' + 127*(Math.floor(i+1)%3) +',' + 127*(Math.floor((i+1)/9)%3) + ',' + 127*(Math.floor((i+1)/3)%3) + ',.8)';

        appCtx.beginPath();
        appCtx.arc(appCtx.canvas.width/3, appCtx.canvas.height/2, 120, pieStart, pieEnd);
        appCtx.lineTo(appCtx.canvas.width/3, appCtx.canvas.height/2);
        appCtx.stroke();
        appCtx.fill();

        appCtx.font = '20px arial';        
        appCtx.fillText(arr1[i], 2*appCtx.canvas.width/3, 80+30*i);  
        appCtx.fillText(chartValues[i], 5*appCtx.canvas.width/6, 80+30*i);
        appCtx.fillStyle = 'black';        
        appCtx.fillText('Legend by colour: ', 2*appCtx.canvas.width/3,20);
        appCtx.fillText('Label', 2*appCtx.canvas.width/3, 50); 
        appCtx.fillText('Value', 5*appCtx.canvas.width/6, 50);             
    };
}

// Normalize function ensures that charts stay within the visible Y-axis

function normalize(num,arr2) {
    return 0.8*appCtx.canvas.height*arr2[i]/Math.max.apply(Math,chartValues);
}

//This function draws the X and Y axes on the canvas

function xYAxis() {
    if(chartValues.length !== 0){
        appCtx.beginPath();
        appCtx.moveTo(0.1*appCtx.canvas.width,0);
        appCtx.lineTo(0.1*appCtx.canvas.width,0.8*appCtx.canvas.height);
        appCtx.lineTo(appCtx.canvas.width,0.8*appCtx.canvas.height);
        appCtx.strokeStyle = 'black';
        appCtx.stroke();
        appCtx.moveTo(0.1*appCtx.canvas.width,0);
    }    
}

//Histogram

function histogram(arr1, arr2){     
    xYAxis();        
    for(i=0; i<arr2.length; i++){
        appCtx.fillStyle = 'rgba(' + 127*(Math.floor((i+1)/3)%3) +',' + 127*(Math.floor((i+1)/9)%3) + ',' + 127*(Math.floor(i+1)%3) + ',1)';  
        appCtx.fillRect(0.1*appCtx.canvas.width+53*i,0.8*appCtx.canvas.height-normalize(i, arr2),53,normalize(i, arr2));        
        appCtx.font = '10px arial';
        appCtx.fillText(arr1[i], 0.1*appCtx.canvas.width+53*i,10+0.8*appCtx.canvas.height);
        appCtx.fillStyle = 'black'
        appCtx.fillText(arr2[i], 0.1*appCtx.canvas.width+53*i,10+0.8*appCtx.canvas.height-normalize(i, arr2));
    }
}

//Bar Chart

function barChart(arr1, arr2){
    xYAxis();    
    for(i=0; i<arr2.length; i++){
        appCtx.fillStyle = 'rgba(' + 127*(Math.floor((i+1)/3)%3) +',' + 127*(Math.floor((i+1)/9)%3) + ',' + 127*(Math.floor(i+1)%3) + ',1)';   
        appCtx.fillRect(13+(0.1*appCtx.canvas.width)+53*i,0.8*appCtx.canvas.height-normalize(i, arr2),40,normalize(i, arr2));        
        appCtx.font = '10px arial';
        appCtx.fillText(arr1[i], 13+(0.1*appCtx.canvas.width)+53*i,10+0.8*appCtx.canvas.height);
        appCtx.fillStyle = 'black'
        appCtx.fillText(arr2[i], 13+0.1*appCtx.canvas.width+53*i,10+0.8*appCtx.canvas.height-normalize(i, arr2));
    }
}

//Line Chart

function lineChart(arr1, arr2){
    xYAxis();            
    appCtx.moveTo(0.1*appCtx.canvas.width,0.8*appCtx.canvas.height-normalize(0, arr2));
    for(i=0; i<arr2.length; i++){        
        appCtx.lineTo(0.1*appCtx.canvas.width+53*i,0.8*appCtx.canvas.height-normalize(i, arr2));
        appCtx.stroke();
        appCtx.strokeStyle= 'blue';
        appCtx.font = '10px arial';
        appCtx.fillText(arr1[i], 0.1*appCtx.canvas.width+53*i,10+0.8*appCtx.canvas.height);
        appCtx.fillText(arr2[i], 0.1*appCtx.canvas.width+53*i,10+0.8*appCtx.canvas.height-normalize(i, arr2));
    }
}

//Table of Values

function tableHeading() {
    appCtx.beginPath();
    appCtx.strokeRect(0.1*appCtx.canvas.width, 5, 0.4*appCtx.canvas.width, 30);
    appCtx.font = '20px arial';
    appCtx.fillText('Data Labels', 20+0.1*appCtx.canvas.width, 25);
    appCtx.strokeRect(0.5*appCtx.canvas.width, 5, 0.4*appCtx.canvas.width, 30);
    appCtx.fillText('Data Values', 20+0.5*appCtx.canvas.width, 25);
    appCtx.strokeStyle = 'black';       
}

function tableChart(arr1, arr2){
    if(arr2.length !== 0){
        tableHeading();
    }
    
    for(i=0; i<arr2.length; i++){     
        appCtx.strokeRect(0.1*appCtx.canvas.width,35+25*i,0.4*appCtx.canvas.width,25);
        appCtx.strokeRect(0.5*appCtx.canvas.width,35+25*i,0.4*appCtx.canvas.width,25);
        appCtx.font = '20px arial';
        appCtx.fillText(arr1[i], 20+0.1*appCtx.canvas.width,55+25*i);
        appCtx.fillText(arr2[i], 20+0.5*appCtx.canvas.width,55+25*i);
    }
}

//Clear all charts on Canvas to start new drawing

function clearCanvas(approve) {
    approve = confirm('Are you sure you want to clear all drawings and start again?');
    if(approve) {
        appCtx.clearRect(0, 0, appCtx.canvas.width, appCtx.canvas.width);
    }    
}

// Print Chart

function printChart() {
    window.location = canvas.toDataURL('image/png');
}
