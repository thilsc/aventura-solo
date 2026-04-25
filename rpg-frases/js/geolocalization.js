function obtemGeolocalizacao() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var location = {
                'latitude': latitude,
                'longitude': longitude
            };

            // Envia o objeto 'location' para o servidor por meio de uma requisição AJAX
            $.ajax({
                url: 'obtemgeolocal.php',
                method: 'POST',
                data: { location: location },
                success: function(response) {
                    // Processa a resposta do servidor
                },
                error: function(error) {
                    console.log(error);
                }
            });
        });
    } else {
        console.log("Geolocalização não suportada.");
    }
}