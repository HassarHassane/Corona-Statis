  // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyBFVILW2QniG0BW-3vkRyTEBKPS1L0tbS4",
            authDomain: "covid19-statis.firebaseapp.com",
            databaseURL: "https://covid19-statis.firebaseio.com",
            projectId: "covid19-statis",
            storageBucket: "covid19-statis.appspot.com",
            messagingSenderId: "87110091771",
            appId: "1:87110091771:web:46dea1d60c745a1b6c015e",
            measurementId: "G-T3N2F6BNSY"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        function storeData() {
            let duree = 24 * 3600 * 1000;
			//storeData automatiquement à la fin de la journée courante.c-a-d,chaque 24h.
            setInterval(function() {
            	// Récupérer les donnes depuis l'api
            	$.get("https://pomber.github.io/covid19/timeseries.json", function (data) {
                // Enregister les donnes sur firebase
                firebase.database().ref("Pays").push(data);
            	});
            },duree)
            
        }