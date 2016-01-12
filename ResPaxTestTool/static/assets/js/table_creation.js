/**
 * Created by Shaquille on 8/01/2016.
 */

function generateTable(operators, host_id) {

    for (var i = 0; i in operators; i++) {
        var tableRow = document.createElement('tr');
        var table = document.getElementById("test-tool-table").getElementsByTagName('tbody')[0];
        var operator_td = document.createElement("td");

        var operator_td_value = document.createTextNode(operators[i] + ' (' + host_id[i] + ')');

        operator_td.appendChild(operator_td_value);

        operator_td.setAttribute("colspan", "3");

        tableRow.setAttribute("id", (host_id[i]).toString());
        tableRow.setAttribute("onclick", "get_tours(this, this.id)");
        tableRow.setAttribute("data-level", "1");

        tableRow.appendChild(operator_td);

        table.appendChild(tableRow);
    }

}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);

            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function get_tours(tableRow, id) {

    $.ajax({
        type: 'POST',
        url: '/get_tours/',
        dataType: 'json',
        async: true,

        data: {
            id: id,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            if (json.tours.length > 0) {
                for (var i = 0; i in json.tours; i++) {
                    var newTableRow = document.createElement('tr');
                    var tour_code_td = document.createElement('td');

                    var tour_code_td_value = document.createTextNode('Tour Code: ' + json.tours[i]['strTourCode']);

                    tour_code_td.appendChild(tour_code_td_value);

                    tour_code_td.setAttribute('colspan', '4');
                    newTableRow.setAttribute('id', id + ',' + json.tours[i]['strTourCode'].toString());
                    newTableRow.setAttribute('onclick', 'get_tour_bases(this, this.id)');
                    newTableRow.setAttribute("data-level", "2");

                    newTableRow.appendChild(tour_code_td);

                    $(tableRow).after(newTableRow);
                }
            } else {
                var newTableRow = document.createElement('tr');
                var td = document.createElement('td');

                var value = document.createTextNode("No tours available ");

                td.appendChild(value);

                newTableRow.setAttribute("data-level", "2");

                newTableRow.appendChild(td);
                $(tableRow).after(newTableRow);
            }
            tableRow.setAttribute('onclick', 'remove_rows(this)');
        }
    })
}

function get_tour_bases(tableRow, id) {
    var host_id = id.split(',')[0];
    var tour_code = id.split(',')[1];
    console.log((id.split(',')).length);
    $.ajax({
        type: 'POST',
        url: '/get_tour_bases/',
        dataType: 'json',
        async: true,

        data: {
            host_id: host_id,
            tour_code: tour_code,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            for (var i = 0; i < json.tour_bases.length; i++) {
                var newTableRow = document.createElement('tr');

                var basis_td = document.createElement("td");
                var subbasis_td = document.createElement("td");

                var basis_td_value = document.createTextNode("Basis: " + json.tour_bases[i]['strBasisDesc'] + ' (' + json.tour_bases[i]['intBasisID'] + ')');

                var subbasis_td_value = document.createTextNode("Subbasis: " + json.tour_bases[i]['strSubBasisDesc'] + ' (' + json.tour_bases[i]['intSubBasisID'] + ')');

                basis_td.appendChild(basis_td_value);
                subbasis_td.appendChild(subbasis_td_value);

                basis_td.setAttribute('colspan', '1');
                subbasis_td.setAttribute('colspan', '3');
                newTableRow.setAttribute('id', id + ',' + json.tour_bases[i]['intBasisID'] + ',' + json.tour_bases[i]['intSubBasisID']);
                newTableRow.setAttribute('onclick', 'get_tour_times(this, this.id)');
                newTableRow.setAttribute("data-level", "3");

                newTableRow.appendChild(basis_td);
                newTableRow.appendChild(subbasis_td);

                $(tableRow).after(newTableRow);
            }
            tableRow.setAttribute('onclick', 'remove_rows(this)');
        }
    })
}

