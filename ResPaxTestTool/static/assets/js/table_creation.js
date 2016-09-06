/**
 * Created by Shaquille on 8/01/2016.
 */
function generateTable(operators, host_ids, server_url) {
    var tableHeading = document.getElementById("test-tool-table-heading");
    var hostCSVContent = "data:text/csv;charset=utf-8,";

    for (var i = 0; i in operators; i++) {
        var tableRow = document.createElement('tr');
        var table = document.getElementById("test-tool-table").getElementsByTagName('tbody')[0];
        var operator_td = document.createElement("td");
        var operator_td_value = document.createTextNode(operators[i] + ' (' + host_ids[i] + ')');

        hostCSVContent += host_ids[i] + "\n";

        operator_td.appendChild(operator_td_value);
        operator_td.setAttribute("colspan", "3");

        tableRow.setAttribute("id", (host_ids[i]).toString());
        tableRow.setAttribute("onclick", "get_tours(this, this.id,'" + server_url + "'); " +
            "populate_form_fields('" + host_ids[i] + "')");
        tableRow.setAttribute("data-level", "1");

        tableRow.appendChild(operator_td);


        table.appendChild(tableRow);
    }

    var encodedUri = encodeURI(hostCSVContent);
    var hostsCSVLink = document.createElement("a");
    hostsCSVLink.innerText = "Download Hosts CSV";
    hostsCSVLink.setAttribute("href", encodedUri);
    hostsCSVLink.setAttribute("download", "hosts.csv");
    hostsCSVLink.setAttribute("style", "float:right; clear: right; color:#E0D65B");
    tableHeading.appendChild(hostsCSVLink);
}

