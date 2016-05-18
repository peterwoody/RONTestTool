/**
 * Created by Shaquille on 8/01/2016.
 */

function generateTable(operators, host_id, server_url) {

    for (var i = 0; i in operators; i++) {
        var tableRow = document.createElement('tr');
        var table = document.getElementById("test-tool-table").getElementsByTagName('tbody')[0];
        var operator_td = document.createElement("td");

        var operator_td_value = document.createTextNode(operators[i] + ' (' + host_id[i] + ')');

        operator_td.appendChild(operator_td_value);

        operator_td.setAttribute("colspan", "3");

        tableRow.setAttribute("id", (host_id[i]).toString());
        tableRow.setAttribute("onclick", "get_tours(this, this.id,'" + server_url + "'); " +
            "populate_form_fields('" + host_id[i] + "')");
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

function get_tours(tableRow, id, server_url) {
    console.log(server_url);

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

                    for (var i = 0; i in json.tours; i++) {
                        var newTableRow = document.createElement('tr');
                        var tour_code_td = document.createElement('td');
                        var tour_code = json.tours[i]['strTourCode'];
                        var tour_code_td_value = document.createTextNode('Tour Code: ' + tour_code);

                        tour_code_td.appendChild(tour_code_td_value);

                        tour_code_td.setAttribute('colspan', '4');
                        newTableRow.setAttribute('id', id + ',' + json.tours[i]['strTourCode'].toString());
                        newTableRow.setAttribute("onclick", "get_tour_bases(this, this.id,'" + server_url + "'); " +
                            "populate_form_fields('" + host_id + "','" + tour_code + "')");
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

            }
            loading_img.remove();
            tableRow.setAttribute('onclick', 'remove_rows(this,"' + server_url + '")');
        }
    })
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
    console.log((id.split(',')).length);
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

                var newTableRow = document.createElement('tr');

                var basis_td = document.createElement("td");
                var subbasis_td = document.createElement("td");

                var basis_td_value = document.createTextNode("Basis: " + json.tour_bases[i]['strBasisDesc'] + ' (' + json.tour_bases[i]['intBasisID'] + ')');

                var subbasis_td_value = document.createTextNode("Subbasis: " + json.tour_bases[i]['strSubBasisDesc'] + ' (' + json.tour_bases[i]['intSubBasisID'] + ')');

                basis_td.appendChild(basis_td_value);
                subbasis_td.appendChild(subbasis_td_value);

                basis_td.setAttribute('colspan', '1');
                subbasis_td.setAttribute('colspan', '3');
                newTableRow.setAttribute('id', id + ',' + tour_basis_id + ',' + tour_sub_basis_id);
                newTableRow.setAttribute("onclick", "get_tour_times(this, this.id, '" + server_url + "'); populate_form_fields('" + host_id + "','" +
                    tour_code + "','" +
                    tour_basis_id + "','" +
                    tour_sub_basis_id + "')");
                newTableRow.setAttribute("data-level", "3");

                newTableRow.appendChild(basis_td);
                newTableRow.appendChild(subbasis_td);

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

                var newTableRow = document.createElement('tr');

                var time_td = document.createElement("td");

                var time_td_value = document.createTextNode("Time: " + json.tour_times[i]['dteTourTime']['iso8601'] + ' (' + tour_time_id + ')');

                time_td.appendChild(time_td_value);

                time_td.setAttribute('colspan', '4');
                newTableRow.setAttribute('id', id + ',' + json.tour_times[i]['intTourTimeID']);
                newTableRow.setAttribute('onclick', "get_tour_pickups(this, this.id, '" + server_url + "');populate_form_fields('" + host_id + "','" +
                    tour_code + "','" +
                    tour_basis_id + "','" +
                    tour_sub_basis_id + "','" +
                    tour_time_id + "')");
                newTableRow.setAttribute("data-level", "4");

                newTableRow.appendChild(time_td);

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
            break;
        case 2:
            table_row.setAttribute('onclick', "get_tour_bases(this, this.id,'" + server_url + "'); " +
                "populate_form_fields('" + host_id + "','" + tour_code + "')");
            break;
        case 4:
            table_row.setAttribute("onclick", "get_tour_times(this, this.id,'" + server_url + "'); " +
                "populate_form_fields('" + host_id + "','" + tour_code + "','" + tour_basis_id + "','" +
                tour_sub_basis_id + "')");
            break;
        case 5:
            table_row.setAttribute("onclick", "get_tour_pickups(this, this.id,'" + server_url + "'); populate_form_fields('" + host_id + "','" +
                tour_code + "','" +
                tour_basis_id + "','" +
                tour_sub_basis_id + "','" +
                tour_time_id + "','" +
                pickup_id + "')");
            break;
        default:
            console.log('function remove_rows switch statement error')
    }
}