function get_tour_times(tableRow, id) {
    var host_id = id.split(',')[0];
    var tour_code = id.split(',')[1];

    $.ajax({
        type: 'POST',
        url: '/get_tour_times/',
        dataType: 'json',
        async: true,

        data: {
            host_id: host_id,
            tour_code: tour_code,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            for (var i = 0; i < json.tour_times.length; i++) {
                var newTableRow = document.createElement('tr');

                var time_td = document.createElement("td");

                var time_td_value = document.createTextNode("Time: " + json.tour_times[i]['dteTourTime']['iso8601'] + ' (' + json.tour_times[i]['intTourTimeID'] + ')');

                time_td.appendChild(time_td_value);

                time_td.setAttribute('colspan', '4');
                newTableRow.setAttribute('id', id + ',' + json.tour_times[i]['intTourTimeID']);
                newTableRow.setAttribute('onclick', 'get_tour_pickups(this, this.id)');
                newTableRow.setAttribute("data-level", "4");

                newTableRow.appendChild(time_td);

                $(tableRow).after(newTableRow);
            }
            tableRow.setAttribute('onclick', 'remove_rows(this)');
        }
    })
}

function get_tour_pickups(tableRow, id) {
    var host_id = id.split(',')[0];
    var tour_code = id.split(',')[1];
    var tour_basis_id = id.split(',')[2];
    var tour_sub_basis_id = id.split(',')[3];
    var tour_time_id = id.split(',')[4];

    $.ajax({
        type: 'POST',
        url: '/get_tour_pickups/',
        dataType: 'json',
        async: true,

        data: {
            host_id: host_id,
            tour_code: tour_code,
            tour_time_id: tour_time_id,
            tour_basis_id: tour_basis_id,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            for (var i = 0; i < json.tour_pickups.length; i++) {
                var newTableRow = document.createElement('tr');

                var pickup_id_td = document.createElement("td");
                var string_td = document.createElement("td");

                var pickup_id_td_value = document.createTextNode("Pickup ID: " + json.tour_pickups[i]['strPickupValue'] + ' ' + '(' + json.tour_pickups[i]['strPickupKey'] + ')');

                var string_td_value = document.createTextNode("String: (" +
                    host_id + ',' +
                    tour_basis_id + ',' +
                    tour_sub_basis_id + ',' +
                    tour_time_id + ',' +
                    json.tour_pickups[i]['strPickupKey'] +
                    ')');

                pickup_id_td.appendChild(pickup_id_td_value);
                string_td.appendChild(string_td_value);

                pickup_id_td.setAttribute('colspan', '1');
                string_td.setAttribute('colspan', '3');
                newTableRow.setAttribute("data-level", "5");

                newTableRow.appendChild(pickup_id_td);
                newTableRow.appendChild(string_td);

                $(tableRow).after(newTableRow);
            }
            tableRow.setAttribute('onclick', 'remove_rows(this)');
        }
    })
}

function range(lowEnd, highEnd) {
    var validation = (lowEnd <= highEnd) && (lowEnd >= 0) && (highEnd < 100);
    if (!(validation)) {
        console.assert(validation,
            'Function "range" received unlikely values: ' +
            lowEnd + ' and ' + highEnd + "...");
    } else {
        var arr = [];
        while (lowEnd <= highEnd) {
            arr.push(lowEnd++);
        }
        return arr;
    }
}

function name_range(fun, lowEnd, highEnd) {
    var arr = range(lowEnd, highEnd);
    jQuery.each(arr, function (index, value) {
        arr[index] = fun(value);
    });
    return arr;
}

function create_selector(level) {
    return "[data-level='" + level + "']";
}

function remove_rows(table_row) {

    var this_level = parseInt($(table_row).data("level"), 10);
    var next_or_lower = name_range(create_selector,
        this_level + 1, 10);
    var this_or_higher = name_range(create_selector, 0, this_level);
    var node = $(table_row).nextUntil(this_or_higher.join(","));

    $(node).remove();
    $(node).filter(next_or_lower.join(",")).hide();

    switch ((table_row.id.split(',')).length) {
        case 1:
            table_row.setAttribute('onclick', 'get_tours(this, this.id)');
            break;
        case 2:
            table_row.setAttribute('onclick', 'get_tour_bases(this, this.id)');
            break;
        case 4:
            table_row.setAttribute('onclick', 'get_tour_times(this, this.id)');
            break;
        case 5:
            table_row.setAttribute('onclick', 'get_tour_pickups(this, this.id)');
            break;
        default:
            console.log('function remove_rows switch statement error')
    }


}
