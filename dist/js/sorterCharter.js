(function () {
  window["Reuters"] = window["Reuters"] || {};
  window["Reuters"]["Graphics"] = window["Reuters"]["Graphics"] || {};
  window["Reuters"]["Graphics"]["sorterCharter"] = window["Reuters"]["Graphics"]["sorterCharter"] || {};
  window["Reuters"]["Graphics"]["sorterCharter"]["Template"] = window["Reuters"]["Graphics"]["sorterCharter"]["Template"] || {};

  window["Reuters"]["Graphics"]["sorterCharter"]["Template"]["SortingSquareLegend"] = function (t) {
    var __t,
        __p = '',
        __j = Array.prototype.join;
    function print() {
      __p += __j.call(arguments, '');
    }
    __p += '<div class="chart-nav">\n	<div class="navContainer">\n        <div class="btn-group nav-options horizontal" data-toggle="buttons">\n            ';
    t.self.buttonColumns.forEach(function (d, i) {
      ;
      __p += '\n                <label dataid="' + ((__t = d) == null ? '' : __t) + '" class="btn btn-primary ';
      if (d == t.self.initialSort) {
        ;
        __p += 'active';
      };
      __p += ' smaller">\n                    <input type="radio" name="nav-options" autocomplete="off"> \n                    ' + ((__t = t.self.buttonText[i]) == null ? '' : __t) + '\n                </label>\n            ';
    });
    __p += '\n        </div>    		    		\n	</div>    	\n</div>\n\n\n<div class="chart-holder">\n    ';
    if (t.self.colorField) {
      ;
      __p += '\n    	<div class="sorter-nested-legend">\n            ';
      t.self.colorDomain.forEach(function (d, i) {
        ;
        __p += '\n                <div class ="sorter-legend-item">\n                	<div class = "sorter-legend-square " style="background-color:' + ((__t = t.self.colorRange[i]) == null ? '' : __t) + ';"></div>\n                	<p class = "sorter-legend-text">' + ((__t = d) == null ? '' : __t) + '</p>\n                </div>\n            ';
      });
      __p += '        \n    	</div>\n        <div class="sorter-nested-chart" id="' + ((__t = t.self.targetDiv) == null ? '' : __t) + 'Chart"></div>\n    ';
    } else {
      ;
      __p += '\n        <div class="" id="' + ((__t = t.self.targetDiv) == null ? '' : __t) + 'Chart"></div>\n    ';
    };
    __p += '\n</div>\n\n\n\n';
    return __p;
  };
})();
(function () {
  window["Reuters"] = window["Reuters"] || {};
  window["Reuters"]["Graphics"] = window["Reuters"]["Graphics"] || {};
  window["Reuters"]["Graphics"]["sorterCharter"] = window["Reuters"]["Graphics"]["sorterCharter"] || {};
  window["Reuters"]["Graphics"]["sorterCharter"]["Template"] = window["Reuters"]["Graphics"]["sorterCharter"]["Template"] || {};

  window["Reuters"]["Graphics"]["sorterCharter"]["Template"]["SortingSquaresLabel"] = function (t) {
    var __t,
        __p = '';
    __p += ((__t = t.data.name) == null ? '' : __t) + ' (' + ((__t = t.data.length) == null ? '' : __t) + ')';
    return __p;
  };
})();
(function () {
  window["Reuters"] = window["Reuters"] || {};
  window["Reuters"]["Graphics"] = window["Reuters"]["Graphics"] || {};
  window["Reuters"]["Graphics"]["sorterCharter"] = window["Reuters"]["Graphics"]["sorterCharter"] || {};
  window["Reuters"]["Graphics"]["sorterCharter"]["Template"] = window["Reuters"]["Graphics"]["sorterCharter"]["Template"] || {};

  window["Reuters"]["Graphics"]["sorterCharter"]["Template"]["SortingSquaresTooltip"] = function (t) {
    var __t,
        __p = '',
        __j = Array.prototype.join;
    function print() {
      __p += __j.call(arguments, '');
    }
    __p += '\n<p class="tooltip-title">' + ((__t = t.d.name) == null ? '' : __t) + '</p>\n<p class="tooltip-subhead">' + ((__t = t.d.sentence) == null ? '' : __t) + ' ';
    if (t.d.sentence != 'life') {
      ;
      __p += ' years ';
    };
    __p += '</p>\n<p class="tooltip-text">' + ((__t = t.d.terrorism) == null ? '' : __t) + '</h2>';
    return __p;
  };
})();
Reuters = Reuters || {};
Reuters.Graphics = Reuters.Graphics || {};
//back to here
Reuters.Graphics.SortingSquares = Backbone.View.extend({
	data: undefined,
	dataURL: undefined,
	legendtemplate: Reuters.Graphics.sorterCharter.Template.SortingSquareLegend,
	tooltipTemplate: Reuters.Graphics.sorterCharter.Template.SortingSquaresTooltip,
	labelTemplate: Reuters.Graphics.sorterCharter.Template.SortingSquaresLabel,
	idField: "id",
	colorRange: [blue2, blue3, blue4, blue5],
	maxAcross: 3,
	boxSize: 25,
	margin: { left: 1, top: 35, right: 1, bottom: 0 },
	totalHeightObj: {},
	initialize: function initialize(opts) {
		var self = this;
		this.options = opts;

		// if we are passing in options, use them instead of the defualts.
		_.each(opts, function (item, key) {
			self[key] = item;
		});
		if (!self.labelGap) {
			self.labelGap = self.boxSize;
		}
		if (!self.options.maxAcross) {
			self.options.maxAcross = self.maxAcross;
		}

		//Test which way data is presented and load appropriate way
		if (this.dataURL.indexOf("csv") == -1 && !_.isObject(this.dataURL)) {
			d3.json(self.dataURL, function (data) {
				self.parseData(data);
			});
		}
		if (this.dataURL.indexOf("csv") > -1) {
			d3.csv(self.dataURL, function (data) {
				self.parseData(data);
			});
		}
		if (_.isObject(this.dataURL)) {
			setTimeout(function () {
				self.parseData(self.dataURL);
			}, 100);
		}
		//end of initialize		
	},
	parseData: function parseData(data) {
		var self = this;

		self.data = data;

		if (!self.options.idField) {
			self.data.forEach(function (d, i) {
				d.id = i;
			});
		}
		self.targetDiv = self.$el.attr("id");
		self.chartId = "#" + self.targetDiv + "Chart";

		self.parseDate = d3.time.format("%Y-%m-%d").parse;
		self.parseYear = d3.time.format("%m/%d/%Y").parse;
		self.formatDate = d3.time.format("%B %e, %Y");
		self.formatYear = d3.time.format("%Y");

		if (!self.buttonText) {
			self.buttonText = self.buttonColumns;
		}

		if (!self.initialSort) {
			self.initialSort = self.buttonColumns[0];
		}
		self.category = self.initialSort;

		if (!self.colorDomain) {
			self.colorDomain = _.uniq(_.pluck(data, self.colorField));
		}

		self.color = d3.scale.ordinal().domain(self.colorDomain).range(self.colorRange);

		self.$el.html(self.legendtemplate({ self: self }));
		self.width = $(self.chartId).width() - self.margin.left - self.margin.right;

		self.render();
	},
	sortData: function sortData() {
		var self = this;
		self.data.sort(function (a, b) {
			var counts = _.countBy(self.data, self.category);
			if (counts[a[self.category]] > counts[b[self.category]]) {
				return -1;
			}
			if (counts[a[self.category]] < counts[b[self.category]]) {
				return 1;
			}
			if (counts[a[self.category]] == counts[b[self.category]]) {
				if (self.colorDomain.indexOf(a[self.colorField]) > self.colorDomain.indexOf(b[self.colorField])) {
					return 1;
				}
				if (self.colorDomain.indexOf(a[self.colorField]) < self.colorDomain.indexOf(b[self.colorField])) {
					return -1;
				}
			}
			return 0;
		});
	},

	setPositions: function setPositions(category) {
		var self = this;
		self.trigger("setPositions:start");

		self.sortData();

		if ($(window).width() < 600) {
			self.maxAcross = 1;
		} else {
			self.maxAcross = self.options.maxAcross;
		}

		self.nest = d3.nest().key(function (d) {
			return d[category];
		}).map(self.data);

		self.keys = d3.keys(self.nest);

		self.categoryLength = self.keys.length;

		self.labels = [];

		self.sectionLength = self.width / self.maxAcross;
		self.boxesPerRow = Math.floor(self.sectionLength / self.boxSize) - 1;
		self.rows = Math.ceil(self.categoryLength / self.maxAcross);

		self.height = 0;

		var sectionHeightObject = {};
		self.keys.forEach(function (item, index) {
			var rowadjuster = Math.floor(index / self.maxAcross);
			sectionHeightObject[rowadjuster] = sectionHeightObject[rowadjuster] || [];
			sectionHeightObject[rowadjuster].push(item);
		});

		self.keys.forEach(function (item, index) {

			var columnadjuster = Math.floor(index % self.maxAcross);
			var rowadjuster = Math.floor(index / self.maxAcross);

			var longest = 0;
			sectionHeightObject[rowadjuster].forEach(function (catName) {
				if (self.nest[catName].length > longest) {
					longest = self.nest[catName].length;
				}
			});

			var depth = Math.ceil(longest / self.boxesPerRow);
			var sectionHeight = depth * self.boxSize + self.labelGap;

			if (self.maxAcross == 1) {
				var numberOfItems = self.nest[item].length;
				var numberOfRows = Math.ceil(numberOfItems / self.boxesPerRow);
				sectionHeight = numberOfRows * self.boxSize;
			}

			var obj = {
				name: item,
				length: self.nest[item].length,
				width: self.boxesPerRow * self.boxSize
			};

			self.nest[item].forEach(function (d, i) {
				d.x = Math.floor(i % self.boxesPerRow) * self.boxSize + self.width * columnadjuster / self.maxAcross;
				d.y = Math.floor(i / self.boxesPerRow) * self.boxSize + self.height;
				obj.x = self.width * columnadjuster / self.maxAcross;
				obj.y = self.height - self.labelGap;
				if (self.maxAcross == 1) {
					d.y = Math.floor(i / self.boxesPerRow) * self.boxSize + self.height + self.labelGap;
					obj.y = self.height;
				}
			});
			self.labels.push(obj);

			if (self.maxAcross == 1) {
				self.height += sectionHeight + self.boxSize / 2 + self.labelGap;
			} else {
				if ((index + 1) / self.maxAcross % 1 == 0) {
					self.height += sectionHeight + self.labelGap;
				}
			}
		});

		self.totalHeightObj[category] = self.height + self.boxSize * 2;

		self.trigger("setPositions:end");
	},
	render: function render() {
		var self = this;
		self.trigger("renderChart:start");

		self.buttonColumns.forEach(function (d) {
			self.setPositions(d);
		});

		self.setPositions(self.category);

		self.masterHeight = 0;
		_.each(self.totalHeightObj, function (value, key) {
			if (value > self.masterHeight) {
				self.masterHeight = value;
			}
		});

		self.svg = d3.select(self.chartId).append("svg").attr("width", self.width + self.margin.left + self.margin.right).attr("height", self.masterHeight + self.margin.top + self.margin.top).append("g").attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

		self.labels = d3.select(self.chartId).selectAll(".back-labels").data(self.labels, function (d) {
			return d.name;
		}).enter().append("div").style("left", function (d) {
			return d.x + self.margin.left + "px";
		}).style("top", function (d) {
			return d.y + self.margin.top + "px";
		}).style("width", function (d) {
			return d.width + "px";
		}).html(function (d) {
			return self.labelTemplate({ data: d });
		}).attr("class", "back-labels");

		self.addRects = self.svg.selectAll("rect").data(self.data, function (d) {
			return d[self.idField];
		}).enter().append("rect").attr("width", self.boxSize).attr("height", self.boxSize).attr("x", function (d) {
			return d.x;
		}).attr("y", function (d) {
			return d.y;
		}).attr("fill", function (d) {
			return self.color(d[self.colorField]);
		}).attr('class', "sortingSquares").attr("title", function (d) {
			return self.tooltipTemplate({ d: d });
		});

		self.$('.sortingSquares').tooltip({
			html: true,
			placement: "bottom"
		});

		$(window).on("resize", _.debounce(function (event) {
			self.newWidth = self.$(self.chartId).width() - self.margin.left - self.margin.right;
			if (self.newWidth == self.width || self.newWidth <= 0) {
				return;
			}

			self.width = self.newWidth;

			self.update();
		}, 100));

		self.$(".chart-nav .btn").on("click", function () {
			self.category = $(this).attr("dataid");
			self.update();
		});
		self.trigger("renderChart:end");
	},
	update: function update() {
		var self = this;
		self.trigger("update:start");

		self.buttonColumns.forEach(function (d) {
			self.setPositions(d);
		});
		self.masterHeight = 0;
		_.each(self.totalHeightObj, function (value, key) {
			if (value > self.masterHeight) {
				self.masterHeight = value;
			}
		});

		self.setPositions(self.category);

		d3.select(self.chartId).selectAll("svg").transition().duration(1000).attr("width", self.width + self.margin.left + self.margin.right).attr("height", self.masterHeight + self.margin.top + self.margin.top);

		self.addRects.transition().duration(1000).attr("x", function (d) {
			return d.x;
		}).attr("y", function (d) {
			return d.y;
		});

		d3.select(self.chartId).selectAll(".back-labels").data(self.labels, function (d) {
			return d.name;
		}).enter().append("div").style("left", function (d) {
			return d.x + self.margin.left + "px";
		}).style("top", function (d) {
			return d.y + self.margin.top + "px";
		}).style("width", function (d) {
			return d.width + "px";
		}).html(function (d) {
			return self.labelTemplate({ data: d });
		}).attr("class", "back-labels").style("opacity", 0);

		d3.select(self.chartId).selectAll(".back-labels").html(function (d) {
			return self.labelTemplate({ data: d });
		}).transition().duration(1000).style("left", function (d) {
			return d.x + self.margin.left + "px";
		}).style("top", function (d) {
			return d.y + self.margin.top + "px";
		}).style("width", function (d) {
			return d.width + "px";
		}).style("opacity", 1);

		d3.select(self.chartId).selectAll(".back-labels").data(self.labels, function (d) {
			return d.name;
		}).exit().transition().duration(1000).style("opacity", 0).remove();
		self.trigger("update:end");
	}

});
//# sourceMappingURL=sortsquares.js.map
