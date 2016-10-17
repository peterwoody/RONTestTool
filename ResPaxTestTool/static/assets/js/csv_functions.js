/**
 * Created by Shaquille on 1/08/2016.
 */
function addCSVButton(table_row, table_column, parameters, server_url, filename) {

    var button = document.createElement("button");
    var button_value = document.createTextNode("Download CSV");
    var data_level = table_row.getAttribute("data-level");
    button.appendChild(button_value);
    button.setAttribute("onclick", "openCSVMenu('" + parameters + "','" + server_url + "','" + filename + "','" + parameters.split(',')[0] + "','" + data_level + "', event);");
    button.setAttribute("style", "float:right; clear: right;");

    table_column.appendChild(button);


}

function openCSVMenu(parameters, server_url, filename, heading, data_level, event) {
    if (event.stopPropagation) {
      event.stopPropagation();
    }
    var csv_menu = document.getElementById('csv_menu');
    var csv_menu_heading = document.getElementById('csv_menu_heading').innerHTML = heading;
    var csv_menu_text = document.getElementById('csv_menu_text');
    var dwnld_csv_btn = document.getElementById('dwnld_csv_btn');

    dwnld_csv_btn.setAttribute("onclick", "downloadCSV('" + parameters + "','" + server_url + "','" + filename + "','" + data_level + "','" + heading + "');");

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

function downloadCSV(parameters, server_url, filename, data_level, heading) {
    var host_ids_checkbox = document.getElementById("csv_host_ids").checked;
    var tour_names_checkbox = document.getElementById("csv_tour_names").checked;
    var tour_codes_checkbox = document.getElementById("csv_tour_codes").checked;
    var basis_name_checkbox = document.getElementById("csv_basis_name").checked;
    var basis_checkbox = document.getElementById("csv_basis").checked;
    var sub_basis_name_checkbox = document.getElementById("csv_sub_basis_name").checked;
    var sub_basis_checkbox = document.getElementById("csv_sub_basis").checked;
    var time_ids_checkbox = document.getElementById("csv_time_id").checked;
    var pickup_keys_checkbox = document.getElementById("csv_pickup_key").checked;

    var csv_time_taken = document.getElementById("csv_time_taken");
    var csv_last_export = document.getElementById("csv_last_export");
    var csv_timer = document.getElementById("csv_timer");
    var csv_separator = document.getElementById("csv_separator").value;

    csv_timer.innerHTML = "00:00:00";

    var seconds = 0;
    var minutes = 0;
    var hours = 0;

    $('body').addClass('wait');
    function countTime() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }

        var timer_hours;
        var timer_minutes;
        var timer_seconds;
        if (hours <= 9) {
            timer_hours = "0" + hours;
        } else {
            timer_hours = hours;
        }
        if (minutes <= 9) {
            timer_minutes = "0" + minutes;
        } else {
            timer_minutes = minutes;
        }
        if (seconds <= 9) {
            timer_seconds = "0" + seconds;
        } else {
            timer_seconds = seconds;
        }
        csv_timer.innerHTML = timer_hours + ":" + timer_minutes + ":" + timer_seconds;
    }

    var time_taken_count = setInterval(countTime, 1000);

    $.ajax({
        type: 'POST',
        url: '/get_all_host_info/',
        dataType: 'json',
        async: true,

        data: {
            parameters: parameters,
            host_ids_checkbox: host_ids_checkbox,
            tour_names_checkbox: tour_names_checkbox,
            tour_codes_checkbox: tour_codes_checkbox,
            basis_name_checkbox: basis_name_checkbox,
            basis_checkbox: basis_checkbox,
            sub_basis_name_checkbox: sub_basis_name_checkbox,
            sub_basis_checkbox: sub_basis_checkbox,
            time_ids_checkbox: time_ids_checkbox,
            pickup_keys_checkbox: pickup_keys_checkbox,
            server_url: server_url,
            data_level: data_level,
            csv_separator: csv_separator,
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
            clearTimeout(time_taken_count);

            var last_export_string = "Last Export = " + heading;
            if (host_ids_checkbox) {
                last_export_string += ", Host ID"
            }
            if (tour_names_checkbox) {
                last_export_string += ", Tour Name"
            }
            if (tour_codes_checkbox) {
                last_export_string += ", Tour Code"
            }
            if (basis_name_checkbox) {
                last_export_string += ", Basis Name"
            }
            if (basis_checkbox) {
                last_export_string += ", Basis ID"
            }
            if (sub_basis_name_checkbox) {
                last_export_string += ", Sub Basis Name"
            }
            if (sub_basis_checkbox) {
                last_export_string += ", Sub Basis ID"
            }
            if (time_ids_checkbox) {
                last_export_string += ", Time ID"
            }
            if (pickup_keys_checkbox) {
                last_export_string += ", Pickup Key"
            }

            csv_last_export.innerHTML = last_export_string;

            var minutes_string;
            if (minutes > 1) {
                minutes_string = minutes + " minutes ";
            } else if (minutes == 0) {
                minutes_string = ""
            } else {
                minutes_string = minutes + " minute ";
            }

            var seconds_string;
            if (seconds > 1) {
                seconds_string = seconds + " seconds";
            } else if (seconds < 1) {
                seconds_string = "less than 1 second"
            }
            else {
                seconds_string = seconds + " second";
            }
            csv_time_taken.innerHTML = "Last Export Time = " + minutes_string + seconds_string;
            csv_timer.innerHTML = ""

        }
    });
}

