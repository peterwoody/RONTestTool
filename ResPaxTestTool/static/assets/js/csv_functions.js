/**
 * Created by Shaquille on 1/08/2016.
 */
function addCSVButton(element, csv_request_type, parameters, server_url, filename) {

    var button = document.createElement("button");
    var button_value = document.createTextNode("Download CSV");

    button.appendChild(button_value);
    //button.setAttribute("onclick", "downloadCSV('" + csv_request_type + "','" + parameters + "','" + server_url + "','" + filename + "');");
    button.setAttribute("onclick", "openCSVMenu('" + csv_request_type + "','" + parameters + "','" + server_url + "','" + filename + "','" + element.innerHTML + "');");
    button.setAttribute("style", "float:right; color:#0089BB");

    element.appendChild(button);


}

function openCSVMenu(csv_request_type, parameters, server_url, filename, heading) {
    var csv_menu = document.getElementById('csv_menu');
    var csv_menu_heading = document.getElementById('csv_menu_heading').innerHTML = heading;
    var csv_menu_text = document.getElementById('csv_menu_text');
    var dwnld_csv_btn = document.getElementById('dwnld_csv_btn');

    dwnld_csv_btn.setAttribute("onclick", "downloadCSV('" + csv_request_type + "','" + parameters + "','" + server_url + "','" + filename + "');");

    csv_menu.style.display = "block";
// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        csv_menu.style.display = "none";
    };

    //When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == csv_menu) {
            csv_menu.style.display = "none";
        }
    }
}

function downloadCSV(csv_request_type, parameters, server_url, filename) {
    var host_ids_checkbox = document.getElementById("csv_host_ids").checked;
    var tour_codes_checkbox = document.getElementById("csv_tour_codes").checked;
    var basis_checkbox = document.getElementById("csv_basis").checked;
    var sub_basis_checkbox = document.getElementById("csv_sub_basis").checked;
    var time_ids_checkbox = document.getElementById("csv_time_id").checked;
    var pickup_keys_checkbox = document.getElementById("csv_pickup_key").checked;
    console.log(host_ids_checkbox);
    console.log(tour_codes_checkbox);
    console.log(basis_checkbox);
    console.log(sub_basis_checkbox);
    console.log(time_ids_checkbox);
    console.log(pickup_keys_checkbox);
    $('body').addClass('wait');
    $.ajax({
        type: 'POST',
        url: '/get_all_host_info/',
        dataType: 'json',
        async: true,

        data: {
            host_id: parameters.split(',')[0],
            host_ids_checkbox: host_ids_checkbox,
            tour_codes_checkbox: tour_codes_checkbox,
            basis_checkbox: basis_checkbox,
            sub_basis_checkbox: sub_basis_checkbox,
            time_ids_checkbox: time_ids_checkbox,
            pickup_keys_checkbox: pickup_keys_checkbox,
            server_url: server_url,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            var CSVContent = "data:text/csv;charset=utf-8," + json.csv_content;
            if (CSVContent !== "data:text/csv;charset=utf-8,") {
                var encodedUri = encodeURI(CSVContent);
                var CSVLink = document.createElement("a");
                CSVLink.setAttribute("href", encodedUri);
                CSVLink.setAttribute("download", filename + ".csv");
                CSVLink.click();
            }
            $('body').removeClass('wait');
        }
    });
}

function selectAllCheckboxes(checkbox){
    if (checkbox.checked){
        var host_ids_checkbox = document.getElementById("csv_host_ids").checked = true;
        var tour_codes_checkbox = document.getElementById("csv_tour_codes").checked = true;
        var basis_checkbox = document.getElementById("csv_basis").checked = true;
        var sub_basis_checkbox = document.getElementById("csv_sub_basis").checked = true;
        var time_ids_checkbox = document.getElementById("csv_time_id").checked = true;
        var pickup_keys_checkbox = document.getElementById("csv_pickup_key").checked = true;
    }else {
        var host_ids_checkbox = document.getElementById("csv_host_ids").checked = false;
        var tour_codes_checkbox = document.getElementById("csv_tour_codes").checked = false;
        var basis_checkbox = document.getElementById("csv_basis").checked = false;
        var sub_basis_checkbox = document.getElementById("csv_sub_basis").checked = false;
        var time_ids_checkbox = document.getElementById("csv_time_id").checked = false;
        var pickup_keys_checkbox = document.getElementById("csv_pickup_key").checked = false;
    }
}