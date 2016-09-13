/**
 * Created by Shaquille on 6/09/2016.
 */

//function generate_xml_request(button) {
$(document).ready(function () {

    //var server_url = document.getElementById('server_url').value || null;
    //var method_name = document.getElementById('method_name').value || null;
    //var tour_date = document.getElementById('date').value || null;
    //var host_id = document.getElementById('host_id').value || null;
    //var tour_code = document.getElementById('tour_code').value || null;
    //var tour_basis_id = document.getElementById('basis').value || null;
    //var tour_sub_basis_id = document.getElementById('sub_basis').value || null;
    //var tour_time_id = document.getElementById('tour_time_id').value || null;
    //var tour_pickup_id = document.getElementById('pickup_id').value || null;
    //var pickup_room_no = document.getElementById('pickup_room_no').value || null;
    //var tour_drop_off_id = document.getElementById('drop_off_id').value || null;
    //var pax_first_name = document.getElementById('pax_first_name').value || null;
    //var pax_last_name = document.getElementById('pax_last_name').value || null;
    //var pax_email = document.getElementById('pax_email').value || null;
    //var no_pax_adults = document.getElementById('no_pax_adults').value || null;
    //var no_pax_child = document.getElementById('no_pax_child').value || null;
    //var no_pax_infant = document.getElementById('no_pax_infant').value || null;
    //var no_pax_foc = document.getElementById('no_pax_foc').value || null;
    //var no_pax_user_defined = document.getElementById('no_pax_user_defined').value || null;
    //var general_comment = document.getElementById('general_comment').value || null;
    //var booking_confirmed = document.getElementById('booking_confirmed').value || null;
    //var payment_option = document.getElementById('payment_option').value || null;
    //var card_name = document.getElementById('card_name').value || null;
    //var card_pan = document.getElementById('card_pan').value || null;
    //var card_vn = document.getElementById('card_vn').value || null;
    //var card_type_id = document.getElementById('card_type_id').value || null;
    //var card_expiry_month = document.getElementById('card_expiry_month').value || null;
    //var card_expiry_year = document.getElementById('card_expiry_year').value || null;
    //var confirmation_no = document.getElementById('confirmation_no').value || null;
    //var reason = document.getElementById('reason').value || null;
    //var query = document.getElementById('query').value || null;

    var generate_xml_form = $('#generate-xml-form');

    generate_xml_form.submit(function (event) {
        window.scrollTo(0, 0);

        $.ajax({
            //type: generate_xml_form.method,
            //url: generate_xml_form.action,
            type: "POST",
            url: "/generate_xml/",
            dataType: 'json',
            async: true,
            data: generate_xml_form.serialize(),
            //data:{
            //    server_url: server_url,
            //    method_name: method_name,
            //    tour_date: tour_date,
            //    host_id: host_id,
            //    tour_code: tour_code,
            //    tour_time_id: tour_time_id,
            //    tour_basis_id: tour_basis_id,
            //    tour_sub_basis_id: tour_sub_basis_id,
            //    tour_pickup_id: tour_pickup_id,
            //    pickup_room_no: pickup_room_no,
            //    tour_drop_off_id: tour_drop_off_id,
            //    pax_first_name: pax_first_name,
            //    pax_last_name: pax_last_name,
            //    pax_email: pax_email,
            //    no_pax_adults: no_pax_adults,
            //    no_pax_child: no_pax_child,
            //    no_pax_infant: no_pax_infant,
            //    no_pax_foc: no_pax_foc,
            //    no_pax_user_defined: no_pax_user_defined,
            //    general_comment: general_comment,
            //    booking_confirmed: booking_confirmed,
            //    payment_option: payment_option,
            //    card_name: card_name,
            //    card_pan: card_pan,
            //    card_vn: card_vn,
            //    card_type_id: card_type_id,
            //    card_expiry_month: card_expiry_month,
            //    card_expiry_year: card_expiry_year,
            //    confirmation_no: confirmation_no,
            //    reason: reason,
            //    query: query,
            //    safe: false,
            //    csrfmiddlewaretoken: csrftoken
            //},

            success: function (json) {
                document.getElementById('xml_response').textContent = "";
                if (json.fault != null) {
                    document.getElementById('xml_request').value = json.fault;
                } else {
                    document.getElementById('xml_request').value = json.generated_xml;
                }
                if (document.activeElement.id === "generate_submit_btn") {
                    submit_xml_request();
                }
            }

        });
        event.preventDefault();
    });
//}
});

