
//
// in view
mcrmade = {};

mcrmade.in_view = function(el, options) {

	if (el) {

		this.init(el, options);
	}
}

$.extend(mcrmade.in_view.prototype, {

	// plugin name
	name: 'mcrmade_in_view',

	defaults: {
		edge: 'bottom',
		amount: 'partial',
		trigger: 'window'
	},

	// initialise the plugin
	init: function(el, options) {

		this.options = $.extend(true, {}, this.defaults, options);

		this.element = $(el);

		this.element.data('seen', false);

		$.data(this.element, this.name, this);

		this.calculateBoundaries();

		this.testBoundaries();

		this.bind();

		return this;
	},

	// bind events to this instance's methods
	bind: function() {

		this.element.bind('destroyed', $.proxy(this.teardown, this));

		$(window).on('throttledresize', $.proxy(this.calculateBoundaries, this));

		if (this.options.trigger !== 'window') {

			$(this.options.trigger).on('scroll', $.proxy(this.testBoundaries, this));
		} else {

			$(this.options.trigger).on('scroll', $.proxy(this.testBoundaries, this));
			$(window).on('scroll', $.proxy(this.testBoundaries, this));
		}

		$(window).on('scroll', $.proxy(this.testBoundaries, this));
	},

	// call destroy to teardown whilst leaving the element
	destroy: function() {

		this.element.unbind('destroyed', this.teardown());

		this.teardown();
	},

	// remove plugin functionality
	teardown: function() {

		$.removeData(this.element[0], this.name);

		this.element = null;

		this.unbind();
	},

	unbind: function() {

		$(window).off('throttledresize', $.proxy(this.calculateBoundaries, this));

		$('section[role=main] .scroll-area-h').off('scroll', $.proxy(this.testBoundaries, this));
	},

	calculateBoundaries: function() {

		this.element.data('topBoundary', $(window).scrollTop() + $(window).height());
		this.element.data('leftBoundary', $(window).scrollLeft() + $(window).width());
	},

	testBoundaries: function() {

		if (
			this.element.offset().top < this.element.data('topBoundary') &&
			this.element.offset().left < this.element.data('leftBoundary') &&
			!this.element.data('seen', true)
		) {

			this.element.data('seen', true);

			this.doActions(this.element);

			this.unbind();
		}
	},

	doActions: function(element) {

		if (
			element.actions &&
			typeof element.actions == 'function'
		) {

			element.actions.call();
		}
	}
});



//
// make plugin
$.pluginMaker(mcrmade.in_view);
