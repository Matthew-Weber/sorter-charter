
 		Reuters.Graphics.sortingGraphic = new Reuters.Graphics.SortingSquares({
			el: "#reuters-sortingsquares",
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
//			legendtemplate:Reuters.Template.SortingSquareLegend,
//			tooltipTemplate:Reuters.Template.SortingSquaresTooltip,
//			margin:{left:1, top:35, right:1, bottom:0},
//			idField:"name",
		});  