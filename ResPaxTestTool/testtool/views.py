from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
import ron_api, datetime, xmlrpclib


def test_tool(request):
    switch_server_button = request.POST.get('switch_server_button')

    not_switch_server_button = 'error'

    if switch_server_button == 'live':
        not_switch_server_button = 'Live'
    else:
        not_switch_server_button = 'Training'


    submit_value = request.POST.get('submit')

    if submit_value == 'switch_server':
        server_url = request.POST.get('server_url')

        print(request.POST.get('switch_server_button'))
        if request.POST.get('switch_server_button') == 'Live':
            switch_server_button = 'Training'
            not_switch_server_button = 'Live'
            server_url = server_url.replace('live', 'train')

        else:
            switch_server_button = 'Live'
            not_switch_server_button = 'Training'
            print(server_url)
            server_url = server_url.replace("train", "live")
            print(server_url)

            # ron_api.switch_server(server_url)

    elif submit_value == 'login':
        username = request.POST.get('username')
        password = request.POST.get('password')
        server_config = request.POST.get('server_config')
        url = "https://ron.respax.com.au:30443/section/xmlrpc/server-ron.php?config="

        connection = ron_api.get_connection(username, password, server_config)

        if not connection.get('logic'):
            context = {
                'fault': connection.get('fault')
            }
            return render(request, "login_error.html", context)
        server_url = url + server_config + '&' + connection.get('session_id')

        if server_config == 'live':
            switch_server_button = 'Live'
            not_switch_server_button = 'Training'
        else:
            switch_server_button = 'Training'
            not_switch_server_button = 'Live'


    host_name = ron_api.get_hosts('strHostName', server_url)
    host_id = ron_api.get_hosts('strHostID', server_url)

    context = {
        "host_name": host_name,
        "host_id": host_id,
        "switch_server_button": switch_server_button,
        "not_switch_server_button": not_switch_server_button,
        "server_url": server_url
    }
    return render(request, "test_tool.html", context)


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
    print(request.POST.get('method_name'))
    method_name = request.POST.get('method_name')
    host_id = request.POST.get('host_id')
    tour_code = request.POST.get('tour_code')
    basis_id = request.POST.get('tour_basis_id')
    sub_basis_id = request.POST.get('tour_sub_basis_id')
    tour_time_id = request.POST.get('tour_time_id')
    pickup_id = request.POST.get('tour_pickup_id')
    drop_off_id = request.POST.get('tour_drop_off_id')

    if method_name == 'readTours':
        params = (host_id,)

    elif method_name == 'readHosts':
        params = ("",)

    elif method_name == 'readHostDetails':
        params = (host_id,)

    elif method_name == 'readTourDetails':
        params = (host_id, tour_code)

    elif method_name == 'readTourTimes':
        params = (host_id, tour_code)

    elif method_name == 'readTourBases':
        params = (host_id, tour_code)

    elif method_name == 'readTourPickups':
        try:
            tour_date = request.POST['tour_date'].split('-')
            tour_date = datetime.datetime(int(tour_date[0]), int(tour_date[1]), int(tour_date[2]))
            tour_date = tour_date.strftime('%d-%b-%Y')
            params = (host_id, tour_code, tour_time_id, basis_id, tour_date)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'readTourPrices':
        try:
            tour_date = request.POST['tour_date'].split('-')
            tour_date = datetime.datetime(int(tour_date[0]), int(tour_date[1]), int(tour_date[2]))
            tour_date = tour_date.strftime('%d-%b-%Y')
            params = (host_id, tour_code, basis_id, sub_basis_id, tour_date, tour_time_id, pickup_id, drop_off_id)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

    elif method_name == 'readTourPricesRange':
        product_list = []
        #
        # print(connection.readTourPricesRange(product_list))

    elif method_name == 'readTourAvailability':
        try:
            tour_date = request.POST['tour_date'].split('-')
            tour_date = datetime.datetime(int(tour_date[0]), int(tour_date[1]), int(tour_date[2]))
            tour_date = tour_date.strftime('%d-%b-%Y')
            params = (host_id, tour_code, basis_id, sub_basis_id, tour_date, tour_time_id)
        except ValueError:
            fault = "Please enter a date"
            return JsonResponse({"fault": fault})

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

    xml_response = ron_api.raw_xml_request(server_url, xml)

    response_data = {
        'xml_response': xml_response[0],
        'table_response': xml_response[1],
    }

    return JsonResponse(response_data)


