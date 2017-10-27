

 		Reuters.Graphics.sortingGraphic = new Reuters.Graphics.SortingSquares({
			el: "#reutersGraphic-chart1",
			//dataURL: '//d3sl9l9bcxfb5q.cloudfront.net/json/mo-egypt-judges-amada',
			dataURL:"data/data.csv",
			buttonColumns: [ "agegroup", "city2","datetext"],
			buttonText: [ "Age","Location","Date", ],
			initialSort: "city2",
			colorField: "city2",
			colorDomain: ["Nairobi","Kisumu","Siaya","Homa Bay"],
			colorRange: [gray4,red5,blue2,green4],
			maxAcross:3,
			boxSize:25,
//			labelGap:20, // how much space to leave for the label.  the label will adjust to top of space.  May have to adjust top margin as well.			
//			legendtemplate:Reuters.Graphics.Template.SortingSquareLegend,
//			tooltipTemplate:Reuters.Graphics.Template.SortingSquaresTooltip,
//			labelTemplate:Reuters.Graphics.Template.SortingSquaresLabel, // you can adjust the labelTemplate
//			margin:{left:1, top:35, right:1, bottom:0},
//			idField:"name",
/*			//can add a custom sort here.  Can specifiy for each self.category an explicit array if you wish.
			sortData:function(){
				var self = this;	
				self.data.sort(function(a,b){
					var counts = _.countBy(self.data, self.category)
					if (counts[a[self.category]] > counts[b[self.category]]){ return -1}
					if (counts[a[self.category]] < counts[b[self.category]]){ return 1}
					if (counts[a[self.category]] == counts[b[self.category]]){ 
							if (self.colorDomain.indexOf(a[self.colorField]) > self.colorDomain.indexOf(b[self.colorField])){ return 1}
							if (self.colorDomain.indexOf(a[self.colorField]) < self.colorDomain.indexOf(b[self.colorField])){ return -1}
					}
					return 0				
				})
		
			},
*/
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