function backToTop() {
    window.scrollTo(0, 0);
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

function get_tours(tableRow, id, server_url) {
    var loading_img = document.createElement("img");
    loading_img.src = "/static/img/loading.gif";
    loading_img.style.position = "relative";
    loading_img.style.left = "47%";
    loading_img.style.right = "50%";
    loading_img.style.margin = "auto";
    $(tableRow).after(loading_img);
    var host_id = id.split(',')[0];

    $.ajax({
        type: 'POST',
        url: '/get_tours/',
        dataType: 'json',
        async: true,

        data: {
            id: id,
            server_url: server_url,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            if (typeof json.tours === 'string') {
                var newTableRow = document.createElement('tr');
                var td = document.createElement('td');

                var value = document.createTextNode(json.tours);

                td.appendChild(value);
                newTableRow.setAttribute("data-level", "2");

                newTableRow.appendChild(td);
                $(tableRow).after(newTableRow);
            } else if (typeof json.tours === 'object') {
                if (json.tours.length > 0) {
                    console.log("id: " + id);
                    addCSVButton(tableRow, tableRow.getElementsByTagName("td")[0], id, server_url, "tour codes");
                    for (var i = 0; i in json.tours; i++) {
                        var new_id = id + ',' + json.tours[i]['strTourCode'].toString();
                        var newTableRow = document.createElement('tr');
                        var tour_code_td = document.createElement('td');
                        var tour_code = json.tours[i]['strTourCode'];
                        var tour_code_td_value = document.createTextNode('Tour Code: ' + tour_code);
                        var string_p = document.createElement("p");
                        var string_value = document.createTextNode("(" +
                            id + "," +
                            tour_code +
                            ')');

                        string_p.setAttribute("style", "float: right;");
                        string_p.appendChild(string_value);
                        tour_code_td.appendChild(tour_code_td_value);

                        tour_code_td.appendChild(string_p);

                        tour_code_td.setAttribute('colspan', '4');
                        newTableRow.setAttribute('id', new_id);
                        newTableRow.setAttribute("onclick", "get_tour_bases(this, this.id,'" + server_url + "'); " +
                            "populate_form_fields('" + host_id + "','" + tour_code + "')");
                        newTableRow.setAttribute("data-level", "2");

                        newTableRow.appendChild(tour_code_td);
                        addCSVButton(newTableRow, tour_code_td, new_id, server_url, "tour codes");
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

            }
            loading_img.remove();
            tableRow.setAttribute('onclick', 'remove_rows(this,"' + server_url + '")');
        }
    });
}

function get_tour_bases(tableRow, id, server_url) {
    var loading_img = document.createElement("img");
    loading_img.src = "/static/img/loading.gif";
    loading_img.style.position = "relative";
    loading_img.style.left = "47%";
    loading_img.style.right = "50%";
    loading_img.style.margin = "auto";
    $(tableRow).after(loading_img);

    var host_id = id.split(',')[0];
    var tour_code = id.split(',')[1];

    $.ajax({
        type: 'POST',
        url: '/get_tour_bases/',
        dataType: 'json',
        async: true,

        data: {
            host_id: host_id,
            tour_code: tour_code,
            server_url: server_url,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            loading_img.remove();
            for (var i = 0; i < json.tour_bases.length; i++) {
                var tour_basis_id = json.tour_bases[i]['intBasisID'];
                var tour_sub_basis_id = json.tour_bases[i]['intSubBasisID'];
                var new_id = id + ',' + tour_basis_id + ',' + tour_sub_basis_id;
                var newTableRow = document.createElement('tr');

                var basis_td = document.createElement("td");
                var subbasis_td = document.createElement("td");

                var basis_td_value = document.createTextNode("Basis: " + json.tour_bases[i]['strBasisDesc'] + ' (' + json.tour_bases[i]['intBasisID'] + ')');

                var subbasis_td_value = document.createTextNode("Subbasis: " + json.tour_bases[i]['strSubBasisDesc'] + ' (' + json.tour_bases[i]['intSubBasisID'] + ')');
                var string_p = document.createElement("p");
                var string_value = document.createTextNode("(" +
                    host_id + "," +
                    tour_code + "," +
                    json.tour_bases[i]['intBasisID'] + "," +
                    json.tour_bases[i]['intSubBasisID'] +
                    ')');

                string_p.setAttribute("style", "float: right;");
                string_p.appendChild(string_value);

                basis_td.appendChild(basis_td_value);
                subbasis_td.appendChild(subbasis_td_value);
                subbasis_td.appendChild(string_p);

                basis_td.setAttribute('colspan', '1');
                subbasis_td.setAttribute('colspan', '3');
                newTableRow.setAttribute('id', new_id);
                newTableRow.setAttribute("onclick", "get_tour_times(this, this.id, '" + server_url + "'); populate_form_fields('" + host_id + "','" +
                    tour_code + "','" +
                    tour_basis_id + "','" +
                    tour_sub_basis_id + "')");
                newTableRow.setAttribute("data-level", "3");

                newTableRow.appendChild(basis_td);
                newTableRow.appendChild(subbasis_td);
                addCSVButton(newTableRow, subbasis_td, new_id, server_url, "tour codes");

                $(tableRow).after(newTableRow);
            }
            tableRow.setAttribute('onclick', 'remove_rows(this,"' + server_url + '")');
        }
    })
}

function get_tour_times(tableRow, id, server_url) {
    var loading_img = document.createElement("img");
    loading_img.src = "/static/img/loading.gif";
    loading_img.style.position = "relative";
    loading_img.style.left = "47%";
    loading_img.style.right = "50%";
    loading_img.style.margin = "auto";
    $(tableRow).after(loading_img);

    var host_id = id.split(',')[0];
    var tour_code = id.split(',')[1];
    var tour_basis_id = id.split(',')[2];
    var tour_sub_basis_id = id.split(',')[3];

    $.ajax({
        type: 'POST',
        url: '/get_tour_times/',
        dataType: 'json',
        async: true,

        data: {
            host_id: host_id,
            tour_code: tour_code,
            server_url: server_url,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            loading_img.remove();

            for (var i = 0; i < json.tour_times.length; i++) {
                var tour_time_id = json.tour_times[i]['intTourTimeID'];
                var new_id = id + ',' + json.tour_times[i]['intTourTimeID'];

                var newTableRow = document.createElement('tr');

                var time_td = document.createElement("td");

                var time_td_value = document.createTextNode("Time: " + json.tour_times[i]['dteTourTime']['iso8601'] + ' (' + tour_time_id + ')');
                var string_p = document.createElement("p");
                var string_value = document.createTextNode("(" +
                    host_id + "," +
                    tour_code + "," +
                    tour_basis_id + "," +
                    tour_sub_basis_id + "," +
                    tour_time_id +
                    ')');

                string_p.setAttribute("style", "float: right;");
                string_p.appendChild(string_value);

                time_td.appendChild(time_td_value);
                time_td.appendChild(string_p);

                time_td.setAttribute('colspan', '4');
                newTableRow.setAttribute('id', new_id);
                newTableRow.setAttribute('onclick', "get_tour_pickups(this, this.id, '" + server_url + "');populate_form_fields('" + host_id + "','" +
                    tour_code + "','" +
                    tour_basis_id + "','" +
                    tour_sub_basis_id + "','" +
                    tour_time_id + "')");
                newTableRow.setAttribute("data-level", "4");

                newTableRow.appendChild(time_td);
                addCSVButton(newTableRow, time_td, new_id, server_url, "tour codes");
                $(tableRow).after(newTableRow);
            }
            tableRow.setAttribute('onclick', 'remove_rows(this,"' + server_url + '")');
        }
    })
}

function get_tour_pickups(tableRow, id, server_url) {
    var loading_img = document.createElement("img");
    loading_img.src = "/static/img/loading.gif";
    loading_img.style.position = "relative";
    loading_img.style.left = "47%";
    loading_img.style.right = "50%";
    loading_img.style.margin = "auto";
    $(tableRow).after(loading_img);

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
            server_url: server_url,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            loading_img.remove();
            for (var i = 0; i < json.tour_pickups.length; i++) {
                var new_id = id + ',' + json.tour_pickups[i]['strPickupKey'];
                var newTableRow = document.createElement('tr');

                var pickup_id_td = document.createElement("td");
                var string_td = document.createElement("td");

                var pickup_id_td_value = document.createTextNode("Pickup ID: " + json.tour_pickups[i]['strPickupValue'] + ' ' + '(' + json.tour_pickups[i]['strPickupKey'] + ')');

                var string_td_value = document.createTextNode("String: (" +
                    host_id + ',' +
                    tour_code + ',' +
                    tour_basis_id + ',' +
                    tour_sub_basis_id + ',' +
                    tour_time_id + ',' +
                    json.tour_pickups[i]['strPickupKey'] +
                    ')');

                pickup_id_td.appendChild(pickup_id_td_value);
                string_td.appendChild(string_td_value);

                newTableRow.setAttribute('id', new_id);
                newTableRow.setAttribute("onclick", "populate_form_fields('" + host_id + "','" +
                    tour_code + "','" +
                    tour_basis_id + "','" +
                    tour_sub_basis_id + "','" +
                    tour_time_id + "','" +
                    json.tour_pickups[i]['strPickupKey'] + "')");
                pickup_id_td.setAttribute('colspan', '1');
                string_td.setAttribute('colspan', '3');
                newTableRow.setAttribute("data-level", "5");


                newTableRow.appendChild(pickup_id_td);
                newTableRow.appendChild(string_td);
                addCSVButton(newTableRow, string_td, new_id, server_url, "tour codes");
                $(tableRow).after(newTableRow);
            }
            tableRow.setAttribute('onclick', 'remove_rows(this, "' + server_url + '")');
        }
    })
}

