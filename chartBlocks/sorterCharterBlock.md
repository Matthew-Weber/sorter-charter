
 		Reuters.Graphics.sortingGraphic = new Reuters.Graphics.SortingSquares({
			el: "#reutersGraphic-chart1",
			//dataURL: '//d3sl9l9bcxfb5q.cloudfront.net/json/mo-egypt-judges-amada',
			dataURL:"data/data.csv",
 			buttonColumns:["terrorism","sentencegroup","type"],
			buttonText:["Charge","Sentence","Classification"],
			initialSort:"type",
			colorField:"type",
			colorDomain:["Islamic State","Domestic anti-government"],
			colorRange:[rose4,tangerine2,tangerine4],
			maxAcross:10,
			boxSize:25,
//			legendtemplate:Reuters.Graphics.Template.SortingSquareLegend,
//			tooltipTemplate:Reuters.Graphics.Template.SortingSquaresTooltip,
//			margin:{left:1, top:35, right:1, bottom:0},
//			idField:"name",
		});  

Reuters.Graphics.sortingGraphic.on("renderChart:start", function(evt){
    var self = this;
    
})		
Reuters.Graphics.sortingGraphic.on("renderChart:end", function(evt){
    var self = this;
    
})		
Reuters.Graphics.sortingGraphic.on("update:start", function(evt){
    var self = this;
    
})		
Reuters.Graphics.sortingGraphic.on("update:end", function(evt){
    var self = this;
    
})		
Reuters.Graphics.sortingGraphic.on("setPositions:start", function(evt){
    var self = this;
    
})		
Reuters.Graphics.sortingGraphic.on("setPositions:end", function(evt){
    var self = this;
    
})			