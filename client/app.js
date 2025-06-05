function getBathValue() {
    var uiBathrooms = document.getElementsByName("uiBathrooms");
    for(var i in uiBathrooms) {
        if(uiBathrooms[i].checked) {
            return parseInt(i)+1;
        }
    }
    return -1;
}

function getBHKValue() {
    var uiBHK = document.getElementsByName("uiBHK");
    for(var i in uiBHK) {
        if(uiBHK[i].checked) {
            return parseInt(i)+1;
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

    var url = "http://127.0.0.1:5000/predict_home_price";

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
    }).fail(function() {
        // Remove loading state on error
        button.classList.remove('loading');
        
        // Show error message
        setTimeout(() => {
            const resultValue = resultContainer.querySelector('.result-value');
            resultValue.textContent = "Error calculating price";
            resultContainer.classList.add('show');
        }, 300);
    });
}

function onPageLoad() {
    console.log("document loaded");
    var url = "http://127.0.0.1:5000/get_location_names";
    
    $.get(url, function(data, status) {
        console.log("got response for get_location_names request");
        if(data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            
            // Add default option
            var defaultOpt = new Option("Choose Location", "", true, true);
            defaultOpt.disabled = true;
            $('#uiLocations').append(defaultOpt);
            
            // Add location options
            for(var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    });
}

window.onload = onPageLoad;