function populate_form_fields(host_id, tour_code, tour_basis_id, tour_sub_basis_id, tour_time_id, tour_pickups) {
    document.getElementById("host_id").value = host_id;
    document.getElementById("tour_code").value = tour_code;
    document.getElementById("basis").value = tour_basis_id;
    document.getElementById("sub_basis").value = tour_sub_basis_id;
    document.getElementById("tour_time_id").value = tour_time_id;
    document.getElementById("pickup_id").value = tour_pickups;
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

function collapseAllTableRows() {
    $('.expanded[data-level="1"]').click();
}

function remove_rows(table_row, server_url) {

    var this_level = parseInt($(table_row).data("level"), 10);
    var next_or_lower = name_range(create_selector,
        this_level + 1, 10);
    var this_or_higher = name_range(create_selector, 0, this_level);
    var node = $(table_row).nextUntil(this_or_higher.join(","));

    var host_id = table_row.id.split(',')[0];
    var tour_code = table_row.id.split(',')[1];
    var tour_basis_id = table_row.id.split(',')[2];
    var tour_sub_basis_id = table_row.id.split(',')[3];
    var tour_time_id = table_row.id.split(',')[4];
    var pickup_id = table_row.id.split(',')[5];

    $(node).remove();
    $(node).filter(next_or_lower.join(",")).hide();

    switch ((table_row.id.split(',')).length) {
        case 1:
            table_row.setAttribute("onclick", "get_tours(this, this.id,'" + server_url + "'); " +
                "populate_form_fields('" + host_id + "')");
            try {
                Array.prototype.slice.call(table_row.getElementsByTagName("td")[0].getElementsByTagName("button")).forEach(
                    function (item) {
                        item.remove();
                    });
            } catch (err) {
                console.log("Error: Download csv button does not exist to be deleted")
            }
            break;
        case 2:
            table_row.setAttribute('onclick', "get_tour_bases(this, this.id,'" + server_url + "'); " +
                "populate_form_fields('" + host_id + "','" + tour_code + "')");
            // try{
            //     table_row.getElementsByTagName("td")[0].getElementsByTagName("button")[0].remove();
            // }catch(err) {console.log("Error: Download csv button does not exist to be deleted")}
            break;
        case 4:
            table_row.setAttribute("onclick", "get_tour_times(this, this.id,'" + server_url + "'); " +
                "populate_form_fields('" + host_id + "','" + tour_code + "','" + tour_basis_id + "','" +
                tour_sub_basis_id + "')");
            try {
                table_row.getElementsByTagName("td")[0].getElementsByTagName("button")[0].remove();
            } catch (err) {
                console.log("Error: Download csv button does not exist to be deleted")
            }
            break;
        case 5:
            table_row.setAttribute("onclick", "get_tour_pickups(this, this.id,'" + server_url + "'); populate_form_fields('" + host_id + "','" +
                tour_code + "','" +
                tour_basis_id + "','" +
                tour_sub_basis_id + "','" +
                tour_time_id + "','" +
                pickup_id + "')");
            try {
                table_row.getElementsByTagName("td")[0].getElementsByTagName("button")[0].remove();
            } catch (err) {
                console.log("Error: Download csv button does not exist to be deleted")
            }
            break;
        default:
            console.log('function remove_rows switch statement error')
    }
}

