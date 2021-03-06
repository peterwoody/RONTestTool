from django.shortcuts import render
from django.http import JsonResponse
import ron_api, datetime, xmlrpclib
from xml.parsers.expat import ExpatError


def test_tool(request):
    switch_server_button = request.POST.get('switch_server_button')

    not_switch_server_button = 'error'

    if switch_server_button == 'live':
        not_switch_server_button = 'Live'
    else:
        not_switch_server_button = 'Training'

    submit_value = request.POST.get('submit')

    server_url = request.POST.get('server_url')
    if submit_value == 'switch_server':

        if request.POST.get('switch_server_button') == 'Live':
            switch_server_button = 'Training'
            not_switch_server_button = 'Live'
            server_url = server_url.replace('live', 'train')

        else:
            switch_server_button = 'Live'
            not_switch_server_button = 'Training'

            server_url = server_url.replace("train", "live")

    elif submit_value == 'login':
        username = request.POST.get('username')
        password = request.POST.get('password')
        server_config = request.POST.get('server_config')
        endpoint = request.POST.get('endpoint')

        url = "{0}/section/xmlrpc/server-ron.php?config={1}".format(endpoint, server_config)

        connection = ron_api.get_connection(username, password, url)

        if not connection.get('logic'):
            context = {
                'fault': connection.get('fault')
            }
            return render(request, "login_error.html", context)
        server_url = url + '&' + connection.get('session_id')

        if server_config == 'live':
            switch_server_button = 'Live'
            not_switch_server_button = 'Training'
        else:
            switch_server_button = 'Training'
            not_switch_server_button = 'Live'

    host_name = ron_api.get_hosts('strHostName', server_url)
    host_ids = ron_api.get_hosts('strHostID', server_url)
    current_login = ron_api.read_current_login(server_url)

    context = {
        "host_name": host_name,
        "host_id": host_ids,
        "switch_server_button": switch_server_button,
        "not_switch_server_button": not_switch_server_button,
        "server_url": server_url,
        "user_id": current_login['arrCurrentUser']['intID'],
        "user_first_name": current_login['arrCurrentUser']['strFirstName'],
        "user_last_name": current_login['arrCurrentUser']['strLastName']
    }
    response = render(request, "test_tool.html", context)
    response.set_cookie(key='PHPSESSID', value=connection['session_id'].replace('PHPSESSID=', ''))
    return response


def login(request):
    context = {

    }
    return render(request, "login.html", context)


def logout(request):
    return render(request, "login.html")


def login_error(request):
    context = {

    }
    return render(request, "login_error.html", context)


