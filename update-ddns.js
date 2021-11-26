var https = require("https");

var ddnsUpdater = {
	getURL: "https://v6.sync.afraid.org/u/k5aS9UKwqG75NFkWgUuD6KJq/?content-type=json",
	updateInterval: 24,	//in hours
	httpsResponse: {},
	responseBody: "",
	update: function update() {
		console.log("updating DDNS entry by accessing URL \"" + ddnsUpdater.getURL + "\"");
		https.get(ddnsUpdater.getURL, ddnsUpdater.receiveResponse);
		},
	handleChunk: function handleChunk(chunk) {
		ddnsUpdater.responseBody += chunk;
	},
	receiveResponse: function receiveResponse(response) {
		ddnsUpdater.httpsResponse = response;
		response.on("data", ddnsUpdater.handleChunk);
		response.on("end", ddnsUpdater.processResponse);
	},
	processResponse: function processResponse(response) {
		if(ddnsUpdater.httpsResponse.statusCode === 200)
		{
			try
			{
				var jsonBlob = JSON.parse(ddnsUpdater.responseBody);
				console.log("successfully received response from URL \"" + ddnsUpdater.getURL + "\"");
			}

			catch(error)
			{
				console.dir(error, {depth: null} );
			}
				console.log("text received:");
				console.log(ddnsUpdater.responseBody);
				console.log("JSON parsed:");
				console.dir(jsonBlob, {depth: null} );
		}

		else
		{
			console.log("response status code was not 200, but was instead \"" + ddnsUpdater.httpsResponse.statusCode + "\"");
		}
	},
	scheduleInterval: {},
	schedule: function schedule(hours) {
		ddnsUpdater.updateInterval = 1000 * 60 * 60 * hours;
		console.log("scheduling ddnsUpdater to update in " + hours + " hour(s), which is " + ddnsUpdater.updateInterval + " milliseconds");
		ddnsUpdater.scheduleInterval = setInterval(ddnsUpdater.update, ddnsUpdater.updateInterval);	//interval in milliseconds, updates every day
	}
};

ddnsUpdater.update();
ddnsUpdater.schedule(ddnsUpdater.updateInterval);
