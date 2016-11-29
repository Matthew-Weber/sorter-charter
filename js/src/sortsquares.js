Reuters = Reuters || {};
Reuters.Graphics = Reuters.Graphics || {};
//back to here
Reuters.Graphics.SortingSquares = Backbone.View.extend({
	data: undefined,
	dataURL:undefined,
	legendtemplate:Reuters.Graphics.sorterCharter.Template.SortingSquareLegend,
	tooltipTemplate:Reuters.Graphics.sorterCharter.Template.SortingSquaresTooltip,
	idField:"id",
	colorRange:[blue2,blue3,blue4,blue5],
	maxAcross:3,
	boxSize:25,
	margin:{left:1, top:35, right:1, bottom:0},
	totalHeightObj:{},
	initialize: function(opts){
		var self = this;
		this.options = opts; 		
		
		// if we are passing in options, use them instead of the defualts.
		_.each(opts, function(item, key){
			self[key] = item;
		});	
		
		if (!self.options.maxAcross){self.options.maxAcross = self.maxAcross}

		//Test which way data is presented and load appropriate way
		if (this.dataURL.indexOf("csv") == -1 && !_.isObject(this.dataURL)){
			d3.json(self.dataURL, function(data){
				self.parseData (data);
			});
		} 
		if (this.dataURL.indexOf("csv") > -1){
			d3.csv(self.dataURL, function(data){
				self.parseData (data);
			});
		}
		if (_.isObject(this.dataURL)){
			setTimeout(function(){
				self.parseData (self.dataURL);											
			}, 100);
		}	
	//end of initialize		
	},
	parseData: function(data){
		var self = this;

		self.data = data;		

		if(!self.options.idField){
			self.data.forEach(function(d,i){
				d.id = i
			})
		}		
		self.targetDiv = self.$el.attr("id");
		self.chartId = "#"+self.targetDiv+"Chart"

		self.parseDate = d3.time.format("%Y-%m-%d").parse
		self.parseYear = d3.time.format("%m/%d/%Y").parse
		self.formatDate = d3.time.format("%B %e, %Y")
		self.formatYear = d3.time.format("%Y")
		
		if(!self.buttonText){
			self.buttonText = self.buttonColumns
		}
		
		if(!self.initialSort){
			self.initialSort = self.buttonColumns[0]
		}
		self.category = self.initialSort

		if (!self.colorDomain){
			self.colorDomain = _.uniq(_.pluck(data, self.colorField))
		}

		self.color=d3.scale.ordinal()
			.domain(self.colorDomain)
			.range(self.colorRange)

		self.$el.html(self.legendtemplate({self:self}))
		self.width = $(self.chartId).width() - self.margin.left-self.margin.right

		self.render()

	},
	setPositions: function(category){
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

		if ($(window).width() < 600){
			self.maxAcross = 1
		}else{
			self.maxAcross = self.options.maxAcross
		}			
		
		var nest = d3.nest()
			.key(function(d) { return d[category]; })
			.map(self.data)

		var keys = d3.keys(nest)

		self.categoryLength = keys.length

		self.sectionLength = self.width / self.categoryLength
		self.boxesPerRow = Math.floor( self.sectionLength / self.boxSize) - 1
		self.labels = []

		if (self.categoryLength > self.maxAcross){	
			self.sectionLength = self.width / self.maxAcross
			self.boxesPerRow = Math.floor( self.sectionLength / self.boxSize) - 1
			self.rows = Math.ceil(self.categoryLength/self.maxAcross);
			
			var longest = 0;
			
			_.each(nest, function(d,key){
				if (d.length > longest){longest = d.length}
			})
			
			var depth = Math.ceil(longest / self.boxesPerRow)
			var sectionHeight = depth * self.boxSize + (self.boxSize *2)
			self.height = sectionHeight *self.rows;

			keys.forEach(function(item,index){
		        var	columnadjuster = Math.floor(index%self.maxAcross)
		        var rowadjuster = Math.floor(index/self.maxAcross)				
				var obj = {
					name:item +" ("+nest[item].length +")"				
				}
				nest[item].forEach(function(d,i){
					d.smallpositionX = (Math.floor(i%self.boxesPerRow)) *self.boxSize;
					d.smallpositionY = (Math.floor(i/self.boxesPerRow))*self.boxSize;
					d.masterpositionX = self.width*columnadjuster / self.maxAcross
					d.masterpositionY = (self.height*rowadjuster / self.rows) ;
					d.x = (Math.floor(i%self.boxesPerRow)) *self.boxSize + self.width*columnadjuster / self.maxAcross;
					d.y = (Math.floor(i/self.boxesPerRow))*self.boxSize + self.height*rowadjuster / self.rows
					obj.x = self.width*columnadjuster / self.maxAcross
					obj.y = self.height*rowadjuster / self.rows - (self.boxSize/2)
				})
				self.labels.push(obj)	
			})

			var highest = 0;
			self.data.forEach(function(d){
				if (d.y > highest){ highest = d.y}
			})
			self.height = highest+self.boxSize			
			self.totalHeightObj[category] = self.height;

			
		}else{

			keys.forEach(function(item,index){
				var obj = {
					name:item +" ("+nest[item].length +")"				
				}

				nest[item].forEach(function(d,i){
					d.smallpositionX = (Math.floor(i%self.boxesPerRow)) *self.boxSize;
					d.smallpositionY = (Math.floor(i/self.boxesPerRow))*self.boxSize;
					d.masterpositionX = self.width * index / self.categoryLength;
					d.masterpositionY = 0;
					d.x = (Math.floor(i%self.boxesPerRow)) *self.boxSize + self.width * index / self.categoryLength;
					d.y = (Math.floor(i/self.boxesPerRow))*self.boxSize
					obj.x = self.width * index / self.categoryLength;
					obj.y = 0 - (self.boxSize/2)

				})	
				self.labels.push(obj)	

			})

			var highest = 0;
			self.data.forEach(function(d){
				if (d.y > highest){ highest = d.y}
			})
			self.height = highest+self.boxSize;
			self.totalHeightObj[category] = self.height;						
		}

	},
	render: function() {
		var self = this;

		self.buttonColumns.forEach(function(d){
			self.setPositions(d)			
		})

		self.setPositions(self.category)

		self.masterHeight = 0;
		_.each(self.totalHeightObj, function(value,key){
			if (value > self.masterHeight){
				self.masterHeight = value
			}
			
		})

		self.svg = d3.select(self.chartId).append("svg")
		    .attr("width", self.width + self.margin.left + self.margin.right)
		    .attr("height", self.masterHeight + self.margin.top + self.margin.top)
			.append("g")
			.attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");  

		self.labels = self.svg.selectAll(".back-labels")
			.data(self.labels, function(d){return d.name})
			.enter()
			.append("text")
			.attr("x", function(d){
				return d.x
			})
			.attr("y", function(d){
				return d.y
			})
			.text(function(d){
				return d.name
			})
			.attr("class", "back-labels")
			
		self.addRects = self.svg.selectAll("rect")
			.data(self.data, function(d) {return d[self.idField];})
			.enter()
			.append("rect")
			.attr("width", self.boxSize)
			.attr("height", self.boxSize)
			.attr("x", function(d){
				return d.x
			})
			.attr("y", function(d){
				return d.y
			})
			.attr("fill", function(d){
				return self.color(d[self.colorField])
			})
			.attr('class', "sortingSquares")
			.attr("title", function(d){
				return self.tooltipTemplate({d:d})
			})


		self.$('.sortingSquares').tooltip({
    	        html: true, 
    	        placement:"bottom",
    	    });
				
		$(window).on("resize", _.debounce(function(event) {
			self.newWidth = self.$(self.chartId).width() - self.margin.left - self.margin.right;
			if (self.newWidth == self.width || self.newWidth <= 0){
				return
			}
			
			self.width = self.newWidth;

			self.update();
		},100));
		
		self.$(".chart-nav .btn").on("click", function(){
			self.category = $(this).attr("dataid")			
			self.update()
		})
		

	},
	update: function(){
		var self = this;

		self.buttonColumns.forEach(function(d){
			self.setPositions(d)			
		})
		self.masterHeight = 0;
		_.each(self.totalHeightObj, function(value,key){
			if (value > self.masterHeight){
				self.masterHeight = value
			}			
		})

		self.setPositions(self.category)

		d3.select(self.chartId).selectAll("svg")
			.transition()
			.duration(1000)
		    .attr("width", self.width + self.margin.left + self.margin.right)
		    .attr("height", self.masterHeight + self.margin.top + self.margin.top)


		self.addRects
			.transition()
			.duration(1000)
			.attr("x", function(d){
				return d.x
			})
			.attr("y", function(d){
				return d.y
			})

		self.svg.selectAll(".back-labels")
			.data(self.labels, function(d){return d.name})
			.enter()
			.append('text')
			.attr("x", function(d){
				return d.x
			})
			.attr("y", function(d){
				return d.y
			})
			.text(function(d){
				return d.name
			})
			.attr("class", "back-labels")
			.style("opacity",0)			

		self.svg.selectAll(".back-labels")
			.transition()
			.duration(1000)
			.attr("x", function(d){
				return d.x
			})
			.attr("y", function(d){
				return d.y
			})
			.text(function(d){
				return d.name
			})
			.style("opacity",1)

			
		self.svg.selectAll(".back-labels")
			.data(self.labels, function(d){return d.name})		
			.exit()
			.transition()
			.duration(1000)
			.style("opacity",0)
			.remove()
		
	},

//end of view
});