function switch_users() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var server_config = document.getElementById("server_config").value;
    var server_url = document.getElementById('server_url').value;
    $.ajax({
        type: "POST",
        url: "/test_tool/",
        async: true,
        data: {
            submit: "login",
            username: username,
            password: password,
            server_config: server_config,
            server_url: server_url,
            csrfmiddlewaretoken: csrftoken
        },
        success: function () {
            console.log("asdfafdaf");
            window.location.reload(true);
        }
    });
}

function submit_xml_request() {
    var server_url = document.getElementById('server_url').value;
    var xml = document.getElementById('xml_request').value;
    document.getElementById('xml_response').textContent = "";
    var table = document.getElementById('table_response');
    $(table).empty();
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
            document.getElementById('xml_response').textContent = (json.xml_response).toString();

            var table = document.getElementById('table_response');
            $(table).empty();

            var dictionary = json.table_response;
            var dictionary_keys = Object.keys(dictionary);

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

            }
            table.appendChild(table_body);

        }
    })
}

function add_query() {
    var method_name = document.getElementById('method_name').value || null;
    var start_date = document.getElementById('start_date').value || null;
    var end_date = document.getElementById('end_date').value || null;
    var host_id = document.getElementById('host_id').value || null;
    var tour_code = document.getElementById('tour_code').value || null;
    var tour_basis_id = document.getElementById('basis').value || null;
    var tour_sub_basis_id = document.getElementById('sub_basis').value || null;
    var tour_time_id = document.getElementById('tour_time_id').value || null;
    var tour_pickup_id = document.getElementById('pickup_id').value || null;
    var query = document.getElementById('query');
    var query_value = query.value;
    var month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    query_value = JSON.parse(query_value);

    console.log(start_date);
    console.log(end_date);

    var tour_date = new Date(start_date);
    end_date = new Date(end_date);
    while (tour_date <= end_date) {

        query_value.push({
            "strHostID": host_id,
            "strTourCode": tour_code,
            "intBasisID": tour_basis_id,
            "intSubBasisID": tour_sub_basis_id,
            "intTourTimeID": tour_time_id,
            //"strPickupKey": tour_pickup_id,
            "dteTourDate": ("0" + tour_date.getDate()).slice(-2) + "-" + (month_names[tour_date.getMonth()]) + "-" + tour_date.getFullYear()
        });

        tour_date.setDate(tour_date.getDate() + 1);
    }
    query.value = JSON.stringify(query_value);
}

