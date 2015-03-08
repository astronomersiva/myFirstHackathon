      var directions = new google.maps.DirectionsService();
      var renderer = new google.maps.DirectionsRenderer();
      var map, transitLayer;

      function initialize() {
        var mapOptions = {
          zoom: 8,
          center: new google.maps.LatLng(13.08, 80.24),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        google.maps.event.addDomListener(document.getElementById('go'), 'click',
        route);

        var input = document.getElementById('from');
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);

        var input2 = document.getElementById('to');
        var autocomplete = new google.maps.places.Autocomplete(input2);
        autocomplete.bindTo('bounds', map);

        transitLayer = new google.maps.TransitLayer();

        var control = document.getElementById('transit-wpr');
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);

        google.maps.event.addDomListener(control, 'click', function() {
          transitLayer.setMap(transitLayer.getMap() ? null : map);
        });

        addDepart();
        route();
      }

      function addDepart() {
        var depart = document.getElementById('depart');
        for (var i = 0; i < 24; i++) {
          for (var j = 0; j < 60; j += 15) {
          var x = i < 10 ? '0' + i : i;
          var y = j < 10 ? '0' + j : j;
          depart.innerHTML += '<option>' + x + ':' + y + '</option>';
        }
        }
      }

      function route() {
        var departure = '';
        var bits = departure.split(':');
        var now = new Date();
        var tzOffset = (now.getTimezoneOffset() + 60) * 60 * 1000;

        var time = new Date();
        time.setHours(bits[0]);
        time.setMinutes(bits[1]);

        var ms = time.getTime() - tzOffset;
        if (ms < now.getTime()) {
          ms += 24 * 60 * 60 * 1000;
        }

        var departureTime = new Date(ms);

        var request = {
          origin: document.getElementById('from').value,
          destination: document.getElementById('to').value,
          travelMode: google.maps.DirectionsTravelMode.TRANSIT,
          provideRouteAlternatives: true,
          transitOptions: {
            departureTime: departureTime
          }
        };

        var panel = document.getElementById('panel');
        panel.innerHTML = '';
        directions.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            renderer.setDirections(response);
            renderer.setMap(map);
            renderer.setPanel(panel);
          } else {
            renderer.setMap(null);
            renderer.setPanel(null);
          }
        });

      }

      google.maps.event.addDomListener(window, 'load', initialize);