function generate_xml_request() {

    var method_name = document.getElementById('method_name').value || null;
    var tour_date = document.getElementById('date').value || null;
    var host_id = document.getElementById('host_id').value || null;
    var tour_code = document.getElementById('tour_code').value || null;
    var tour_basis_id = document.getElementById('basis').value || null;
    var tour_sub_basis_id = document.getElementById('sub_basis').value || null;
    var tour_time_id = document.getElementById('tour_time_id').value || null;
    var tour_pickup_id = document.getElementById('pickup_id').value || null;
    var tour_drop_off_id = document.getElementById('drop_off_id').value || null;

    $.ajax({
        type: 'POST',
        url: '/generate_xml/',
        dataType: 'json',
        async: true,

        data: {
            method_name: method_name,
            tour_date: tour_date,
            host_id: host_id,
            tour_code: tour_code,
            tour_time_id: tour_time_id,
            tour_basis_id: tour_basis_id,
            tour_sub_basis_id: tour_sub_basis_id,
            tour_pickup_id: tour_pickup_id,
            tour_drop_off_id: tour_drop_off_id,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            if (json.fault != null) {
                document.getElementById('xml_request').value = json.fault;
                console.log('fault');
            } else {
                document.getElementById('xml_request').value = json.generated_xml;
                console.log('xml');
            }

        }
    })
}

function submit_xml_request() {
    var server_url = document.getElementById('server_url').value;
    var xml = document.getElementById('xml_request').value;

    $.ajax({
        type: 'POST',
        url: '/submit_xml/',
        dataType: 'json',
        async: true,

        data: {
            server_url: server_url,
            xml: xml,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            console.log('executed');
            console.log(json.fault);

            document.getElementById('xml_response').textContent = (json.xml_response).toString();

            var table = document.getElementById('table_response');
            $(table).empty();

            var dictionary = json.table_response;
            var dictionary_keys = Object.keys(dictionary);
            console.log("json.table_response: ", json.table_response);
            var table_body = document.createElement('tbody');
            var table_row = document.createElement('tr');

            for (var i = 0; i < Object.keys(dictionary).length; i++) {

                var table_head = document.createElement('th');

                var table_head_value = document.createTextNode(dictionary_keys[i]);
                table_head.appendChild(table_head_value);

                table_row.appendChild(table_head);


                table_body.appendChild(table_row);


            }

            var k = 0;
            for (var j = 0; j < dictionary[dictionary_keys[k]].length; j++) {
                table_row = document.createElement('tr');
                for (i = 0; i < Object.keys(dictionary).length; i++) {

                    var table_column = document.createElement('td');

                    var table_row_value = document.createTextNode(dictionary[dictionary_keys[i]][j]);

                    table_column.appendChild(table_row_value);
                    table_row.appendChild(table_column);
                    table_body.appendChild(table_row);
                    k++;

                }
                k = 0;


                console.log("dictionary.key(): ", Object.keys(dictionary))


            }
            table.appendChild(table_body);

        }
    })
}

