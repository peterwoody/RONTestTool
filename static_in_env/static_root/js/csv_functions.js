/**
 * Created by Shaquille on 1/08/2016.
 */
function addCSVButton(element, csv_request_type, parameters, server_url, filename) {

    var button = document.createElement("button");
    var button_value = document.createTextNode("Download CSV");

    button.appendChild(button_value);
    button.setAttribute("onclick", "downloadCSV('" + csv_request_type + "','" + parameters + "','" + server_url + "','" + filename + "');");
    button.setAttribute("style", "float:right; color:#0089BB");


    element.appendChild(button);
}

function downloadCSV(csv_request_type, parameters, server_url, filename) {
    $('body').addClass('wait');
    $.ajax({
        type: 'POST',
        url: '/get_all_host_info/',
        dataType: 'json',
        async: true,

        data: {
            host_id: parameters.split(',')[0],
            server_url: server_url,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            var CSVContent = "data:text/csv;charset=utf-8," + json.csv_content;

            var encodedUri = encodeURI(CSVContent);
            var CSVLink = document.createElement("a");
            CSVLink.setAttribute("href", encodedUri);
            CSVLink.setAttribute("download", filename + ".csv");
            CSVLink.click();
            $('body').removeClass('wait');
        }
    });
    //switch (csv_request_type) {
    //    case "tours":
    //        $.ajax({
    //            type: 'POST',
    //            url: '/get_tours/',
    //            dataType: 'json',
    //            async: true,
    //
    //            data: {
    //                id: parameters.split(',')[0],
    //                server_url: server_url,
    //                safe: false,
    //                csrfmiddlewaretoken: csrftoken
    //            },
    //
    //            success: function (json) {
    //                var CSVContent = "data:text/csv;charset=utf-8,";
    //                console.log(json.tours);
    //                for (var i = 0; i in json.tours; i++) {
    //                    CSVContent += json.tours[i]['strTourCode'].toString() + "\n";
    //                }
    //                var encodedUri = encodeURI(CSVContent);
    //                var CSVLink = document.createElement("a");
    //                CSVLink.setAttribute("href", encodedUri);
    //                CSVLink.setAttribute("download", filename + ".csv");
    //                CSVLink.click();
    //            }
    //        });
    //        break;
    //    case "tours_bases":
    //        function tour_codes(callback){ $.ajax({
    //            type: 'POST',
    //            url: '/get_tours/',
    //            dataType: 'json',
    //            async: true,
    //
    //            data: {
    //                id: parameters.split(',')[0],
    //                server_url: server_url,
    //                safe: false,
    //                csrfmiddlewaretoken: csrftoken
    //            },
    //
    //            success: function (json) {
    //                callback(json.tours);
    //            }
    //        });
    //        }
    //
    //        for (var i = 0; i < tour_codes.length; i++) {
    //            console.log("i: " + i);
    //            console.log("tour_codes[i]['strTourCode'].toString(): " + tour_codes[i]['strTourCode'].toString());
    //            console.log("parameters.split(',')[0]: " + parameters.split(',')[0]);
    //
    //            $.ajax({
    //                type: 'POST',
    //                url: '/get_tour_bases/',
    //                dataType: 'json',
    //                async: true,
    //
    //                data: {
    //                    host_id: parameters.split(',')[0],
    //                    tour_code: tour_codes[i]['strTourCode'].toString(),
    //                    server_url: server_url,
    //                    safe: false,
    //                    csrfmiddlewaretoken: csrftoken
    //                },
    //
    //                success: function (json) {
    //                    console.log(tour_codes[i]['strTourCode'].toString());
    //                    for (var j = 0; j < json.tour_bases.length - 1; j++) {
    //                        CSVContent += tour_codes[i]['strTourCode'].toString() + "," + json.tour_bases[j]['intBasisID'].toString() + "," + json.tour_bases[j]['intSubBasisID'].toString() + "\n";
    //                    }
    //                    console.log(CSVContent);
    //
    //                }
    //            });
    //        }

    var encodedUri = encodeURI(CSVContent);
    var CSVLink = document.createElement("a");
    CSVLink.setAttribute("href", encodedUri);
    CSVLink.setAttribute("download", filename + ".csv");
    CSVLink.click();
    //        break;
    //    default:
    //        break;
    //}


}