function delete_query() {
    document.getElementById('query').value = "[]";
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

function fill_form_xml() {
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
    var pickup_room_no = document.getElementById('pickup_room_no');
    var pax_first_name = document.getElementById('pax_first_name');
    var pax_last_name = document.getElementById('pax_last_name');
    var pax_email = document.getElementById('pax_email');
    var no_pax_adults = document.getElementById('no_pax_adults');
    var no_pax_child = document.getElementById('no_pax_child');
    var no_pax_infant = document.getElementById('no_pax_infant');
    var no_pax_foc = document.getElementById('no_pax_foc');
    var no_pax_user_defined = document.getElementById('no_pax_user_defined');
    var general_comment = document.getElementById('general_comment');
    var booking_confirmed = document.getElementById('booking_confirmed');
    var payment_option = document.getElementById('payment_option');
    var card_name = document.getElementById('card_name');
    var card_pan = document.getElementById('card_pan');
    var card_vn = document.getElementById('card_vn');
    var card_type_id = document.getElementById('card_type_id');
    var card_expiry_month = document.getElementById('card_expiry_month');
    var card_expiry_year = document.getElementById('card_expiry_year');
    var query = document.getElementById('query');

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
            method_name.value = json.loaded_xml[1];

            switch (method_name.value) {
                case "readHostDetails":
                    host_id.value = json.loaded_xml[0][0];
                    break;
                case "readPaymentOptions":
                    host_id.value = json.loaded_xml[0][0];
                    break;
                case "readPaxTypes":
                    host_id.value = json.loaded_xml[0][0];
                    break;
                case "readSources":
                    host_id.value = json.loaded_xml[0][0];
                    break;
                case "readTours":
                    host_id.value = json.loaded_xml[0][0];
                    break;
                case "readCreditStatus":
                    host_id.value = json.loaded_xml[0][0];
                    break;
                case "readTourDetails":
                    host_id.value = json.loaded_xml[0][0];
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
                case "readTourWebDetails":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    break;
                case "readTourPickup":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    tour_basis_id.value = json.loaded_xml[0][2];
                    tour_time_id.value = json.loaded_xml[0][3];
                    tour_pickup_id.value = json.loaded_xml[0][4];
                    break;
                case "readTourPickups":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    tour_basis_id.value = json.loaded_xml[0][3];
                    tour_time_id.value = json.loaded_xml[0][2];

                    var date = new Date(json.loaded_xml[0][4]);
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
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
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                    tour_date.value = formattedDate;
                    break;
                case "readTourPricesRange":
                    query.value = JSON.stringify(json.loaded_xml[0][0]);
                    break;
                case "readTourAvailability":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1];
                    tour_basis_id.value = json.loaded_xml[0][2];
                    tour_sub_basis_id.value = json.loaded_xml[0][3];
                    tour_time_id.value = json.loaded_xml[0][5];
                    var date = new Date(json.loaded_xml[0][4]);
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                    tour_date.value = formattedDate;

                    break;
                case "readTourAvailabilityRange":
                    query.value = JSON.stringify(json.loaded_xml[0][0]);
                    break;
                case "checkReservation":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1]["strTourCode"];
                    tour_basis_id.value = json.loaded_xml[0][1]["intBasisID"];
                    tour_sub_basis_id.value = json.loaded_xml[0][1]["intSubBasisID"];
                    tour_time_id.value = json.loaded_xml[0][1]["intTourTimeID"];
                    var date = new Date(json.loaded_xml[0][1]["dteTourDate"]);
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                    tour_date.value = formattedDate;
                    tour_pickup_id.value = json.loaded_xml[0][1]["strPickupKey"];
                    pickup_room_no.value = json.loaded_xml[0][1]["strPickupRoomNo"];
                    pax_first_name.value = json.loaded_xml[0][1]["strPaxFirstName"];
                    pax_last_name.value = json.loaded_xml[0][1]["strPaxLastName"];
                    pax_email.value = json.loaded_xml[0][1]["strPaxEmail"];
                    no_pax_adults.value = json.loaded_xml[0][1]["intNoPax_Adults"];
                    no_pax_child.value = json.loaded_xml[0][1]["intNoPax_Child"];
                    no_pax_infant.value = json.loaded_xml[0][1]["intNoPax_Infant"];
                    no_pax_foc.value = json.loaded_xml[0][1]["intNoPax_FOC"];
                    no_pax_user_defined.value = json.loaded_xml[0][1]["intNoPax_UDef1"];
                    general_comment.value = json.loaded_xml[0][1]["strGeneralComment"];
                    payment_option.value = json.loaded_xml[0][2]["strPaymentOption"];
                    break;
                case "checkReservationAndPrices":
                    host_id.value = json.loaded_xml[0][0];
                    tour_code.value = json.loaded_xml[0][1]["strTourCode"];
                    tour_basis_id.value = json.loaded_xml[0][1]["intBasisID"];
                    tour_sub_basis_id.value = json.loaded_xml[0][1]["intSubBasisID"];
                    tour_time_id.value = json.loaded_xml[0][1]["intTourTimeID"];
                    var date = new Date(json.loaded_xml[0][1]["dteTourDate"]);
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                    tour_date.value = formattedDate;
                    tour_pickup_id.value = json.loaded_xml[0][1]["strPickupKey"];
                    pickup_room_no.value = json.loaded_xml[0][1]["strPickupRoomNo"];
                    pax_first_name.value = json.loaded_xml[0][1]["strPaxFirstName"];
                    pax_last_name.value = json.loaded_xml[0][1]["strPaxLastName"];
                    pax_email.value = json.loaded_xml[0][1]["strPaxEmail"];
                    no_pax_adults.value = json.loaded_xml[0][1]["intNoPax_Adults"];
                    no_pax_child.value = json.loaded_xml[0][1]["intNoPax_Child"];
                    no_pax_infant.value = json.loaded_xml[0][1]["intNoPax_Infant"];
                    no_pax_foc.value = json.loaded_xml[0][1]["intNoPax_FOC"];
                    no_pax_user_defined.value = json.loaded_xml[0][1]["intNoPax_UDef1"];
                    general_comment.value = json.loaded_xml[0][1]["strGeneralComment"];
                    payment_option.value = json.loaded_xml[0][2]["strPaymentOption"];
                    break;
                case "writeReservation":
                    host_id.value = json.loaded_xml[0][0];
                    booking_confirmed.value = json.loaded_xml[0][1];
                    tour_code.value = json.loaded_xml[0][2]["strTourCode"];
                    tour_basis_id.value = json.loaded_xml[0][2]["intBasisID"];
                    tour_sub_basis_id.value = json.loaded_xml[0][2]["intSubBasisID"];
                    tour_time_id.value = json.loaded_xml[0][2]["intTourTimeID"];
                    var date = new Date(json.loaded_xml[0][2]["dteTourDate"]);
                    var formattedDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);
                    tour_date.value = formattedDate;
                    tour_pickup_id.value = json.loaded_xml[0][2]["strPickupKey"];
                    pickup_room_no.value = json.loaded_xml[0][2]["strPickupRoomNo"];
                    pax_first_name.value = json.loaded_xml[0][2]["strPaxFirstName"];
                    pax_last_name.value = json.loaded_xml[0][2]["strPaxLastName"];
                    pax_email.value = json.loaded_xml[0][2]["strPaxEmail"];
                    no_pax_adults.value = json.loaded_xml[0][2]["intNoPax_Adults"];
                    no_pax_child.value = json.loaded_xml[0][2]["intNoPax_Child"];
                    no_pax_infant.value = json.loaded_xml[0][2]["intNoPax_Infant"];
                    no_pax_foc.value = json.loaded_xml[0][2]["intNoPax_FOC"];
                    no_pax_user_defined.value = json.loaded_xml[0][2]["intNoPax_UDef1"];
                    general_comment.value = json.loaded_xml[0][2]["strGeneralComment"];
                    payment_option.value = json.loaded_xml[0][3]["strPaymentOption"];
                    card_name.value = json.loaded_xml[0][4]["strCardName"];
                    card_pan.value = json.loaded_xml[0][4]["strCardPAN"];
                    card_vn.value = json.loaded_xml[0][4]["strCardVN"];
                    card_type_id.value = json.loaded_xml[0][4]["strCardTypeID"];
                    card_expiry_month.value = json.loaded_xml[0][4]["intCardExpiryMonth"];
                    card_expiry_year.value = json.loaded_xml[0][4]["intCardExpiryYear"];
                    break;
            }
            show_hide_form_fields();
        }
    })
}