function change_format(format) {
    switch (format) {
        case "xml":
            $(document.getElementById("xml_response")).show();
            $(document.getElementById("table_response")).hide();

            document.getElementById("xml_format_button").disabled = true;
            document.getElementById("table_format_button").disabled = false;
            document.getElementById("xml_table_format_button").disabled = false;

            document.getElementById("xml_format_button").style.opacity = ".8";
            document.getElementById("table_format_button").style.opacity = "1";
            document.getElementById("xml_table_format_button").style.opacity = "1";
            break;
        case "table":
            $(document.getElementById("table_response")).show();
            $(document.getElementById("xml_response")).hide();

            document.getElementById("xml_format_button").disabled = false;
            document.getElementById("table_format_button").disabled = true;
            document.getElementById("xml_table_format_button").disabled = false;

            document.getElementById("xml_format_button").style.opacity = "1";
            document.getElementById("table_format_button").style.opacity = ".8";
            document.getElementById("xml_table_format_button").style.opacity = "1";
            break;
        case "xml_table":
            $(document.getElementById("xml_response")).show();
            $(document.getElementById("table_response")).show();

            document.getElementById("xml_format_button").disabled = false;
            document.getElementById("table_format_button").disabled = false;
            document.getElementById("xml_table_format_button").disabled = true;

            document.getElementById("xml_format_button").style.opacity = "1";
            document.getElementById("table_format_button").style.opacity = "1";
            document.getElementById("xml_table_format_button").style.opacity = ".8";
            break;

    }
}

function generate_submit_xml_request(){
    //to be added
}

function test_tool_query() {
    var tour_date = document.getElementById('date').value;
    var checkbox = document.getElementsByName('checkbox');
    var checkboxvalues = [];
    var host_id = [];
    var tour_code = [];
    var tour_basis_id = [];
    var tour_sub_basis_id = [];
    var tour_time_id = [];

    for (var i = 0; i in checkbox; i++) {
        if (checkbox[i].checked === true) {
            checkboxvalues.push(checkbox[i].value.split(','));
        }
    }

    for (var i = 0; i in checkboxvalues; i++) {
        console.log('here');
        for (var j = 0; j in host_id; j++) {
            console.log('there');
            console.log(checkboxvalues[i][0]);
            console.log(host_id[j]);
            if (checkboxvalues[i][0] !== host_id[j]) {
                host_id.push(checkboxvalues[i][0]);
            }
        }
    }

    $.ajax({
        type: 'POST',
        url: '/test_tool_form/',
        dataType: 'json',
        async: true,

        data: {
            tour_date: tour_date,
            host_id: host_id,
            tour_code: tour_code,
            tour_time_id: tour_time_id,
            tour_basis_id: tour_basis_id,
            tour_sub_basis_id: tour_sub_basis_id,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            console.log('executed');
            console.log(json.availability);

        }
    })
}

function fill_form_xml(){
    var xml = document.getElementById('xml_request').value;
    var method_name = document.getElementById('method_name');
    var tour_date = document.getElementById('date');
    var host_id = document.getElementById('host_id');
    var tour_code = document.getElementById('tour_code');
    var tour_basis_id = document.getElementById('basis');
    var tour_sub_basis_id = document.getElementById('sub_basis');
    var tour_time_id = document.getElementById('tour_time_id');
    var tour_pickup_id = document.getElementById('pickup_id');
    var tour_drop_off_id = document.getElementById('drop_off_id');

    $.ajax({
        type: 'POST',
        url: '/fill_form_xml/',
        dataType: 'json',
        async: true,

        data: {
            xml: xml,
            safe: false,
            csrfmiddlewaretoken: csrftoken
        },

        success: function (json) {
            console.log(json.loaded_xml);

            method_name.value = json.loaded_xml[1];


            switch (method_name.value){
                case "readHostDetails":
                    console.log(json.loaded_xml[0][0]);
                    host_id.value = json.loaded_xml[0][0];
                    break;
                case "readTours":
                    host_id.value = json.loaded_xml[0][0];
                    break;
                case "readTourDetails":
                    host_id.value = json.loaded_xml[0][0];
                    console.log(json.loaded_xml[0][1]);
                    tour_code.value = json.loaded_xml[0][1];
                    break;
                case "readTourBases":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    break;
                case "readTourTimes":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    break;
                case "readTourPickups":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    tour_basis_id.value = json.loaded_xml[0][2];
                    tour_time_id.value = json.loaded_xml[0][3];

                    var date = new Date(json.loaded_xml[0][4]);
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth()+1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                    tour_date.value = formattedDate;
                    break;
                case "readTourPrices":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    tour_basis_id.value = json.loaded_xml[0][2];
                    tour_sub_basis_id.value = json.loaded_xml[0][3];
                    tour_time_id.value = json.loaded_xml[0][8];
                    tour_pickup_id.value = json.loaded_xml[0][6];
                    tour_time_id.value = json.loaded_xml[0][5];
                    tour_drop_off_id.value = json.loaded_xml[0][7];
                    var date = new Date(json.loaded_xml[0][4]);
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth()+1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                    tour_date.value = formattedDate;
                    break;
                case "readTourAvailability":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    tour_basis_id.value = json.loaded_xml[0][2];
                    tour_sub_basis_id.value = json.loaded_xml[0][3];
                    tour_time_id.value = json.loaded_xml[0][5];
                    var date = new Date(json.loaded_xml[0][4]);
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth()+1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                    tour_date.value = formattedDate;
                    break;
            }
            show_hide_form_fields();
            console.log(method_name);
            console.log(host_id);


        }
    })
}