def generate_xml(request):
    method_name = request.POST.get('method_name')
    host_id = request.POST.get('host_id')
    tour_code = request.POST.get('tour_code')
    basis_id = request.POST.get('basis')
    sub_basis_id = request.POST.get('sub_basis')
    tour_time_id = request.POST.get('tour_time_id')
    pickup_id = request.POST.get('pickup_id')
    pickup_room_no = request.POST.get('pickup_room_no')
    drop_off_id = request.POST.get('drop_off_id')
    tour_date = request.POST.get('tour_date')
    pax_first_name = request.POST.get('pax_first_name')
    pax_last_name = request.POST.get('pax_last_name')
    pax_email = request.POST.get('pax_email')
    voucher_number = request.POST.get('voucher_number')
    no_pax_adults = request.POST.get('no_pax_adults')
    no_pax_child = request.POST.get('no_pax_child')
    no_pax_infant = request.POST.get('no_pax_infant')
    no_pax_foc = request.POST.get('no_pax_foc')
    no_pax_user_defined = request.POST.get('no_pax_user_defined')
    general_comment = request.POST.get('general_comment')
    booking_confirmed = request.POST.get('booking_confirmed')
    payment_option = request.POST.get('payment_option')
    card_name = request.POST.get('card_name')
    card_pan = request.POST.get('card_pan')
    card_vn = request.POST.get('card_vn')
    card_type_id = request.POST.get('card_type_id')
    card_expiry_month = request.POST.get('card_expiry_month')
    card_expiry_year = request.POST.get('card_expiry_year')
    confirmation_no = request.POST.get('confirmation_no')
    reason = request.POST.get('reason')
    query = request.POST.get('query')

    if method_name == 'readTours':
        params = (host_id,)

    elif method_name == 'readHosts':
        params = ("",)

    elif method_name == 'ping':
        params = ("",)

    elif method_name == 'readCurrentLogin':
        params = ("",)

    elif method_name == 'readHostDetails':
        params = (host_id,)

    elif method_name == 'readPaymentOptions':
        params = (host_id,)

    elif method_name == 'readPaxTypes':
        params = (host_id,)

    elif method_name == 'readSources':
        params = (host_id,)

    elif method_name == 'readCreditCardTypes':
        params = (host_id,)

    elif method_name == 'readCreditStatus':
        params = (host_id,)

    elif method_name == 'readTourDetails':
        params = (host_id, tour_code)

    elif method_name == 'readTourTimes':
        params = (host_id, tour_code)

    elif method_name == 'readTourBases':
        params = (host_id, tour_code)

    elif method_name == 'readTourWebDetails':
        params = (host_id, tour_code)

    elif method_name == 'readTourWebDetailsImages':
        params = (host_id, tour_code)

    elif method_name == 'readTourPickup':
        params = (host_id, tour_code, basis_id, tour_time_id, pickup_id)

    elif method_name == 'readTourPickups':
        try:
            tour_date = format_date(tour_date)
            params = (host_id, tour_code, tour_time_id, basis_id, tour_date)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'readTourCommissions':
        try:
            tour_date = format_date(tour_date)
            params = (host_id, tour_code, basis_id, sub_basis_id, tour_date, tour_time_id)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'readTourPrices':
        try:
            tour_date = format_date(tour_date)
            params = (host_id, tour_code, basis_id, sub_basis_id, tour_date, tour_time_id, pickup_id, drop_off_id)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'readTourPricesRange':
        try:
            params = (eval(query),)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'readTourAvailability':
        try:
            tour_date = format_date(tour_date)
            params = (host_id, tour_code, basis_id, sub_basis_id, tour_date, tour_time_id)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'readTourAvailabilityRange':
        try:
            params = (eval(query),)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'readReservationDetails':
        params = (host_id, confirmation_no,)

    elif method_name == 'checkReservation':
        try:
            tour_date = format_date(tour_date)
            reservation = {'strTourCode': tour_code, 'intBasisID': basis_id, 'intSubBasisID': sub_basis_id,
                           'dteTourDate': tour_date, 'intTourTimeID': tour_time_id, 'strPickupKey': pickup_id,
                           'strPickupRoomNo': pickup_room_no, 'strPaxFirstName': pax_first_name,
                           'strPaxLastName': pax_last_name, 'strPaxEmail': pax_email, 'intNoPax_Adults': no_pax_adults,
                           'intNoPax_Child': no_pax_child, 'intNoPax_Infant': no_pax_infant, 'intNoPax_FOC': no_pax_foc,
                           'intNoPax_UDef1': no_pax_user_defined, 'strGeneralComment': general_comment}

            payment = {'strPaymentOption': payment_option}

            params = (host_id, reservation, payment)

        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'checkReservationAndPrices':
        try:
            tour_date = format_date(tour_date)
            reservation = {'strTourCode': tour_code, 'intBasisID': basis_id, 'intSubBasisID': sub_basis_id,
                           'dteTourDate': tour_date, 'intTourTimeID': tour_time_id, 'strPickupKey': pickup_id,
                           'strPickupRoomNo': pickup_room_no, 'strPaxFirstName': pax_first_name,
                           'strPaxLastName': pax_last_name, 'strPaxEmail': pax_email, 'intNoPax_Adults': no_pax_adults,
                           'intNoPax_Child': no_pax_child, 'intNoPax_Infant': no_pax_infant, 'intNoPax_FOC': no_pax_foc,
                           'intNoPax_UDef1': no_pax_user_defined, 'strGeneralComment': general_comment}

            payment = {'strPaymentOption': payment_option}

            params = (host_id, reservation, payment)

        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'writeReservation':
        try:
            tour_date = format_date(tour_date)
            reservation = {'strTourCode': tour_code, 'intBasisID': basis_id, 'intSubBasisID': sub_basis_id,
                           'dteTourDate': tour_date, 'intTourTimeID': tour_time_id, 'strPickupKey': pickup_id,
                           'strPickupRoomNo': pickup_room_no, 'strPaxFirstName': pax_first_name,
                           'strPaxLastName': pax_last_name, 'strPaxEmail': pax_email, 'strVoucherNo': voucher_number,
                           'intNoPax_Adults': no_pax_adults,
                           'intNoPax_Child': no_pax_child, 'intNoPax_Infant': no_pax_infant, 'intNoPax_FOC': no_pax_foc,
                           'intNoPax_UDef1': no_pax_user_defined, 'strGeneralComment': general_comment}

            payment = {'strPaymentOption': payment_option}
            credit_card = {'strCardName': card_name, 'strCardPAN': card_pan, 'strCardVN': card_vn,
                           'strCardTypeID': card_type_id, 'intCardExpiryMonth': card_expiry_month,
                           'intCardExpiryYear': card_expiry_year}

            params = (host_id, booking_confirmed, reservation, payment, credit_card)

        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'writeCancellation':
        params = (host_id, confirmation_no, reason,)

    else:
        return JsonResponse({'fault': "Method not implemented yet."})

    method_response = False
    encoding = 'iso-8859-1'
    allow_none = True

    generated_xml = xmlrpclib.dumps(params, method_name, method_response, encoding, allow_none)

    response_data = {
        'generated_xml': generated_xml,
    }

    return JsonResponse(response_data)