def test_tool_form(request):
    print(request.POST.get('submit'))
    tour_date = request.POST['tour_date'].split('-')
    tour_date = datetime.datetime(int(tour_date[0]), int(tour_date[1]), int(tour_date[2]))

    tour_date = tour_date.strftime('%d-%b-%Y')
    print(tour_date)
    # checkbox = request.POST.get('checkbox').split(',')
    #
    # host_id = checkbox[0]
    # tour_code = checkbox[1]
    # basis_id = checkbox[2]
    # sub_basis_id = checkbox[3]
    # tour_time_id = checkbox[4]
    #
    host_id = request.POST['host_id']
    tour_code = request.POST['tour_code']
    basis_id = request.POST['tour_basis_id']
    sub_basis_id = request.POST['tour_sub_basis_id']
    tour_time_id = request.POST['tour_time_id']

    availability = ron_api.connection.readTourAvailability(host_id, tour_code, basis_id, sub_basis_id, tour_date,
                                                           tour_time_id)

    response_data = {
        'availability': availability,
    }

    return JsonResponse(response_data)


def get_tours(request):
    host_id = request.POST.get('id')
    server_url = request.POST.get('server_url')
    print(server_url)
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


def get_all_host_info(request):
    parameters = request.POST['parameters']
    host_id = request.POST['parameters'].split(',')[0]
    host_ids_checkbox = request.POST['host_ids_checkbox'] == 'true'
    tour_codes_checkbox = request.POST['tour_codes_checkbox'] == 'true'
    basis_checkbox = request.POST['basis_checkbox'] == 'true'
    sub_basis_checkbox = request.POST['sub_basis_checkbox'] == 'true'
    time_ids_checkbox = request.POST['time_ids_checkbox'] == 'true'
    pickup_keys_checkbox = request.POST['pickup_keys_checkbox'] == 'true'
    server_url = request.POST.get('server_url')
    data_level = request.POST['data_level']
    csv_separator = request.POST.get('csv_separator')

    csv_content = ""

    if host_ids_checkbox:
        csv_content += "Host" + csv_separator
    if tour_codes_checkbox:
        csv_content += "Tour Code" + csv_separator
    if basis_checkbox:
        csv_content += "Basis" + csv_separator
    if sub_basis_checkbox:
        csv_content += "Sub Basis" + csv_separator
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
                        basis_id = tour_base['intBasisID']
                        sub_basis_id = tour_base['intSubBasisID']
                        time_id = tour_time['intTourTimeID']
                        tour_pickups = ron_api.read_tour_pickups(host_id, tour_codes['strTourCode'], time_id, basis_id,
                                                                 server_url)

                        for tour_pickup in tour_pickups:
                            pickup_key = tour_pickup['strPickupKey']

                            if host_ids_checkbox:
                                csv_host_id = str(host_id) + csv_separator
                            else:
                                csv_host_id = ""
                            if tour_codes_checkbox:
                                csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                            else:
                                csv_tour_code = ""
                            if basis_checkbox:
                                csv_basis_id = str(basis_id) + csv_separator
                            else:
                                csv_basis_id = ""
                            if sub_basis_checkbox:
                                csv_sub_basis_id = str(sub_basis_id) + csv_separator
                            else:
                                csv_sub_basis_id = ""
                            if time_ids_checkbox:
                                csv_time_id = str(time_id) + csv_separator
                            else:
                                csv_time_id = ""

                            csv_content += csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id + str(
                                pickup_key) + "\n"

        elif time_ids_checkbox:
            for tour_codes in tours:
                tour_bases = ron_api.read_tour_bases(host_id, tour_codes['strTourCode'], server_url)

                for tour_base in tour_bases:

                    tour_times = ron_api.read_tour_times(host_id, tour_codes['strTourCode'], server_url)

                    for tour_time in tour_times:
                        basis_id = tour_base['intBasisID']
                        sub_basis_id = tour_base['intSubBasisID']
                        time_id = tour_time['intTourTimeID']

                        if host_ids_checkbox:
                            csv_host_id = str(host_id) + csv_separator
                        else:
                            csv_host_id = ""
                        if tour_codes_checkbox:
                            csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                        else:
                            csv_tour_code = ""
                        if basis_checkbox:
                            csv_basis_id = str(basis_id) + csv_separator
                        else:
                            csv_basis_id = ""
                        if sub_basis_checkbox:
                            csv_sub_basis_id = str(sub_basis_id) + csv_separator
                        else:
                            csv_sub_basis_id = ""
                        if time_ids_checkbox:
                            csv_time_id = str(time_id) + csv_separator
                        else:
                            csv_time_id = ""

                        csv_content += (
                                       csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id).rstrip(
                            csv_separator) + "\n"

        elif sub_basis_checkbox:
            for tour_codes in tours:
                tour_bases = ron_api.read_tour_bases(host_id, tour_codes['strTourCode'], server_url)

                for tour_base in tour_bases:
                    basis_id = tour_base['intBasisID']
                    sub_basis_id = tour_base['intSubBasisID']

                    if host_ids_checkbox:
                        csv_host_id = str(host_id) + csv_separator
                    else:
                        csv_host_id = ""
                    if tour_codes_checkbox:
                        csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                    else:
                        csv_tour_code = ""
                    if basis_checkbox:
                        csv_basis_id = str(basis_id) + csv_separator
                    else:
                        csv_basis_id = ""
                    if sub_basis_checkbox:
                        csv_sub_basis_id = str(sub_basis_id) + csv_separator
                    else:
                        csv_sub_basis_id = ""

                    csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(
                        csv_separator) + "\n"

        elif basis_checkbox:
            for tour_codes in tours:
                tour_bases = ron_api.read_tour_bases(host_id, tour_codes['strTourCode'], server_url)

                for tour_base in tour_bases:
                    basis_id = tour_base['intBasisID']
                    sub_basis_id = tour_base['intSubBasisID']

                    if host_ids_checkbox:
                        csv_host_id = str(host_id) + csv_separator
                    else:
                        csv_host_id = ""
                    if tour_codes_checkbox:
                        csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                    else:
                        csv_tour_code = ""
                    if basis_checkbox:
                        csv_basis_id = str(basis_id) + csv_separator
                    else:
                        csv_basis_id = ""
                    if sub_basis_checkbox:
                        csv_sub_basis_id = str(sub_basis_id) + csv_separator
                    else:
                        csv_sub_basis_id = ""

                    csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(
                        csv_separator) + "\n"
        elif tour_codes_checkbox:
            for tour_codes in tours:

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_codes['strTourCode']) + csv_separator
                else:
                    csv_tour_code = ""

                csv_content += (csv_host_id + csv_tour_code).rstrip(csv_separator) + "\n"
        elif host_ids_checkbox:
            csv_content += host_id + "\n"
    elif data_level == "2":
        print(parameters)
        tour_code = parameters.split(',')[1]
        if pickup_keys_checkbox:
            tour_bases = ron_api.read_tour_bases(host_id, tour_code, server_url)

            for tour_base in tour_bases:

                tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

                for tour_time in tour_times:
                    basis_id = tour_base['intBasisID']
                    sub_basis_id = tour_base['intSubBasisID']
                    time_id = tour_time['intTourTimeID']
                    tour_pickups = ron_api.read_tour_pickups(host_id, tour_code, time_id, basis_id,
                                                             server_url)

                    for tour_pickup in tour_pickups:
                        pickup_key = tour_pickup['strPickupKey']

                        if host_ids_checkbox:
                            csv_host_id = str(host_id) + csv_separator
                        else:
                            csv_host_id = ""
                        if tour_codes_checkbox:
                            csv_tour_code = str(tour_code) + csv_separator
                        else:
                            csv_tour_code = ""
                        if basis_checkbox:
                            csv_basis_id = str(basis_id) + csv_separator
                        else:
                            csv_basis_id = ""
                        if sub_basis_checkbox:
                            csv_sub_basis_id = str(sub_basis_id) + csv_separator
                        else:
                            csv_sub_basis_id = ""
                        if time_ids_checkbox:
                            csv_time_id = str(time_id) + csv_separator
                        else:
                            csv_time_id = ""

                        csv_content += (
                                       csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id + str(
                                           pickup_key)).rstrip(csv_separator) + "\n"

        elif time_ids_checkbox:
            tour_bases = ron_api.read_tour_bases(host_id, tour_code, server_url)

            for tour_base in tour_bases:

                tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

                for tour_time in tour_times:
                    basis_id = tour_base['intBasisID']
                    sub_basis_id = tour_base['intSubBasisID']
                    time_id = tour_time['intTourTimeID']

                    if host_ids_checkbox:
                        csv_host_id = str(host_id) + csv_separator
                    else:
                        csv_host_id = ""
                    if tour_codes_checkbox:
                        csv_tour_code = str(tour_code) + csv_separator
                    else:
                        csv_tour_code = ""
                    if basis_checkbox:
                        csv_basis_id = str(basis_id) + csv_separator
                    else:
                        csv_basis_id = ""
                    if sub_basis_checkbox:
                        csv_sub_basis_id = str(sub_basis_id) + csv_separator
                    else:
                        csv_sub_basis_id = ""
                    if time_ids_checkbox:
                        csv_time_id = str(time_id) + csv_separator
                    else:
                        csv_time_id = ""

                    csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id).rstrip(
                        csv_separator) + "\n"

        elif sub_basis_checkbox:
            tour_bases = ron_api.read_tour_bases(host_id, tour_code, server_url)

            for tour_base in tour_bases:
                basis_id = tour_base['intBasisID']
                sub_basis_id = tour_base['intSubBasisID']

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_code) + csv_separator
                else:
                    csv_tour_code = ""
                if basis_checkbox:
                    csv_basis_id = str(basis_id) + csv_separator
                else:
                    csv_basis_id = ""
                if sub_basis_checkbox:
                    csv_sub_basis_id = str(sub_basis_id) + csv_separator
                else:
                    csv_sub_basis_id = ""

                csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(
                    csv_separator) + "\n"

        elif basis_checkbox:
            tour_bases = ron_api.read_tour_bases(host_id, tour_code, server_url)

            for tour_base in tour_bases:
                basis_id = tour_base['intBasisID']
                sub_basis_id = tour_base['intSubBasisID']

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_code) + csv_separator
                else:
                    csv_tour_code = ""
                if basis_checkbox:
                    csv_basis_id = str(basis_id) + csv_separator
                else:
                    csv_basis_id = ""
                if sub_basis_checkbox:
                    csv_sub_basis_id = str(sub_basis_id) + csv_separator
                else:
                    csv_sub_basis_id = ""

                csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(
                    csv_separator) + "\n"
        elif tour_codes_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""

            csv_content += (csv_host_id + csv_tour_code).rstrip(csv_separator) + "\n"
        elif host_ids_checkbox:
            csv_content += host_id + "\n"
    elif data_level == "3":
        tour_code = parameters.split(',')[1]
        basis_id = parameters.split(',')[2]
        sub_basis_id = parameters.split(',')[3]

        if pickup_keys_checkbox:
            tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

            for tour_time in tour_times:
                time_id = tour_time['intTourTimeID']
                tour_pickups = ron_api.read_tour_pickups(host_id, tour_code, time_id, basis_id,
                                                         server_url)

                for tour_pickup in tour_pickups:
                    pickup_key = tour_pickup['strPickupKey']

                    if host_ids_checkbox:
                        csv_host_id = str(host_id) + csv_separator
                    else:
                        csv_host_id = ""
                    if tour_codes_checkbox:
                        csv_tour_code = str(tour_code) + csv_separator
                    else:
                        csv_tour_code = ""
                    if basis_checkbox:
                        csv_basis_id = str(basis_id) + csv_separator
                    else:
                        csv_basis_id = ""
                    if sub_basis_checkbox:
                        csv_sub_basis_id = str(sub_basis_id) + csv_separator
                    else:
                        csv_sub_basis_id = ""
                    if time_ids_checkbox:
                        csv_time_id = str(time_id) + csv_separator
                    else:
                        csv_time_id = ""

                    csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id + str(
                        pickup_key)).rstrip(csv_separator) + "\n"

        elif time_ids_checkbox:
            tour_times = ron_api.read_tour_times(host_id, tour_code, server_url)

            for tour_time in tour_times:
                time_id = tour_time['intTourTimeID']

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_code) + csv_separator
                else:
                    csv_tour_code = ""
                if basis_checkbox:
                    csv_basis_id = str(basis_id) + csv_separator
                else:
                    csv_basis_id = ""
                if sub_basis_checkbox:
                    csv_sub_basis_id = str(sub_basis_id) + csv_separator
                else:
                    csv_sub_basis_id = ""
                if time_ids_checkbox:
                    csv_time_id = str(time_id) + csv_separator
                else:
                    csv_time_id = ""

                csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id).rstrip(
                    csv_separator) + "\n"

        elif sub_basis_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(csv_separator) + "\n"

        elif basis_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(csv_separator) + "\n"
        elif tour_codes_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""

            csv_content += (csv_host_id + csv_tour_code).rstrip(csv_separator) + "\n"
        elif host_ids_checkbox:
            csv_content += host_id.rstrip(csv_separator) + "\n"
    elif data_level == "4":
        tour_code = parameters.split(',')[1]
        basis_id = parameters.split(',')[2]
        sub_basis_id = parameters.split(',')[3]
        time_id = parameters.split(',')[4]

        if pickup_keys_checkbox:
            tour_pickups = ron_api.read_tour_pickups(host_id, tour_code, time_id, basis_id,
                                                     server_url)

            for tour_pickup in tour_pickups:
                pickup_key = tour_pickup['strPickupKey']

                if host_ids_checkbox:
                    csv_host_id = str(host_id) + csv_separator
                else:
                    csv_host_id = ""
                if tour_codes_checkbox:
                    csv_tour_code = str(tour_code) + csv_separator
                else:
                    csv_tour_code = ""
                if basis_checkbox:
                    csv_basis_id = str(basis_id) + csv_separator
                else:
                    csv_basis_id = ""
                if sub_basis_checkbox:
                    csv_sub_basis_id = str(sub_basis_id) + csv_separator
                else:
                    csv_sub_basis_id = ""
                if time_ids_checkbox:
                    csv_time_id = str(time_id) + csv_separator
                else:
                    csv_time_id = ""

                csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id + str(
                    pickup_key)).rstrip(csv_separator) + "\n"

        elif time_ids_checkbox:

            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""
            if time_ids_checkbox:
                csv_time_id = str(time_id) + csv_separator
            else:
                csv_time_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id).rstrip(
                csv_separator) + "\n"

        elif sub_basis_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(csv_separator) + "\n"

        elif basis_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(csv_separator) + "\n"
        elif tour_codes_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""

            csv_content += (csv_host_id + csv_tour_code).rstrip(csv_separator) + "\n"
        elif host_ids_checkbox:
            csv_content += host_id.rstrip(csv_separator) + "\n"
    elif data_level == "5":
        tour_code = parameters.split(',')[1]
        basis_id = parameters.split(',')[2]
        sub_basis_id = parameters.split(',')[3]
        time_id = parameters.split(',')[4]
        pickup_key = parameters.split(',')[5]

        if pickup_keys_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""
            if time_ids_checkbox:
                csv_time_id = str(time_id) + csv_separator
            else:
                csv_time_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id + str(
                pickup_key)).rstrip(csv_separator) + "\n"

        elif time_ids_checkbox:

            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""
            if time_ids_checkbox:
                csv_time_id = str(time_id) + csv_separator
            else:
                csv_time_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id + csv_time_id).rstrip(
                csv_separator) + "\n"

        elif sub_basis_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(csv_separator) + "\n"

        elif basis_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""
            if basis_checkbox:
                csv_basis_id = str(basis_id) + csv_separator
            else:
                csv_basis_id = ""
            if sub_basis_checkbox:
                csv_sub_basis_id = str(sub_basis_id) + csv_separator
            else:
                csv_sub_basis_id = ""

            csv_content += (csv_host_id + csv_tour_code + csv_basis_id + csv_sub_basis_id).rstrip(csv_separator) + "\n"
        elif tour_codes_checkbox:
            if host_ids_checkbox:
                csv_host_id = str(host_id) + csv_separator
            else:
                csv_host_id = ""
            if tour_codes_checkbox:
                csv_tour_code = str(tour_code) + csv_separator
            else:
                csv_tour_code = ""

            csv_content += csv_host_id + csv_tour_code + "\n"
        elif host_ids_checkbox:
            csv_content += host_id.rstrip(csv_separator) + "\n"

    response_data = {
        'csv_content': csv_content,
    }

    return JsonResponse(response_data)


def fill_form_xml(request):
    print(request.POST.get("xml"))
    xml = request.POST.get("xml")
    loaded_xml = xmlrpclib.loads(xml)
    print (loaded_xml)

    response_data = {
        'loaded_xml': loaded_xml
    }
    return JsonResponse(response_data)
