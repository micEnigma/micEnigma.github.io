function Chart(x,y){
    this.x = x;
    this.y = y;
}

function PieChart(radius, startAngle, endAngle){
    this.radius = radius;
    this.startAngle = startAngle;
    this.stopAngle = endAngle;
}

function Histogram(width, height){
    this.width = width;
    this.height = height;
}

function BarChart(width, height){
    this.width = width;
    this.height = height;
}

function LineChart(){
    
}


PieChart.prototype = new Chart();
Histogram.prototype = new Chart();
BarChart.prototype = new Chart();
LineChart.prototype = new Chart();