def submit_xml(request):
    server_url = request.POST.get('server_url')
    xml = request.POST.get('xml')
    xml = xml.strip()

    xml_response = ron_api.raw_xml_request(server_url, xml)

    response_data = {
        'xml_response': xml_response[0],
        'table_response': xml_response[1],
    }

    return JsonResponse(response_data)


def get_location(request):
    host_id = request.POST.get('host_id')
    server_url = request.POST.get('server_url')
    location = ron_api.get_location(host_id, server_url)

    response_data = {
        'location': location,
    }

    return JsonResponse(response_data)


def get_tours(request):
    host_id = request.POST.get('id')
    server_url = request.POST.get('server_url')
    tours = ron_api.read_tours(host_id, server_url)

    response_data = {
        'tours': tours,
    }

    return JsonResponse(response_data)


def get_tour_bases(request):
    host_id = request.POST['host_id']
    tour_code = request.POST['tour_code']
    server_url = request.POST.get('server_url')

    tour_bases = ron_api.read_tour_bases(host_id, tour_code, server_url)

    response_data = {
        'tour_bases': tour_bases,
    }

    return JsonResponse(response_data)


def get_tour_times(request):
    host_id = request.POST['host_id']
    tour_code = request.POST['tour_code']
    server_url = request.POST.get('server_url')

    tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

    response_data = {
        'tour_times': tour_times,
    }

    return JsonResponse(response_data)


def get_tour_pickups(request):
    host_id = request.POST['host_id']
    tour_code = request.POST['tour_code']
    tour_time_id = request.POST['tour_time_id']
    tour_basis_id = request.POST['tour_basis_id']
    server_url = request.POST.get('server_url')

    tour_pickups = ron_api.read_tour_pickups(host_id, tour_code, tour_time_id, tour_basis_id, server_url)

    response_data = {
        'tour_pickups': tour_pickups,
    }

    return JsonResponse(response_data)


def write_reservation(request):
    server_url = request.POST.get('server_url')

    confirmation_number = ron_api.write_reservation(server_url)

    response_data = {
        'confirmation_number': confirmation_number,
    }

    return JsonResponse(response_data)


