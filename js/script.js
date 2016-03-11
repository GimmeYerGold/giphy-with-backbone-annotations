// console.log(Backbone) <---test to see if js is connected correctly.

//api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC < ref full URL

//------------------Modelo--------------------//

// We extend the native Backbone Model with a model constructor called IphyModel, assigning a custom _apiKey key value pair, and plug in the api url value into Backbone's existing url key.

var IphyModel = Backbone.Model.extend ({

_apiKey: "dc6zaTOxFJmzC",
url: "http://api.giphy.com/v1/gifs/search?"

})

// ---------------Views---------------------//

// We will eventually have 2 views, ScrollView and Detail view. As above, so below, we have extended the native Backbone View with a view constructor called IphyScrollView, assigning our container as a value into the native "el" key.

var IphyScrollView = Backbone.View.extend({
	el: "#container",

	// line 33) we assign a function with "initialize" that takes as a parameter any instance of the model (we declared above), then with "this.model." Initialize will be invoked when an instance of the view is created. 

	// line 34) We assign an instance of the model to a view made by this constructor.

	 // line 36) What we'd like to do next is assign our _render function as a callback that will automatically be fired whenever the model "syncs" with the remote api (i.e. when it retrieves data). We need a version of our _render function that will work the same in any context. 

	 // line 35) ".bind" facilitates this by dissecting the _render function and replacing any instances of `this` with the object passed into .bind(). in this case, we pass in "this", which may look confusing, but at runtime "this" will be an actual view instance. 

	 // line 35) The resulting `newFunc` has no `this` keyword, and therefore no flexible context. It will always refer to the same view instance.

	initialize: function(someModel) {
		this.model = someModel
		var newFunc = this._render.bind(this)
		this.model.on("sync", this._render)
	},

	// the event below activates the _triggerDetailView method when an image is clicked 

	events: {

		"click img": "_triggerDetailView"
	},	

	// the _triggerDetailView method takes a click event as a method, and "listens" for that click event on a target (image) that we store as an "imgNode" variable. Once that image clicked, we update the location.hash in the url bar with "detail/" and find the "gifId" attribute of that image with "getAttribute" method.

	_triggerDetailView: function(clickEvent) {
		var imgNode = clickEvent.target
		location.hash = "detail/" + imgNode.getAttribute("gifId")
		console.log(clickEvent.target)
	},

	//The below function gets the "data" attribute from an instance of a model. We declare an empty string that we'll populate with a number of gif objects from the api's data Array. Since our data is an Array, we use a for loop to examine a single gif object in that Array. We then concatenate onto our empty string the html syntax, the gif id, and the gifObject attribute path that will lead us to the actual gif image url.  Finally, outside of the loop, we modify the "el" attribute of an instance of a view's inner html with the complete string we've made, which is how we actually see the gifs on the page. 

	_render: function(){
		var dataArray = this.model.get("data")
		var gifUrlString = ""
		console.log(dataArray[0])
		for (var i = 0; i < dataArray.length; i++) {
			var gifObject = dataArray[i]
			console.log(gifObject.images.original.url)
			gifUrlString += '<img class="gifScroll" gifId="' + gifObject.id + '"src="' + gifObject.images.original.url+'">'
		}
		this.el.innerHTML = gifUrlString
	}
	 
})

//routes:
//scroll view
//detail view

//----------------Router---------------------//

//line XX) We extend the Backbone's native router method with a IphyRouter constructor. We set up our routes attribute so that upon a hash change, a corresponding method is invoked. Those methods are declared below.

var IphyRouter = Backbone.Router.extend ({

	routes: {
		"scroll/:query": "handleScrollView",
		"detail/:id": "handleDetailView"
	},

	// This method takes a search query, and creates a new instance of the model, and a new instance of a view that takes as a parameter, the instance of the model we just created. Next, we use the fetch method on a instance of the model to pass into some key value pairs into our url api request: a query, an api key, and a special case callback "?" that will help us bypass browser request restrictions.

	// (currently, the handleDetailView is blank.)

	handleScrollView: function(query){
		var mod = new IphyModel()
		var vew = new IphyScrollView(mod)
		
		mod.fetch({
			// dataType:"jsonp", <-- essential info for homework!!!
			data:{
				q:query,
				api_key: mod._apiKey,
				callback:"?"
			}
		})
	},

	handleDetailView: function(query){

	},

	// This initialize method starts listening for hash change events the moment this instance of the router is created.
	initialize: function(){
		Backbone.history.start()
	}

})

//here we declare a new instance of the router.

var rtr = new IphyRouter()