function selectAllCheckboxes(checkbox) {
    var host_ids_checkbox = document.getElementById("csv_host_ids");
    var tour_names_checkbox = document.getElementById("csv_tour_names");
    var tour_codes_checkbox = document.getElementById("csv_tour_codes");
    var basis_name_checkbox = document.getElementById("csv_basis_name");
    var basis_checkbox = document.getElementById("csv_basis");
    var sub_basis_name_checkbox = document.getElementById("csv_sub_basis_name");
    var sub_basis_checkbox = document.getElementById("csv_sub_basis");
    var time_ids_checkbox = document.getElementById("csv_time_id");
    var pickup_keys_checkbox = document.getElementById("csv_pickup_key");

    if (checkbox.checked) {
        host_ids_checkbox.checked = true;
        tour_names_checkbox.checked = true;
        tour_codes_checkbox.checked = true;
        basis_name_checkbox.checked = true;
        basis_checkbox.checked = true;
        sub_basis_name_checkbox.checked = true;
        sub_basis_checkbox.checked = true;
        time_ids_checkbox.checked = true;
        pickup_keys_checkbox.checked = true;
    } else {
        host_ids_checkbox.checked = false;
        tour_names_checkbox.checked = false;
        tour_codes_checkbox.checked = false;
        basis_name_checkbox.checked = false;
        basis_checkbox.checked = false;
        sub_basis_name_checkbox.checked = false;
        sub_basis_checkbox.checked = false;
        time_ids_checkbox.checked = false;
        pickup_keys_checkbox.checked = false;
    }
}

function check_if_select_all() {
    var host_ids_checkbox = document.getElementById("csv_host_ids");
    var tour_names_checkbox = document.getElementById("csv_tour_names");
    var tour_codes_checkbox = document.getElementById("csv_tour_codes");
    var basis_name_checkbox = document.getElementById("csv_basis_name");
    var basis_checkbox = document.getElementById("csv_basis");
    var sub_basis_name_checkbox = document.getElementById("csv_sub_basis_name");
    var sub_basis_checkbox = document.getElementById("csv_sub_basis");
    var time_ids_checkbox = document.getElementById("csv_time_id");
    var pickup_keys_checkbox = document.getElementById("csv_pickup_key");

    if (host_ids_checkbox.checked && tour_names_checkbox.checked &&
        tour_codes_checkbox.checked && basis_name_checkbox.checked && basis_checkbox.checked &&
        sub_basis_name_checkbox.checked && sub_basis_checkbox.checked &&
        time_ids_checkbox.checked && pickup_keys_checkbox.checked) {
        document.getElementById("select_all_ckb").checked = true;
    } else {
        document.getElementById("select_all_ckb").checked = false;
    }
}