//$('#generate-xml-form').on('change', '#method_name', function () {
function show_hide_form_fields(){
            var method_name = document.getElementById("method_name").value;

            if (method_name == 'readHostDetails'){
                $("#host_id").show();
                $("#host_id_label").show();
                $("#tour_code").hide();
                $("#tour_code_label").hide();
                $("#basis").hide();
                $("#basis_label").hide();
                $("#sub_basis").hide();
                $("#sub_basis_label").hide();
                $("#tour_time_id").hide();
                $("#tour_time_id_label").hide();
                $("#pickup_id").hide();
                $("#pickup_id_label").hide();
                $("#drop_off_id").hide();
                $("#drop_off_id_label").hide();
                $("#date").hide();
                $("#date_label").hide();
                $("#type1").hide();
                $("#type1_label").hide();
                $("#type2").hide();
                $("#type2_label").hide();
                $("#type3").hide();
                $("#type3_label").hide();
                $("#type4").hide();
                $("#type4_label").hide();
                $("#type5").hide();
                $("#type5_label").hide();
            }
            else if(method_name == 'readTours') {
                $("#host_id").show();
                $("#host_id_label").show();
                $("#tour_code").hide();
                $("#tour_code_label").hide();
                $("#basis").hide();
                $("#basis_label").hide();
                $("#sub_basis").hide();
                $("#sub_basis_label").hide();
                $("#tour_time_id").hide();
                $("#tour_time_id_label").hide();
                $("#pickup_id").hide();
                $("#pickup_id_label").hide();
                $("#drop_off_id").hide();
                $("#drop_off_id_label").hide();
                $("#date").hide();
                $("#date_label").hide();
                $("#type1").hide();
                $("#type1_label").hide();
                $("#type2").hide();
                $("#type2_label").hide();
                $("#type3").hide();
                $("#type3_label").hide();
                $("#type4").hide();
                $("#type4_label").hide();
                $("#type5").hide();
                $("#type5_label").hide();
            }
            else if(method_name == 'readTourDetails') {
                $("#host_id").show();
                $("#host_id_label").show();
                $("#tour_code").show();
                $("#tour_code_label").show();
                $("#basis").hide();
                $("#basis_label").hide();
                $("#sub_basis").hide();
                $("#sub_basis_label").hide();
                $("#tour_time_id").hide();
                $("#tour_time_id_label").hide();
                $("#pickup_id").hide();
                $("#pickup_id_label").hide();
                $("#drop_off_id").hide();
                $("#drop_off_id_label").hide();
                $("#date").hide();
                $("#date_label").hide();
                $("#type1").hide();
                $("#type1_label").hide();
                $("#type2").hide();
                $("#type2_label").hide();
                $("#type3").hide();
                $("#type3_label").hide();
                $("#type4").hide();
                $("#type4_label").hide();
                $("#type5").hide();
                $("#type5_label").hide();
            }
            else if(method_name == 'readTourBases') {
                $("#host_id").show();
                $("#host_id_label").show();
                $("#tour_code").show();
                $("#tour_code_label").show();
                $("#basis").hide();
                $("#basis_label").hide();
                $("#sub_basis").hide();
                $("#sub_basis_label").hide();
                $("#tour_time_id").hide();
                $("#tour_time_id_label").hide();
                $("#pickup_id").hide();
                $("#pickup_id_label").hide();
                $("#drop_off_id").hide();
                $("#drop_off_id_label").hide();
                $("#date").hide();
                $("#date_label").hide();
                $("#type1").hide();
                $("#type1_label").hide();
                $("#type2").hide();
                $("#type2_label").hide();
                $("#type3").hide();
                $("#type3_label").hide();
                $("#type4").hide();
                $("#type4_label").hide();
                $("#type5").hide();
                $("#type5_label").hide();
            }
            else if(method_name == 'readTourTimes') {
                $("#host_id").show();
                $("#host_id_label").show();
                $("#tour_code").show();
                $("#tour_code_label").show();
                $("#basis").hide();
                $("#basis_label").hide();
                $("#sub_basis").hide();
                $("#sub_basis_label").hide();
                $("#tour_time_id").hide();
                $("#tour_time_id_label").hide();
                $("#pickup_id").hide();
                $("#pickup_id_label").hide();
                $("#drop_off_id").hide();
                $("#drop_off_id_label").hide();
                $("#date").hide();
                $("#date_label").hide();
                $("#type1").hide();
                $("#type1_label").hide();
                $("#type2").hide();
                $("#type2_label").hide();
                $("#type3").hide();
                $("#type3_label").hide();
                $("#type4").hide();
                $("#type4_label").hide();
                $("#type5").hide();
                $("#type5_label").hide();
            }
            else if(method_name == 'readTourPickups') {
                $("#host_id").show();
                $("#host_id_label").show();
                $("#tour_code").show();
                $("#tour_code_label").show();
                $("#basis").show();
                $("#basis_label").show();
                $("#sub_basis").hide();
                $("#sub_basis_label").hide();
                $("#tour_time_id").show();
                $("#tour_time_id_label").show();
                $("#pickup_id").hide();
                $("#pickup_id_label").hide();
                $("#drop_off_id").hide();
                $("#drop_off_id_label").hide();
                $("#date").show();
                $("#date_label").show();
                $("#type1").hide();
                $("#type1_label").hide();
                $("#type2").hide();
                $("#type2_label").hide();
                $("#type3").hide();
                $("#type3_label").hide();
                $("#type4").hide();
                $("#type4_label").hide();
                $("#type5").hide();
                $("#type5_label").hide();
            }
            else if(method_name == 'readTourPrices') {
                $("#host_id").show();
                $("#host_id_label").show();
                $("#tour_code").show();
                $("#tour_code_label").show();
                $("#basis").show();
                $("#basis_label").show();
                $("#sub_basis").show();
                $("#sub_basis_label").show();
                $("#tour_time_id").show();
                $("#tour_time_id_label").show();
                $("#pickup_id").show();
                $("#pickup_id_label").show();
                $("#drop_off_id").show();
                $("#drop_off_id_label").show();
                $("#date").show();
                $("#date_label").show();
                $("#type1").hide();
                $("#type1_label").hide();
                $("#type2").hide();
                $("#type2_label").hide();
                $("#type3").hide();
                $("#type3_label").hide();
                $("#type4").hide();
                $("#type4_label").hide();
                $("#type5").hide();
                $("#type5_label").hide();
            }
            else if(method_name == 'readTourAvailability') {
                $("#host_id").show();
                $("#host_id_label").show();
                $("#tour_code").show();
                $("#tour_code_label").show();
                $("#basis").show();
                $("#basis_label").show();
                $("#sub_basis").show();
                $("#sub_basis_label").show();
                $("#tour_time_id").show();
                $("#tour_time_id_label").show();
                $("#pickup_id").hide();
                $("#pickup_id_label").hide();
                $("#drop_off_id").hide();
                $("#drop_off_id_label").hide();
                $("#date").show();
                $("#date_label").show();
                $("#type1").hide();
                $("#type1_label").hide();
                $("#type2").hide();
                $("#type2_label").hide();
                $("#type3").hide();
                $("#type3_label").hide();
                $("#type4").hide();
                $("#type4_label").hide();
                $("#type5").hide();
                $("#type5_label").hide();
            }

        }