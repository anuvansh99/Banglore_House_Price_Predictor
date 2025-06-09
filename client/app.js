function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for (var i = 0; i < uiBathrooms.length; i++) {
        if (uiBathrooms[i].checked) {
            return parseInt(uiBathrooms[i].value);
        }
    }
    return -1;
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for (var i = 0; i < uiBHK.length; i++) {
        if (uiBHK[i].checked) {
            return parseInt(uiBHK[i].value);
        }
    }
    return -1;
}

function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");

    // Add loading state
    const button = document.querySelector('.btn-calculate');
    const resultContainer = document.getElementById("uiEstimatedPrice");

    button.classList.add('loading');
    resultContainer.classList.remove('show');

    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");

    var url = "https://banglore-house-price-predictor.onrender.com/predict_home_price";

    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    }, function(data, status) {
        // Remove loading state
        button.classList.remove('loading');

        console.log(data.estimated_price);

        // Update result with animation
        setTimeout(() => {
            const resultValue = resultContainer.querySelector('.result-value');
            resultValue.textContent = "₹ " + data.estimated_price.toString() + " Lakh";
            resultContainer.classList.add('show');
        }, 300);

        console.log(status);
    }).fail(function(xhr, status, error) {
        // Remove loading state on error
        button.classList.remove('loading');

        // Show error message
        setTimeout(() => {
            const resultValue = resultContainer.querySelector('.result-value');
            resultValue.textContent = "Error calculating price";
            resultContainer.classList.add('show');
        }, 300);

        console.error("API request failed:", status, error);
    });
}

function onPageLoad() {
    console.log("document loaded");
    var url = "https://banglore-house-price-predictor.onrender.com/get_location_names";

    $.get(url, function(data, status) {
        console.log("got response for get_location_names request");
        if (data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();

            // Add default option
            var defaultOpt = new Option("Choose Location", "", true, true);
            defaultOpt.disabled = true;
            $('#uiLocations').append(defaultOpt);

            // Add location options
            for (var i = 0; i < locations.length; i++) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    }).fail(function(xhr, status, error) {
        console.error("Failed to fetch location names:", status, error);
    });
}

window.onload = onPageLoad;
