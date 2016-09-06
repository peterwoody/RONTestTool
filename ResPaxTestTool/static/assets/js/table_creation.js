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

//function generate_xml_request(button) {
//    window.scrollTo(0, 0);
//    document.getElementById("xml_request").focus();
//    var method_name = document.getElementById('method_name').value || null;
//    var tour_date = document.getElementById('date').value || null;
//    var host_id = document.getElementById('host_id').value || null;
//    var tour_code = document.getElementById('tour_code').value || null;
//    var tour_basis_id = document.getElementById('basis').value || null;
//    var tour_sub_basis_id = document.getElementById('sub_basis').value || null;
//    var tour_time_id = document.getElementById('tour_time_id').value || null;
//    var tour_pickup_id = document.getElementById('pickup_id').value || null;
//    var pickup_room_no = document.getElementById('pickup_room_no').value || null;
//    var tour_drop_off_id = document.getElementById('drop_off_id').value || null;
//    var pax_first_name = document.getElementById('pax_first_name').value || null;
//    var pax_last_name = document.getElementById('pax_last_name').value || null;
//    var pax_email = document.getElementById('pax_email').value || null;
//    var voucher_number = document.getElementById('voucher_number').value || null;
//    var no_pax_adults = document.getElementById('no_pax_adults').value || null;
//    var no_pax_child = document.getElementById('no_pax_child').value || null;
//    var no_pax_infant = document.getElementById('no_pax_infant').value || null;
//    var no_pax_foc = document.getElementById('no_pax_foc').value || null;
//    var no_pax_user_defined = document.getElementById('no_pax_user_defined').value || null;
//    var general_comment = document.getElementById('general_comment').value || null;
//    var booking_confirmed = document.getElementById('booking_confirmed').value || null;
//    var payment_option = document.getElementById('payment_option').value || null;
//    var card_name = document.getElementById('card_name').value || null;
//    var card_pan = document.getElementById('card_pan').value || null;
//    var card_vn = document.getElementById('card_vn').value || null;
//    var card_type_id = document.getElementById('card_type_id').value || null;
//    var card_expiry_month = document.getElementById('card_expiry_month').value || null;
//    var card_expiry_year = document.getElementById('card_expiry_year').value || null;
//
//    $.ajax({
//        type: 'POST',
//        url: '/generate_xml/',
//        dataType: 'json',
//        async: true,
//
//        data: {
//            method_name: method_name,
//            tour_date: tour_date,
//            host_id: host_id,
//            tour_code: tour_code,
//            tour_time_id: tour_time_id,
//            tour_basis_id: tour_basis_id,
//            tour_sub_basis_id: tour_sub_basis_id,
//            tour_pickup_id: tour_pickup_id,
//            pickup_room_no: pickup_room_no,
//            tour_drop_off_id: tour_drop_off_id,
//            pax_first_name: pax_first_name,
//            pax_last_name: pax_last_name,
//            pax_email: pax_email,
//            voucher_number: voucher_number,
//            no_pax_adults: no_pax_adults,
//            no_pax_child: no_pax_child,
//            no_pax_infant: no_pax_infant,
//            no_pax_foc: no_pax_foc,
//            no_pax_user_defined: no_pax_user_defined,
//            general_comment: general_comment,
//            booking_confirmed: booking_confirmed,
//            payment_option: payment_option,
//            card_name: card_name,
//            card_pan: card_pan,
//            card_vn: card_vn,
//            card_type_id: card_type_id,
//            card_expiry_month: card_expiry_month,
//            card_expiry_year: card_expiry_year,
//            safe: false,
//            csrfmiddlewaretoken: csrftoken
//        },
//
//        success: function (json) {
//            if (json.fault != null) {
//                document.getElementById('xml_request').value = json.fault;
//            } else {
//                document.getElementById('xml_request').value = json.generated_xml;
//            }
//            if (button.id === "generate_submit_btn") {
//                submit_xml_request();
//            }
//        }
//    })
//}
//
//function submit_xml_request() {
//    var server_url = document.getElementById('server_url').value;
//    var xml = document.getElementById('xml_request').value;
//    document.getElementById('xml_response').textContent = "";
//    var table = document.getElementById('table_response');
//    $(table).empty();
//    $.ajax({
//        type: 'POST',
//        url: '/submit_xml/',
//        dataType: 'json',
//        async: true,
//
//        data: {
//            server_url: server_url,
//            xml: xml,
//            safe: false,
//            csrfmiddlewaretoken: csrftoken
//        },
//
//        success: function (json) {
//            document.getElementById('xml_response').textContent = (json.xml_response).toString();
//
//            var table = document.getElementById('table_response');
//            $(table).empty();
//
//            var dictionary = json.table_response;
//            var dictionary_keys = Object.keys(dictionary);
//
//            var table_body = document.createElement('tbody');
//            var table_row = document.createElement('tr');
//
//            for (var i = 0; i < Object.keys(dictionary).length; i++) {
//
//                var table_head = document.createElement('th');
//
//                var table_head_value = document.createTextNode(dictionary_keys[i]);
//                table_head.appendChild(table_head_value);
//
//                table_row.appendChild(table_head);
//
//                table_body.appendChild(table_row);
//            }
//
//
//
//            var k = 0;
//            for (var j = 0; j < dictionary[dictionary_keys[k]].length; j++) {
//                table_row = document.createElement('tr');
//                for (i = 0; i < Object.keys(dictionary).length; i++) {
//
//                    var table_column = document.createElement('td');
//                    var table_row_value = document.createTextNode(dictionary[dictionary_keys[i]][j]);
//
//                    table_column.appendChild(table_row_value);
//                    table_row.appendChild(table_column);
//                    table_body.appendChild(table_row);
//                    k++;
//
//                }
//                k = 0;
//
//            }
//            table.appendChild(table_body);
//
//        }
//    })
//}
//
//function change_format(format) {
//    switch (format) {
//        case "xml":
//            $(document.getElementById("xml_response")).show();
//            $(document.getElementById("table_response")).hide();
//
//            document.getElementById("xml_format_button").disabled = true;
//            document.getElementById("table_format_button").disabled = false;
//            document.getElementById("xml_table_format_button").disabled = false;
//
//            document.getElementById("xml_format_button").style.opacity = ".8";
//            document.getElementById("table_format_button").style.opacity = "1";
//            document.getElementById("xml_table_format_button").style.opacity = "1";
//            break;
//        case "table":
//            $(document.getElementById("table_response")).show();
//            $(document.getElementById("xml_response")).hide();
//
//            document.getElementById("xml_format_button").disabled = false;
//            document.getElementById("table_format_button").disabled = true;
//            document.getElementById("xml_table_format_button").disabled = false;
//
//            document.getElementById("xml_format_button").style.opacity = "1";
//            document.getElementById("table_format_button").style.opacity = ".8";
//            document.getElementById("xml_table_format_button").style.opacity = "1";
//            break;
//        case "xml_table":
//            $(document.getElementById("xml_response")).show();
//            $(document.getElementById("table_response")).show();
//
//            document.getElementById("xml_format_button").disabled = false;
//            document.getElementById("table_format_button").disabled = false;
//            document.getElementById("xml_table_format_button").disabled = true;
//
//            document.getElementById("xml_format_button").style.opacity = "1";
//            document.getElementById("table_format_button").style.opacity = "1";
//            document.getElementById("xml_table_format_button").style.opacity = ".8";
//            break;
//
//    }
//}
//
//
//function test_tool_query() {
//    var tour_date = document.getElementById('date').value;
//    var checkbox = document.getElementsByName('checkbox');
//    var checkboxvalues = [];
//    var host_id = [];
//    var tour_code = [];
//    var tour_basis_id = [];
//    var tour_sub_basis_id = [];
//    var tour_time_id = [];
//
//    for (var i = 0; i in checkbox; i++) {
//        if (checkbox[i].checked === true) {
//            checkboxvalues.push(checkbox[i].value.split(','));
//        }
//    }
//
//    for (var i = 0; i in checkboxvalues; i++) {
//
//        for (var j = 0; j in host_id; j++) {
//            if (checkboxvalues[i][0] !== host_id[j]) {
//                host_id.push(checkboxvalues[i][0]);
//            }
//        }
//    }
//
//    $.ajax({
//        type: 'POST',
//        url: '/test_tool_form/',
//        dataType: 'json',
//        async: true,
//
//        data: {
//            tour_date: tour_date,
//            host_id: host_id,
//            tour_code: tour_code,
//            tour_time_id: tour_time_id,
//            tour_basis_id: tour_basis_id,
//            tour_sub_basis_id: tour_sub_basis_id,
//            safe: false,
//            csrfmiddlewaretoken: csrftoken
//        },
//
//        success: function (json) {
//
//
//        }
//    })
//}
//
//function fill_form_xml() {
//    var xml = document.getElementById('xml_request').value;
//    var method_name = document.getElementById('method_name');
//    var tour_date = document.getElementById('date');
//    var host_id = document.getElementById('host_id');
//    var tour_code = document.getElementById('tour_code');
//    var tour_basis_id = document.getElementById('basis');
//    var tour_sub_basis_id = document.getElementById('sub_basis');
//    var tour_time_id = document.getElementById('tour_time_id');
//    var tour_pickup_id = document.getElementById('pickup_id');
//    var tour_drop_off_id = document.getElementById('drop_off_id');
//    var pickup_room_no = document.getElementById('pickup_room_no');
//    var pax_first_name = document.getElementById('pax_first_name');
//    var pax_last_name = document.getElementById('pax_last_name');
//    var pax_email = document.getElementById('pax_email');
//    var voucher_number = document.getElementById('voucher_number');
//    var no_pax_adults = document.getElementById('no_pax_adults');
//    var no_pax_child = document.getElementById('no_pax_child');
//    var no_pax_infant = document.getElementById('no_pax_infant');
//    var no_pax_foc = document.getElementById('no_pax_foc');
//    var no_pax_user_defined = document.getElementById('no_pax_user_defined');
//    var general_comment = document.getElementById('general_comment');
//    var booking_confirmed = document.getElementById('booking_confirmed');
//    var payment_option = document.getElementById('payment_option');
//    var card_name = document.getElementById('card_name');
//    var card_pan = document.getElementById('card_pan');
//    var card_vn = document.getElementById('card_vn');
//    var card_type_id = document.getElementById('card_type_id');
//    var card_expiry_month = document.getElementById('card_expiry_month');
//    var card_expiry_year = document.getElementById('card_expiry_year');
//
//    $.ajax({
//        type: 'POST',
//        url: '/fill_form_xml/',
//        dataType: 'json',
//        async: true,
//
//        data: {
//            xml: xml,
//            safe: false,
//            csrfmiddlewaretoken: csrftoken
//        },
//
//        success: function (json) {
//            method_name.value = json.loaded_xml[1];
//
//            switch (method_name.value) {
//                case "readHostDetails":
//                    host_id.value = json.loaded_xml[0][0];
//                    break;
//                case "readPaymentOptions":
//                    host_id.value = json.loaded_xml[0][0];
//                    break;
//                case "readPaxTypes":
//                    host_id.value = json.loaded_xml[0][0];
//                    break;
//                case "readTours":
//                    host_id.value = json.loaded_xml[0][0];
//                    break;
//                case "readCreditStatus":
//                    host_id.value = json.loaded_xml[0][0];
//                    break;
//                case "readTourDetails":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1];
//                    break;
//                case "readTourBases":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1];
//                    break;
//                case "readTourTimes":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1];
//                    break;
//                case "readTourWebDetails":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1];
//                    break;
//                case "readTourPickups":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1];
//                    tour_basis_id.value = json.loaded_xml[0][3];
//                    tour_time_id.value = json.loaded_xml[0][2];
//
//                    var date = new Date(json.loaded_xml[0][4]);
//                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
//                    tour_date.value = formattedDate;
//                    break;
//                case "readTourPrices":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1];
//                    tour_basis_id.value = json.loaded_xml[0][2];
//                    tour_sub_basis_id.value = json.loaded_xml[0][3];
//                    tour_time_id.value = json.loaded_xml[0][8];
//                    tour_pickup_id.value = json.loaded_xml[0][6];
//                    tour_time_id.value = json.loaded_xml[0][5];
//                    tour_drop_off_id.value = json.loaded_xml[0][7];
//                    var date = new Date(json.loaded_xml[0][4]);
//                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
//                    tour_date.value = formattedDate;
//                    break;
//                case "readTourAvailability":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1];
//                    tour_basis_id.value = json.loaded_xml[0][2];
//                    tour_sub_basis_id.value = json.loaded_xml[0][3];
//                    tour_time_id.value = json.loaded_xml[0][5];
//                    var date = new Date(json.loaded_xml[0][4]);
//                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
//                    tour_date.value = formattedDate;
//
//                    break;
//                case "checkReservation":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1]["strTourCode"];
//                    tour_basis_id.value = json.loaded_xml[0][1]["intBasisID"];
//                    tour_sub_basis_id.value = json.loaded_xml[0][1]["intSubBasisID"];
//                    tour_time_id.value = json.loaded_xml[0][1]["intTourTimeID"];
//                    var date = new Date(json.loaded_xml[0][1]["dteTourDate"]);
//                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
//                    tour_date.value = formattedDate;
//                    tour_pickup_id.value = json.loaded_xml[0][1]["strPickupKey"];
//                    pickup_room_no.value = json.loaded_xml[0][1]["strPickupRoomNo"];
//                    pax_first_name.value = json.loaded_xml[0][1]["strPaxFirstName"];
//                    pax_last_name.value = json.loaded_xml[0][1]["strPaxLastName"];
//                    pax_email.value = json.loaded_xml[0][1]["strPaxEmail"];
//                    no_pax_adults.value = json.loaded_xml[0][1]["intNoPax_Adults"];
//                    no_pax_child.value = json.loaded_xml[0][1]["intNoPax_Child"];
//                    no_pax_infant.value = json.loaded_xml[0][1]["intNoPax_Infant"];
//                    no_pax_foc.value = json.loaded_xml[0][1]["intNoPax_FOC"];
//                    no_pax_user_defined.value = json.loaded_xml[0][1]["intNoPax_UDef1"];
//                    general_comment.value = json.loaded_xml[0][1]["strGeneralComment"];
//                    payment_option.value = json.loaded_xml[0][2]["strPaymentOption"];
//                    break;
//                case "checkReservationAndPrices":
//                    host_id.value = json.loaded_xml[0][0];
//                    tour_code.value = json.loaded_xml[0][1]["strTourCode"];
//                    tour_basis_id.value = json.loaded_xml[0][1]["intBasisID"];
//                    tour_sub_basis_id.value = json.loaded_xml[0][1]["intSubBasisID"];
//                    tour_time_id.value = json.loaded_xml[0][1]["intTourTimeID"];
//                    var date = new Date(json.loaded_xml[0][1]["dteTourDate"]);
//                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
//                    tour_date.value = formattedDate;
//                    tour_pickup_id.value = json.loaded_xml[0][1]["strPickupKey"];
//                    pickup_room_no.value = json.loaded_xml[0][1]["strPickupRoomNo"];
//                    pax_first_name.value = json.loaded_xml[0][1]["strPaxFirstName"];
//                    pax_last_name.value = json.loaded_xml[0][1]["strPaxLastName"];
//                    pax_email.value = json.loaded_xml[0][1]["strPaxEmail"];
//                    no_pax_adults.value = json.loaded_xml[0][1]["intNoPax_Adults"];
//                    no_pax_child.value = json.loaded_xml[0][1]["intNoPax_Child"];
//                    no_pax_infant.value = json.loaded_xml[0][1]["intNoPax_Infant"];
//                    no_pax_foc.value = json.loaded_xml[0][1]["intNoPax_FOC"];
//                    no_pax_user_defined.value = json.loaded_xml[0][1]["intNoPax_UDef1"];
//                    general_comment.value = json.loaded_xml[0][1]["strGeneralComment"];
//                    payment_option.value = json.loaded_xml[0][2]["strPaymentOption"];
//                    break;
//                case "writeReservation":
//                    host_id.value = json.loaded_xml[0][0];
//                    booking_confirmed.value = json.loaded_xml[0][1];
//                    tour_code.value = json.loaded_xml[0][2]["strTourCode"];
//                    tour_basis_id.value = json.loaded_xml[0][2]["intBasisID"];
//                    tour_sub_basis_id.value = json.loaded_xml[0][2]["intSubBasisID"];
//                    tour_time_id.value = json.loaded_xml[0][2]["intTourTimeID"];
//                    var date = new Date(json.loaded_xml[0][2]["dteTourDate"]);
//                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
//                    tour_date.value = formattedDate;
//                    tour_pickup_id.value = json.loaded_xml[0][2]["strPickupKey"];
//                    pickup_room_no.value = json.loaded_xml[0][2]["strPickupRoomNo"];
//                    pax_first_name.value = json.loaded_xml[0][2]["strPaxFirstName"];
//                    pax_last_name.value = json.loaded_xml[0][2]["strPaxLastName"];
//                    pax_email.value = json.loaded_xml[0][2]["strPaxEmail"];
//                    voucher_number.value = json.loaded_xml[0][2]["strstrVoucherNo"];
//                    no_pax_adults.value = json.loaded_xml[0][2]["intNoPax_Adults"];
//                    no_pax_child.value = json.loaded_xml[0][2]["intNoPax_Child"];
//                    no_pax_infant.value = json.loaded_xml[0][2]["intNoPax_Infant"];
//                    no_pax_foc.value = json.loaded_xml[0][2]["intNoPax_FOC"];
//                    no_pax_user_defined.value = json.loaded_xml[0][2]["intNoPax_UDef1"];
//                    general_comment.value = json.loaded_xml[0][2]["strGeneralComment"];
//                    payment_option.value = json.loaded_xml[0][3]["strPaymentOption"];
//                    card_name.value = json.loaded_xml[0][4]["strCardName"];
//                    card_pan.value = json.loaded_xml[0][4]["strCardPAN"];
//                    card_vn.value = json.loaded_xml[0][4]["strCardVN"];
//                    card_type_id.value = json.loaded_xml[0][4]["strCardTypeID"];
//                    card_expiry_month.value = json.loaded_xml[0][4]["intCardExpiryMonth"];
//                    card_expiry_year.value = json.loaded_xml[0][4]["intCardExpiryYear"];
//
//                    break;
//            }
//            show_hide_form_fields();
//        }
//    })
//}
//
//function hide_xml_request_textarea(button) {
//    if (document.getElementById("xml_request").hidden === true) {
//        document.getElementById("xml_request").hidden = false;
//        button.innerHTML = "Hide";
//    } else {
//        document.getElementById("xml_request").hidden = true;
//        button.innerHTML = "Show";
//    }
//}
//
//function hide_xml_response_textarea(button) {
//    if (document.getElementById("xml_response").hidden === true) {
//        document.getElementById("xml_response").hidden = false;
//        button.innerHTML = "Hide";
//    } else {
//        document.getElementById("xml_response").hidden = true;
//        button.innerHTML = "Show";
//    }
//}
//
//
//function show_hide_form_fields(){
//    var method_name = document.getElementById("method_name").value;
//
//    var methodDict = { "host_id": false,"tour_code": false,"basis": false,"sub_basis": false,"tour_time_id": false,
//                    "pickup_id": false,"pickup_room_no": false,"drop_off_id": false,"date": false,"pax_first_name": false,
//                    "pax_last_name": false,"pax_email": false,"nfo_pax_adults": false,"no_pax_child": false,"no_pax_infant": false,
//                    "no_pax_foc": false,"no_pax_user_defined": false,"general_comment": false,"booking_confirmed": false,"payment_option": false,
//                    "card_name": false,"card_pan": false,"card_vn": false,"card_type_id": false,"card_expiry_month": false,"card_expiry_year": false, "voucher_number": false};
//
//    if (method_name == 'readHosts' || method_name == 'readCurrentLogin') {
//        //blank because the array does not change
//    }
//
//    else if  ( (method_name == 'readHostDetails') ||  (method_name == 'readPaymentOptions') || (method_name == 'readTours')
//                || (method_name == 'readPaxTypes')|| (method_name == 'readCreditStatus')){
//        methodDict.host_id = true;
//    }
//    else if  ((method_name == 'readTourDetails') || (method_name == 'readTourBases') || (method_name == 'readTourTimes')
//                || (method_name == 'readTourWebDetails')){
//        methodDict.host_id = true;
//        methodDict.tour_code = true;
//    }
//    else if (method_name == 'readTourPickups') {
//        methodDict.host_id = true;
//        methodDict.tour_code = true;
//        methodDict.basis = true;
//        methodDict.tour_time_id = true;
//        methodDict.date = true;
//    }
//    else if (method_name == 'readTourPrices') {
//        methodDict = { "host_id": true,"tour_code": true,"basis": true,"sub_basis": true,"tour_time_id": true,
//                    "pickup_id": true,"pickup_room_no": false,"drop_off_id": true,"date": true,"pax_first_name": false,
//                    "pax_last_name": false,"pax_email": false,"nfo_pax_adults": false,"no_pax_child": false,"no_pax_infant": false,
//                    "no_pax_foc": false,"no_pax_user_defined": false,"general_comment": false,"booking_confirmed": false,"payment_option": false,
//                    "card_name": false,"card_pan": false,"card_vn": false,"card_type_id": false,"card_expiry_month": false,"card_expiry_year": false, "voucher_number": false};
//    }
//    else if (method_name == 'readTourAvailability') {
//        methodDict = { "host_id": true,"tour_code": true,"basis": true,"sub_basis": true,"tour_time_id": true,
//                    "pickup_id": false,"pickup_room_no": false,"drop_off_id": false,"date": true,"pax_first_name": false,
//                    "pax_last_name": false,"pax_email": false,"nfo_pax_adults": false,"no_pax_child": false,"no_pax_infant": false,
//                    "no_pax_foc": false,"no_pax_user_defined": false,"general_comment": false,"booking_confirmed": false,"payment_option": false,
//                    "card_name": false,"card_pan": false,"card_vn": false,"card_type_id": false,"card_expiry_month": false,"card_expiry_year": false, "voucher_number": false};
//    }
//    else if (method_name == 'checkReservation' || method_name == 'checkReservationAndPrices') {
//        methodDict = { "host_id": true,"tour_code": true,"basis": true,"sub_basis": true,"tour_time_id": true,
//                    "pickup_id": true,"pickup_room_no": true,"drop_off_id": false,"date": true,"pax_first_name": true,
//                    "pax_last_name": true,"pax_email": true,"nfo_pax_adults": true,"no_pax_child": true,"no_pax_infant": true,
//                    "no_pax_foc": true,"no_pax_user_defined": true,"general_comment": true,"booking_confirmed": true,"payment_option": true,
//                    "card_name": false,"card_pan": false,"card_vn": false,"card_type_id": false,"card_expiry_month": false,"card_expiry_year": false, "voucher_number": false};
//    }
//
//    else if (method_name == 'writeReservation') {
//        //Setting all to true as this method requires all the fields
//        for (var key in methodDict) {
//            methodDict[key] = true;
//        }
//    }
//
//    for (var key in methodDict) {
//        if (methodDict[key]){
//            $("#"+key).show();
//            $("#"+key+"_label").show();
//        }else{
//            $("#"+key).hide();
//            $("#"+key+"_label").hide();
//        }
//    }
//}