def get_all_host_info(request):
    parameters = request.POST['parameters']
    host_id = request.POST['parameters'].split('|')[0]
    host_ids_checkbox = request.POST['host_ids_checkbox'] == 'true'
    tour_names_checkbox = request.POST['tour_names_checkbox'] == 'true'
    tour_codes_checkbox = request.POST['tour_codes_checkbox'] == 'true'
    basis_name_checkbox = request.POST['basis_name_checkbox'] == 'true'
    basis_checkbox = request.POST['basis_checkbox'] == 'true'
    sub_basis_name_checkbox = request.POST['sub_basis_name_checkbox'] == 'true'
    sub_basis_checkbox = request.POST['sub_basis_checkbox'] == 'true'
    time_checkbox = request.POST['time_checkbox'] == 'true'
    time_ids_checkbox = request.POST['time_ids_checkbox'] == 'true'
    pickup_keys_checkbox = request.POST['pickup_keys_checkbox'] == 'true'
    server_url = request.POST.get('server_url')
    data_level = request.POST['data_level']
    csv_separator = request.POST.get('csv_separator')

    csv_content = ""

    if host_ids_checkbox:
        csv_content += "Host" + csv_separator
    if tour_names_checkbox:
        csv_content += "Tour Name" + csv_separator
    if tour_codes_checkbox:
        csv_content += "Tour Code" + csv_separator
    if basis_name_checkbox:
        csv_content += "Basis Name" + csv_separator
    if basis_checkbox:
        csv_content += "Basis" + csv_separator
    if sub_basis_name_checkbox:
        csv_content += "Sub Basis Name" + csv_separator
    if sub_basis_checkbox:
        csv_content += "Sub Basis" + csv_separator
    if time_checkbox:
        csv_content += "Time" + csv_separator
    if time_ids_checkbox:
        csv_content += "Time ID" + csv_separator
    if pickup_keys_checkbox:
        csv_content += "Pickup Key\n"
    else:
        csv_content += "\n"

    if data_level == "1":
        tours = ron_api.read_tours(host_id, server_url)
        if pickup_keys_checkbox:
            for tour_codes in tours:
                tour_bases = ron_api.read_tour_bases(host_id, tour_codes['strTourCode'], server_url)

                for tour_base in tour_bases:

                    tour_times = ron_api.read_tour_times(host_id, tour_codes['strTourCode'], server_url)

                    for tour_time in tour_times:
                        basis_name = tour_base['strBasisDesc']
                        basis_id = tour_base['intBasisID']
                        sub_basis_name = tour_base['strSubBasisDesc']
                        sub_basis_id = tour_base['intSubBasisID']
                        time = tour_time['dteTourTime']['iso8601']
                        time_id = tour_time['intTourTimeID']
                        tour_pickups = ron_api.read_tour_pickups(host_id, tour_codes['strTourCode'], time_id, basis_id,
                                                                 server_url)

                        for tour_pickup in tour_pickups:
                            pickup_key = tour_pickup['strPickupKey']

                            if host_ids_checkbox:
                                csv_host_id = str(host_id) + csv_separator
                            else:
                                csv_host_id = ""
                            if tour_names_checkbox:
                                csv_tour_name = str(tour_codes['strTourName']).replace(',', '') + csv_separator
                            else:
                                csv_tour_name = ""
                            if tour_codes_checkbox:
                                csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                            else:
                                csv_tour_code = ""
                            if basis_name_checkbox:
                                csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                            else:
                                csv_basis_name = ""
                            if basis_checkbox:
                                csv_basis_id = str(basis_id) + csv_separator
                            else:
                                csv_basis_id = ""
                            if sub_basis_name_checkbox:
                                csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                            else:
                                csv_sub_basis_name = ""
                            if sub_basis_checkbox:
                                csv_sub_basis_id = str(sub_basis_id) + csv_separator
                            else:
                                csv_sub_basis_id = ""
                            if time_checkbox:
                                csv_time = str(time) + csv_separator
                            else:
                                csv_time = ""
                            if time_ids_checkbox:
                                csv_time_id = str(time_id) + csv_separator
                            else:
                                csv_time_id = ""

                            csv_content += csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + \
                                csv_basis_id + csv_sub_basis_name + csv_sub_basis_id + csv_time + \
                                csv_time_id + str(pickup_key) + "\n"

        elif time_checkbox | time_ids_checkbox:
            for tour_codes in tours:
                tour_bases = ron_api.read_tour_bases(host_id, tour_codes['strTourCode'], server_url)

                for tour_base in tour_bases:

                    tour_times = ron_api.read_tour_times(host_id, tour_codes['strTourCode'], server_url)

                    for tour_time in tour_times:
                        basis_name = tour_base['strBasisDesc']
                        basis_id = tour_base['intBasisID']
                        sub_basis_name = tour_base['strSubBasisDesc']
                        sub_basis_id = tour_base['intSubBasisID']
                        time = tour_time['dteTourTime']['iso8601']
                        time_id = tour_time['intTourTimeID']

                        if host_ids_checkbox:
                            csv_host_id = str(host_id) + csv_separator
                        else:
                            csv_host_id = ""
                        if tour_names_checkbox:
                            csv_tour_name = str(tour_codes['strTourName']).replace(',', '') + csv_separator
                        else:
                            csv_tour_name = ""
                        if tour_codes_checkbox:
                            csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                        else:
                            csv_tour_code = ""
                        if basis_name_checkbox:
                            csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                        else:
                            csv_basis_name = ""
                        if basis_checkbox:
                            csv_basis_id = str(basis_id) + csv_separator
                        else:
                            csv_basis_id = ""
                        if sub_basis_name_checkbox:
                            csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                        else:
                            csv_sub_basis_name = ""
                        if sub_basis_checkbox:
                            csv_sub_basis_id = str(sub_basis_id) + csv_separator
                        else:
                            csv_sub_basis_id = ""
                        if time_checkbox:
                            csv_time = str(time) + csv_separator
                        else:
                            csv_time = ""
                        if time_ids_checkbox:
                            csv_time_id = str(time_id) + csv_separator
                        else:
                            csv_time_id = ""

                        csv_content += (
                                           csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id + csv_sub_basis_name + csv_sub_basis_id + csv_time + csv_time_id).rstrip(
                            csv_separator) + "\n"

        elif basis_checkbox | basis_name_checkbox | sub_basis_checkbox | sub_basis_name_checkbox:
            for tour_codes in tours:
                tour_bases = ron_api.read_tour_bases(host_id, tour_codes['strTourCode'], server_url)

                for tour_base in tour_bases:
                    basis_name = tour_base['strBasisDesc']
                    basis_id = tour_base['intBasisID']
                    sub_basis_name = tour_base['strSubBasisDesc']
                    sub_basis_id = tour_base['intSubBasisID']

                    if host_ids_checkbox:
                        csv_host_id = str(host_id) + csv_separator
                    else:
                        csv_host_id = ""
                    if tour_names_checkbox:
                        csv_tour_name = str(tour_codes['strTourName']).replace(',', '') + csv_separator
                    else:
                        csv_tour_name = ""
                    if tour_codes_checkbox:
                        csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                    else:
                        csv_tour_code = ""
                    if basis_name_checkbox:
                        csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                    else:
                        csv_basis_name = ""
                    if basis_checkbox:
                        csv_basis_id = str(basis_id) + csv_separator
                    else:
                        csv_basis_id = ""
                    if sub_basis_name_checkbox:
                        csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                    else:
                        csv_sub_basis_name = ""
                    if sub_basis_checkbox:
                        csv_sub_basis_id = str(sub_basis_id) + csv_separator
                    else:
                        csv_sub_basis_id = ""

                    csv_content += (
                                       csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id + csv_sub_basis_name + csv_sub_basis_id).rstrip(
                        csv_separator) + "\n"
        elif tour_codes_checkbox | tour_names_checkbox:
            for tour_codes in tours:

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_names_checkbox:
                    csv_tour_name = str(tour_codes['strTourName']).replace(',', '') + csv_separator
                else:
                    csv_tour_name = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                else:
                    csv_tour_code = ""

                csv_content += (csv_host_id + csv_tour_name + csv_tour_code).rstrip(csv_separator) + "\n"
        elif host_ids_checkbox:
            csv_content += host_id + "\n"
    elif data_level == "2":
        tour_name = parameters.split('|')[1]
        tour_code = parameters.split('|')[2]
        if pickup_keys_checkbox:
            tour_bases = ron_api.read_tour_bases(host_id, tour_code, server_url)

            for tour_base in tour_bases:

                tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

                for tour_time in tour_times:
                    basis_name = tour_base['strBasisDesc']
                    basis_id = tour_base['intBasisID']
                    sub_basis_name = tour_base['strSubBasisDesc']
                    sub_basis_id = tour_base['intSubBasisID']
                    time = tour_time['dteTourTime']['iso8601']
                    time_id = tour_time['intTourTimeID']
                    tour_pickups = ron_api.read_tour_pickups(host_id, tour_code, time_id, basis_id,
                                                             server_url)

                    for tour_pickup in tour_pickups:
                        pickup_key = tour_pickup['strPickupKey']

                        if host_ids_checkbox:
                            csv_host_id = str(host_id) + csv_separator
                        else:
                            csv_host_id = ""
                        if tour_names_checkbox:
                            csv_tour_name = str(tour_name).replace(',', '') + csv_separator
                        else:
                            csv_tour_name = ""
                        if tour_codes_checkbox:
                            csv_tour_code = str(tour_code) + csv_separator
                        else:
                            csv_tour_code = ""
                        if basis_name_checkbox:
                            csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                        else:
                            csv_basis_name = ""
                        if basis_checkbox:
                            csv_basis_id = str(basis_id) + csv_separator
                        else:
                            csv_basis_id = ""
                        if sub_basis_name_checkbox:
                            csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                        else:
                            csv_sub_basis_name = ""
                        if sub_basis_checkbox:
                            csv_sub_basis_id = str(sub_basis_id) + csv_separator
                        else:
                            csv_sub_basis_id = ""
                        if time_checkbox:
                            csv_time = str(time) + csv_separator
                        else:
                            csv_time = ""
                        if time_ids_checkbox:
                            csv_time_id = str(time_id) + csv_separator
                        else:
                            csv_time_id = ""

                        csv_content += csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id + csv_sub_basis_name + csv_sub_basis_id + csv_time + csv_time_id + str(
                            pickup_key) + "\n"

        elif time_checkbox | time_ids_checkbox:
            tour_bases = ron_api.read_tour_bases(host_id, tour_code, server_url)

            for tour_base in tour_bases:

                tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

                for tour_time in tour_times:
                    basis_name = tour_base['strBasisDesc']
                    basis_id = tour_base['intBasisID']
                    sub_basis_name = tour_base['strSubBasisDesc']
                    sub_basis_id = tour_base['intSubBasisID']
                    time = tour_time['dteTourTime']['iso8601']
                    time_id = tour_time['intTourTimeID']

                    if host_ids_checkbox:
                        csv_host_id = str(host_id) + csv_separator
                    else:
                        csv_host_id = ""
                    if tour_names_checkbox:
                        csv_tour_name = str(tour_name).replace(',', '') + csv_separator
                    else:
                        csv_tour_name = ""
                    if tour_codes_checkbox:
                        csv_tour_code = str(tour_code) + csv_separator
                    else:
                        csv_tour_code = ""
                    if basis_name_checkbox:
                        csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                    else:
                        csv_basis_name = ""
                    if basis_checkbox:
                        csv_basis_id = str(basis_id) + csv_separator
                    else:
                        csv_basis_id = ""
                    if sub_basis_name_checkbox:
                        csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                    else:
                        csv_sub_basis_name = ""
                    if sub_basis_checkbox:
                        csv_sub_basis_id = str(sub_basis_id) + csv_separator
                    else:
                        csv_sub_basis_id = ""
                    if time_checkbox:
                        csv_time = str(time) + csv_separator
                    else:
                        csv_time = ""
                    if time_ids_checkbox:
                        csv_time_id = str(time_id) + csv_separator
                    else:
                        csv_time_id = ""

                    csv_content += (
                                       csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id + csv_sub_basis_name + csv_sub_basis_id + csv_time + csv_time_id).rstrip(
                        csv_separator) + "\n"

        elif basis_checkbox | sub_basis_checkbox | basis_name_checkbox | sub_basis_name_checkbox:
            tour_bases = ron_api.read_tour_bases(host_id, tour_code, server_url)

            for tour_base in tour_bases:
                basis_name = tour_base['strBasisDesc']
                basis_id = tour_base['intBasisID']
                sub_basis_name = tour_base['strSubBasisDesc']
                sub_basis_id = tour_base['intSubBasisID']

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_names_checkbox:
                    csv_tour_name = str(tour_name).replace(',', '') + csv_separator
                else:
                    csv_tour_name = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_code) + csv_separator
                else:
                    csv_tour_code = ""
                if basis_name_checkbox:
                    csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                else:
                    csv_basis_name = ""
                if basis_checkbox:
                    csv_basis_id = str(basis_id) + csv_separator
                else:
                    csv_basis_id = ""
                if sub_basis_name_checkbox:
                    csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                else:
                    csv_sub_basis_name = ""
                if sub_basis_checkbox:
                    csv_sub_basis_id = str(sub_basis_id) + csv_separator
                else:
                    csv_sub_basis_id = ""

                csv_content += (
                                   csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id + csv_sub_basis_name + csv_sub_basis_id).rstrip(
                    csv_separator) + "\n"

        elif host_ids_checkbox | tour_codes_checkbox | tour_names_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_names_checkbox:
                csv_tour_name = str(tour_name).replace(',', '') + csv_separator
            else:
                csv_tour_name = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""

            csv_content += (csv_host_id + csv_tour_name + csv_tour_code).rstrip(csv_separator) + "\n"

    elif data_level == "3":
        tour_name = parameters.split('|')[1]
        tour_code = parameters.split('|')[2]
        basis_name = parameters.split('|')[3]
        basis_id = parameters.split('|')[4]
        sub_basis_name = parameters.split('|')[5]
        sub_basis_id = parameters.split('|')[6]

        if pickup_keys_checkbox:
            tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

            for tour_time in tour_times:
                time = tour_time['dteTourTime']['iso8601']
                time_id = tour_time['intTourTimeID']
                tour_pickups = ron_api.read_tour_pickups(host_id, tour_code, time_id, basis_id,
                                                         server_url)

                for tour_pickup in tour_pickups:
                    pickup_key = tour_pickup['strPickupKey']

                    if host_ids_checkbox:
                        csv_host_id = str(host_id) + csv_separator
                    else:
                        csv_host_id = ""
                    if tour_names_checkbox:
                        csv_tour_name = str(tour_name).replace(',', '') + csv_separator
                    else:
                        csv_tour_name = ""
                    if tour_codes_checkbox:
                        csv_tour_code = str(tour_code) + csv_separator
                    else:
                        csv_tour_code = ""
                    if basis_name_checkbox:
                        csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                    else:
                        csv_basis_name = ""
                    if basis_checkbox:
                        csv_basis_id = str(basis_id) + csv_separator
                    else:
                        csv_basis_id = ""
                    if sub_basis_name_checkbox:
                        csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                    else:
                        csv_sub_basis_name = ""
                    if sub_basis_checkbox:
                        csv_sub_basis_id = str(sub_basis_id) + csv_separator
                    else:
                        csv_sub_basis_id = ""
                    if time_checkbox:
                        csv_time = str(time) + csv_separator
                    else:
                        csv_time = ""
                    if time_ids_checkbox:
                        csv_time_id = str(time_id) + csv_separator
                    else:
                        csv_time_id = ""

                    csv_content += (csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id +
                                    csv_sub_basis_name + csv_sub_basis_id + csv_time + csv_time_id +
                                    str(pickup_key)).rstrip(csv_separator) + "\n"

        elif time_ids_checkbox:
            tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

            for tour_time in tour_times:
                time = tour_time['dteTourTime']['iso8601']
                time_id = tour_time['intTourTimeID']

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_names_checkbox:
                    csv_tour_name = str(tour_name).replace(',', '') + csv_separator
                else:
                    csv_tour_name = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_code) + csv_separator
                else:
                    csv_tour_code = ""
                if basis_name_checkbox:
                    csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                else:
                    csv_basis_name = ""
                if basis_checkbox:
                    csv_basis_id = str(basis_id) + csv_separator
                else:
                    csv_basis_id = ""
                if sub_basis_name_checkbox:
                    csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                else:
                    csv_sub_basis_name = ""
                if sub_basis_checkbox:
                    csv_sub_basis_id = str(sub_basis_id) + csv_separator
                else:
                    csv_sub_basis_id = ""
                if time_checkbox:
                    csv_time = str(time) + csv_separator
                else:
                    csv_time = ""
                if time_ids_checkbox:
                    csv_time_id = str(time_id) + csv_separator
                else:
                    csv_time_id = ""

                csv_content += (csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id +
                                csv_sub_basis_name + csv_sub_basis_id + csv_time + csv_time_id).rstrip(csv_separator) + "\n"

        elif host_ids_checkbox | tour_names_checkbox | tour_codes_checkbox | basis_name_checkbox | basis_checkbox | \
                sub_basis_name_checkbox | sub_basis_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_names_checkbox:
                csv_tour_name = str(tour_name).replace(',', '') + csv_separator
            else:
                csv_tour_name = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_name_checkbox:
                csv_basis_name = str(basis_name).replace(',', '') + csv_separator
            else:
                csv_basis_name = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_name_checkbox:
                csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
            else:
                csv_sub_basis_name = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""

            csv_content += (csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id +
                            csv_sub_basis_name + csv_sub_basis_id).rstrip(csv_separator) + "\n"

    elif data_level == "4":
        tour_name = parameters.split('|')[1]
        tour_code = parameters.split('|')[2]
        basis_name = parameters.split('|')[3]
        basis_id = parameters.split('|')[4]
        sub_basis_name = parameters.split('|')[5]
        sub_basis_id = parameters.split('|')[6]
        time = parameters.split('|')[7]
        time_id = parameters.split('|')[8]

        if pickup_keys_checkbox:
            tour_pickups = ron_api.read_tour_pickups(host_id, tour_code, time_id, basis_id,
                                                     server_url)

            for tour_pickup in tour_pickups:
                pickup_key = tour_pickup['strPickupKey']

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_names_checkbox:
                    csv_tour_name = str(tour_name).replace(',', '') + csv_separator
                else:
                    csv_tour_name = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_code) + csv_separator
                else:
                    csv_tour_code = ""
                if basis_name_checkbox:
                    csv_basis_name = str(basis_name).replace(',', '') + csv_separator
                else:
                    csv_basis_name = ""
                if basis_checkbox:
                    csv_basis_id = str(basis_id) + csv_separator
                else:
                    csv_basis_id = ""
                if sub_basis_name_checkbox:
                    csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
                else:
                    csv_sub_basis_name = ""
                if sub_basis_checkbox:
                    csv_sub_basis_id = str(sub_basis_id) + csv_separator
                else:
                    csv_sub_basis_id = ""
                if time_checkbox:
                    csv_time = str(time) + csv_separator
                else:
                    csv_time = ""
                if time_ids_checkbox:
                    csv_time_id = str(time_id) + csv_separator
                else:
                    csv_time_id = ""

                csv_content += (csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id +
                                csv_sub_basis_name + csv_sub_basis_id + csv_time + csv_time_id +
                                str(pickup_key)).rstrip(csv_separator) + "\n"
        elif host_ids_checkbox | tour_names_checkbox | tour_codes_checkbox | basis_name_checkbox | basis_checkbox | \
                sub_basis_name_checkbox | sub_basis_checkbox | time_ids_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_names_checkbox:
                csv_tour_name = str(tour_name).replace(',', '') + csv_separator
            else:
                csv_tour_name = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_name_checkbox:
                csv_basis_name = str(basis_name).replace(',', '') + csv_separator
            else:
                csv_basis_name = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_name_checkbox:
                csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
            else:
                csv_sub_basis_name = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""
            if time_checkbox:
                csv_time = str(time) + csv_separator
            else:
                csv_time = ""
            if time_ids_checkbox:
                csv_time_id = str(time_id) + csv_separator
            else:
                csv_time_id = ""

            csv_content += (csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id +
                            csv_sub_basis_name + csv_sub_basis_id + csv_time + csv_time_id).rstrip(csv_separator) + "\n"

    elif data_level == "5":
        tour_name = parameters.split('|')[1]
        tour_code = parameters.split('|')[2]
        basis_name = parameters.split('|')[3]
        basis_id = parameters.split('|')[4]
        sub_basis_name = parameters.split('|')[5]
        sub_basis_id = parameters.split('|')[6]
        time = parameters.split('|')[7]
        time_id = parameters.split('|')[8]
        pickup_key = parameters.split('|')[9]

        if host_ids_checkbox:
            csv_host_id = str(host_id) + csv_separator
        else:
            csv_host_id = ""
        if tour_names_checkbox:
            csv_tour_name = str(tour_name).replace(',', '') + csv_separator
        else:
            csv_tour_name = ""
        if tour_codes_checkbox:
            csv_tour_code = str(tour_code) + csv_separator
        else:
            csv_tour_code = ""
        if basis_name_checkbox:
            csv_basis_name = str(basis_name).replace(',', '') + csv_separator
        else:
            csv_basis_name = ""
        if basis_checkbox:
            csv_basis_id = str(basis_id) + csv_separator
        else:
            csv_basis_id = ""
        if sub_basis_name_checkbox:
            csv_sub_basis_name = str(sub_basis_name).replace(',', '') + csv_separator
        else:
            csv_sub_basis_name = ""
        if sub_basis_checkbox:
            csv_sub_basis_id = str(sub_basis_id) + csv_separator
        else:
            csv_sub_basis_id = ""
        if time_checkbox:
            csv_time = str(time) + csv_separator
        else:
            csv_time = ""
        if time_ids_checkbox:
            csv_time_id = str(time_id) + csv_separator
        else:
            csv_time_id = ""
        if pickup_keys_checkbox:
            csv_pickup_key = str(pickup_key)
        else:
            csv_pickup_key = ""

        csv_content += (csv_host_id + csv_tour_name + csv_tour_code + csv_basis_name + csv_basis_id +
                        csv_sub_basis_name + csv_sub_basis_id + csv_time + csv_time_id +
                        csv_pickup_key).rstrip(csv_separator) + "\n"

    response_data = {
        'csv_content': csv_content,
    }

    return JsonResponse(response_data)


def fill_form_xml(request):
    xml = request.POST.get("xml")
    xml = xml.strip()

    try:
        loaded_xml = xmlrpclib.loads(xml)
    except ExpatError as error:
        print("Error:", error.message)
        loaded_xml = "error"

    response_data = {
        'loaded_xml': loaded_xml
    }
    return JsonResponse(response_data)


def format_date(tour_date):
    tour_date = tour_date.split('-')
    tour_date = datetime.datetime(int(tour_date[0]), int(tour_date[1]), int(tour_date[2]))
    tour_date = tour_date.strftime('%d-%b-%Y')
    return tour_date