function hide_xml_request_textarea(button) {
    if (document.getElementById("xml_request").hidden === true) {
        document.getElementById("xml_request").hidden = false;
        button.innerHTML = "Hide";
    } else {
        document.getElementById("xml_request").hidden = true;
        button.innerHTML = "Show";
    }
}

function hide_xml_response_textarea(button) {
    if (document.getElementById("xml_response").hidden === true) {
        document.getElementById("xml_response").hidden = false;
        button.innerHTML = "Hide";
    } else {
        document.getElementById("xml_response").hidden = true;
        button.innerHTML = "Show";
    }
}


function show_hide_form_fields() {
    var method_name = document.getElementById("method_name").value;

    var methodDict = {
        "host_id": false,
        "tour_code": false,
        "basis": false,
        "sub_basis": false,
        "tour_time_id": false,
        "pickup_id": false,
        "pickup_room_no": false,
        "drop_off_id": false,
        "tour_date": false,
        "start_date": false,
        "end_date": false,
        "pax_first_name": false,
        "pax_last_name": false,
        "pax_email": false,
        "no_pax_adults": false,
        "no_pax_child": false,
        "no_pax_infant": false,
        "no_pax_foc": false,
        "no_pax_user_defined": false,
        "general_comment": false,
        "booking_confirmed": false,
        "payment_option": false,
        "card_name": false,
        "card_pan": false,
        "card_vn": false,
        "card_type_id": false,
        "card_expiry_month": false,
        "card_expiry_year": false,
        "confirmation_no": false,
        "reason": false,
        "query": false,
        "add_query_btn": false,
        "del_query_btn": false,
        "voucher_number": false
    };

    var required_dict = {
        "host_id": false,
        "tour_code": false,
        "basis": false,
        "sub_basis": false,
        "tour_time_id": false,
        "pickup_id": false,
        "pickup_room_no": false,
        "drop_off_id": false,
        "tour_date": false,
        "start_date": false,
        "end_date": false,
        "pax_first_name": false,
        "pax_last_name": false,
        "pax_email": false,
        "no_pax_adults": false,
        "no_pax_child": false,
        "no_pax_infant": false,
        "no_pax_foc": false,
        "no_pax_user_defined": false,
        "general_comment": false,
        "booking_confirmed": false,
        "payment_option": false,
        "card_name": false,
        "card_pan": false,
        "card_vn": false,
        "card_type_id": false,
        "card_expiry_month": false,
        "card_expiry_year": false,
        "confirmation_no": false,
        "reason": false,
        "query": false,
        "add_query_btn": false,
        "del_query_btn": false,
        "voucher_number": false

    };

    if (method_name == 'readHosts' || method_name == 'readCurrentLogin') {
        //blank because the array does not change
    }

    else if ((method_name == 'readHostDetails') || (method_name == 'readPaymentOptions') || (method_name == 'readTours')
        || (method_name == 'readPaxTypes') || (method_name == 'readCreditStatus') || (method_name == 'readSources')) {
        methodDict.host_id = true;
        required_dict.host_id = true;
    }
    else if ((method_name == 'readTourDetails') || (method_name == 'readTourBases') || (method_name == 'readTourTimes')
        || (method_name == 'readTourWebDetails')) {
        methodDict.host_id = true;
        methodDict.tour_code = true;

        required_dict.host_id = true;
        required_dict.tour_code = true;
    }
    else if (method_name == 'readTourPickup') {
        methodDict.host_id = true;
        methodDict.tour_code = true;
        methodDict.basis = true;
        methodDict.tour_time_id = true;
        methodDict.pickup_id = true;

        required_dict.host_id = true;
        required_dict.tour_code = true;
        required_dict.tour_time_id = true;
        required_dict.pickup_id = true;
    }
    else if (method_name == 'readTourPickups') {
        methodDict.host_id = true;
        methodDict.tour_code = true;
        methodDict.basis = true;
        methodDict.tour_time_id = true;
        methodDict.tour_date = true;

        required_dict.host_id = true;
        required_dict.tour_code = true;
        required_dict.basis = true;
        required_dict.tour_time_id = true;
        required_dict.tour_date = true;
    }
    else if (method_name == 'readTourPrices') {
        methodDict.host_id = true;
        methodDict.tour_code = true;
        methodDict.basis = true;
        methodDict.sub_basis = true;
        methodDict.tour_time_id = true;
        methodDict.pickup_id = true;
        methodDict.drop_off_id = true;
        methodDict.tour_date = true;

        required_dict.host_id = true;
        required_dict.tour_code = true;
        required_dict.basis = true;
        required_dict.sub_basis = true;
        required_dict.tour_time_id = true;
        required_dict.tour_date = true;
    } else if (method_name == 'readTourPricesRange') {
        methodDict.host_id = true;
        methodDict.tour_code = true;
        methodDict.basis = true;
        methodDict.sub_basis = true;
        methodDict.tour_time_id = true;
        methodDict.pickup_id = true;
        methodDict.start_date = true;
        methodDict.end_date = true;
        methodDict.query = true;
        methodDict.add_query_btn = true;
        methodDict.del_query_btn = true;

        required_dict.query = true;
    }
    else if (method_name == 'readTourAvailability') {
        methodDict.host_id = true;
        methodDict.tour_code = true;
        methodDict.basis = true;
        methodDict.sub_basis = true;
        methodDict.tour_time_id = true;
        methodDict.tour_date = true;

        required_dict.host_id = true;
        required_dict.tour_code = true;
        required_dict.basis = true;
        required_dict.sub_basis = true;
        required_dict.tour_time_id = true;
        required_dict.tour_date = true;
    }
    else if (method_name == 'readTourAvailabilityRange') {
        methodDict.host_id = true;
        methodDict.tour_code = true;
        methodDict.basis = true;
        methodDict.sub_basis = true;
        methodDict.tour_time_id = true;
        methodDict.start_date = true;
        methodDict.end_date = true;
        methodDict.query = true;
        methodDict.add_query_btn = true;
        methodDict.del_query_btn = true;

        required_dict.query = true;
    }
    else if (method_name === 'checkReservation' || method_name === 'checkReservationAndPrices') {
        methodDict = {
            "host_id": true,
            "tour_code": true,
            "basis": true,
            "sub_basis": true,
            "tour_time_id": true,
            "pickup_id": true,
            "pickup_room_no": true,
            "drop_off_id": false,
            "tour_date": true,
            "start_date": false,
            "end_date": false,
            "pax_first_name": true,
            "pax_last_name": true,
            "pax_email": true,
            "no_pax_adults": true,
            "no_pax_child": true,
            "no_pax_infant": true,
            "no_pax_foc": true,
            "no_pax_user_defined": true,
            "general_comment": true,
            "booking_confirmed": true,
            "payment_option": true,
            "card_name": false,
            "card_pan": false,
            "card_vn": false,
            "card_type_id": false,
            "card_expiry_month": false,
            "card_expiry_year": false,
            "confirmation_no": false,
            "reason": false,
            "query": false,
            "add_query_btn": false,
            "del_query_btn": false,
            "voucher_number": false
        };

        required_dict.host_id = true;
        required_dict.tour_code = true;
        required_dict.basis = true;
        required_dict.sub_basis = true;
        required_dict.tour_time_id = true;
        required_dict.tour_date = true;
        required_dict.pax_first_name = true;
        required_dict.pax_last_name = true;
    }

    else if (method_name == 'writeReservation') {
        methodDict = {
            "host_id": true,
            "tour_code": true,
            "basis": true,
            "sub_basis": true,
            "tour_time_id": true,
            "pickup_id": true,
            "pickup_room_no": true,
            "drop_off_id": true,
            "tour_date": true,
            "start_date": false,
            "end_date": false,
            "pax_first_name": true,
            "pax_last_name": true,
            "pax_email": true,
            "no_pax_adults": true,
            "no_pax_child": true,
            "no_pax_infant": true,
            "no_pax_foc": true,
            "no_pax_user_defined": true,
            "general_comment": true,
            "booking_confirmed": true,
            "payment_option": true,
            "card_name": true,
            "card_pan": true,
            "card_vn": true,
            "card_type_id": true,
            "card_expiry_month": true,
            "card_expiry_year": true,
            "confirmation_no": false,
            "reason": false,
            "query": false,
            "add_query_btn": false,
            "del_query_btn": false,
            "voucher_number": true
        };
        required_dict.host_id = true;
        required_dict.tour_code = true;
        required_dict.basis = true;
        required_dict.sub_basis = true;
        required_dict.tour_time_id = true;
        required_dict.tour_date = true;
        required_dict.pax_first_name = true;
        required_dict.pax_last_name = true;
    }
    else if (method_name === "writeCancellation") {
        methodDict.host_id = true;
        methodDict.confirmation_no = true;
        methodDict.reason = true;

        required_dict.host_id = true;
        required_dict.confirmation_no = true;
        required_dict.reason = true;
    }


    for (var key in methodDict) {
        var id = $("#" + key);
        if (methodDict[key]) {
            id.show();
            id.attr("required", true);
            $("#" + key + "_label").show();
        } else {
            id.hide();
            id.removeAttr('required');
            $("#" + key + "_label").hide();
        }
    }

    for (var key in required_dict) {
        var id = $("#" + key);
        if (required_dict[key]) {
            id.attr("required", true);
        } else {
            id.removeAttr('required');
        }
    }
}

function open_switch_user_modal() {
    var switch_user_modal = document.getElementById('switch_user_modal');

    switch_user_modal.style.display = "block";
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[1];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        switch_user_modal.style.display = "none";
    };

    //When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == switch_user_modal) {
            switch_user_modal.style.display = "none";
        }
    }
}