//Daniel here: trying out a pluggin for detecting div change
(function(){
  var attachEvent = document.attachEvent;
  var isIE = navigator.userAgent.match(/Trident/);
  console.log(isIE);
  var requestFrame = (function(){
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){ return window.setTimeout(fn, 20); };
    return function(fn){ return raf(fn); };
  })();

  var cancelFrame = (function(){
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
           window.clearTimeout;
    return function(id){ return cancel(id); };
  })();

  function resizeListener(e){
    var win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function(){
      var trigger = win.__resizeTrigger__;
      trigger.__resizeListeners__.forEach(function(fn){
        fn.call(trigger, e);
      });
    });
  }

  function objectLoad(e){
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }

  window.addResizeListener = function(element, fn){
    if (!element.__resizeListeners__) {
      element.__resizeListeners__ = [];
      if (attachEvent) {
        element.__resizeTrigger__ = element;
        element.attachEvent('onresize', resizeListener);
      }
      else {
        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
        var obj = element.__resizeTrigger__ = document.createElement('object');
        obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        obj.__resizeElement__ = element;
        obj.onload = objectLoad;
        obj.type = 'text/html';
        if (isIE) element.appendChild(obj);
        obj.data = 'about:blank';
        if (!isIE) element.appendChild(obj);
      }
    }
    element.__resizeListeners__.push(fn);
  };

  window.removeResizeListener = function(element, fn){
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      if (attachEvent) element.detachEvent('onresize', resizeListener);
      else {
        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
      }
    }
  }
})();

function add_xml_form_listener(){
    //implementing the event listener above to attach to the xml form resize
    var myElement = document.getElementById('method_form'),
    myResizeFn = function(){
        var x = $("#method_form").width()+20;
        $('.container').css({'margin-left':x+'px'});
    };
    addResizeListener(myElement, myResizeFn);
}

