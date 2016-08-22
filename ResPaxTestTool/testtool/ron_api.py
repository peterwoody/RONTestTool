import xmlrpclib


def get_connection(username, password, server_config):
    url = 'https://ron.respax.com.au:30443/section/xmlrpc/server-ron.php?config=' + server_config
    ron = xmlrpclib.ServerProxy(url, allow_none=True)

    try:
        session_id = ron.login(username, password)

        connection = xmlrpclib.ServerProxy(url + '&' + session_id)

        return {'logic': True, 'session_id': session_id}
    except xmlrpclib.Fault as err:
        return {'logic': False, 'fault': "A fault occurred. Fault code: %d." % err.faultCode +
                                         " Fault string: %s" % err.faultString}


def raw_xml_request(server_url, xml):
    connection = xmlrpclib.ServerProxy(server_url)

    xml_request = xmlrpclib.loads(xml)
    method = xml_request[1]

    if method is "":
        return "No method provided.", "No method provided."

    params = xml_request[0]

    xml_response = None
    table_response = None

    if method == 'ping':
        xml_response = connection.ping()

    elif method == 'readHosts':

        try:
            hosts = connection.readHosts()
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(hosts)
        xml_response = xmlrpclib.dumps((hosts,))

    elif method == 'readHostDetails':
        host_id = params[0]
        try:
            host_details = (connection.readHostDetails(host_id))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(host_details)
        xml_response = xmlrpclib.dumps((host_details,))

    elif method == 'readPaymentOptions':
        host_id = params[0]
        try:
            payment_options = (connection.readPaymentOptions(host_id))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(payment_options)
        xml_response = xmlrpclib.dumps((payment_options,))

    elif method == 'readPaxTypes':
        host_id = params[0]
        try:
            pax_types = (connection.readPaxTypes(host_id))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(pax_types)
        xml_response = xmlrpclib.dumps((pax_types,))

    elif method == 'readTours':
        host_id = params[0]
        try:
            tours = connection.readTours(host_id)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(tours)
        xml_response = xmlrpclib.dumps((tours,))

    elif method == 'readTourDetails':
        host_id = params[0]
        tour_code = params[1]
        try:
            tour_details = connection.readTourDetails(host_id, tour_code)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_dict_response(tour_details)

        xml_response = xmlrpclib.dumps((tour_details,))

    elif method == 'readTourTimes':
        host_id = params[0]
        tour_code = params[1]
        try:
            tour_times = connection.readTourTimes(host_id, tour_code)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(tour_times)
        xml_response = xmlrpclib.dumps((tour_times,))

    elif method == 'readTourBases':
        host_id = params[0]
        tour_code = params[1]
        try:
            tour_bases = connection.readTourBases(host_id, tour_code)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(tour_bases)
        xml_response = xmlrpclib.dumps((tour_bases,))

    elif method == 'readTourPickups':
        host_id = params[0]
        tour_code = params[1]
        tour_time_id = params[2]
        basis_id = params[3]
        tour_date = params[4]
        try:
            tour_pickups = connection.readTourPickups(host_id, tour_code, tour_time_id, basis_id, tour_date)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(tour_pickups)
        xml_response = xmlrpclib.dumps((tour_pickups,))

    elif method == 'readTourPrices':
        host_id = params[0]
        tour_code = params[1]
        basis_id = params[2]
        subbasis_id = params[3]
        tour_date = params[4]
        tour_time_id = params[5]
        pickup_id = params[6]
        drop_off_id = params[7]
        try:
            tour_prices = connection.readTourPrices(host_id, tour_code, basis_id, subbasis_id, tour_date, tour_time_id,
                                                    pickup_id, drop_off_id)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
        table_response = process_xml_dict_response(tour_prices)
        xml_response = xmlrpclib.dumps((tour_prices,))

    elif method == 'readTourAvailability':
        host_id = params[0]
        tour_code = params[1]
        basis_id = params[2]
        subbasis_id = params[3]
        tour_date = params[4]
        tour_time_id = params[5]
        try:
            tour_availability = connection.readTourAvailability(host_id, tour_code, basis_id, subbasis_id, tour_date,
                                                                tour_time_id)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
        table_response = {"tourAvailability": [tour_availability]}
        xml_response = xmlrpclib.dumps((tour_availability,))

    elif method == 'checkReservation':
        host_id = params[0]
        reservation = params[1]
        payment = params[2]
        try:
            check_reservation = connection.checkReservation(host_id, reservation, payment)

            table_response = process_xml_list_response(check_reservation)
            xml_response = xmlrpclib.dumps((check_reservation,))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
    elif method == 'checkReservationAndPrices':
        host_id = params[0]
        reservation = params[1]
        payment = params[2]
        try:
            check_reservation_and_prices = connection.checkReservationAndPrices(host_id, reservation, payment)
            dictionary_keys =  process_xml_dict_response(check_reservation_and_prices).keys()
            print("check_reservation_and_prices: ", check_reservation_and_prices.keys())
            print("process_xml check_reservation_and_prices: ", process_xml_dict_response(check_reservation_and_prices)["arrReadTourPrices"][0])

            # check_reservation_and_prices = dict({"checkReservation": "No errors were found in the precommit check"}, (check_reservation_and_prices)["arrReadTourPrices"])
            check_reservation_and_prices = process_xml_dict_response(check_reservation_and_prices)["arrReadTourPrices"]
            table_response = process_xml_list_response(check_reservation_and_prices)
            xml_response = xmlrpclib.dumps((check_reservation_and_prices,))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
    elif method == 'writeReservation':
        host_id = params[0]
        is_confirmed = params[1]
        reservation = params[2]
        payment = params[3]
        credit_card = params[4]
        try:
            write_reservation = connection.writeReservation(host_id, is_confirmed, reservation, payment, credit_card)

            table_response = process_xml_dict_response(write_reservation)
            xml_response = xmlrpclib.dumps((write_reservation,))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

    else:
        return "Method does not exist.", "Method does not exist."

    return xml_response, table_response


def get_hosts(key, server_url):
    connection = xmlrpclib.ServerProxy(server_url)
    hosts = connection.readHosts()
    list_object = []

    for data in hosts:
        host = (data.get(key, None))
        list_object.append(str(host))

    return list_object


def get_host_details(host_ids, key, server_url):
    connection = xmlrpclib.ServerProxy(server_url)
    list_object = [connection.readHostDetails(data)[0].get(key) for data in host_ids]

    return list_object


def read_tours(host_id, server_url):
    connection = xmlrpclib.ServerProxy(server_url)
    try:
        tours = connection.readTours(host_id)
        return tours
    except xmlrpclib.Fault:
        return "No tours available"


def read_tour_bases(host_id, tour_code, server_url):
    connection = xmlrpclib.ServerProxy(server_url)
    tour_bases = connection.readTourBases(host_id, tour_code)

    return tour_bases


def read_tour_times(host_id, tour_code, server_url):
    connection = xmlrpclib.ServerProxy(server_url)
    tour_times = connection.readTourTimes(host_id, tour_code)

    return tour_times


def read_tour_pickups(host_id, tour_code, tour_time_id, basis_id, server_url):
    connection = xmlrpclib.ServerProxy(server_url)
    tour_pickups = connection.readTourPickups(host_id, tour_code, tour_time_id, basis_id)

    return tour_pickups


def process_xml_list_response(xml_response):
    table_response = {}

    for i in xml_response:
        for key in i:
            if type(i[key]) is dict:
                table_response.update(process_xml_dict_response(i[key]))
            else:
                table_response.setdefault(key, [])
                table_response[key].append(i[key])

    return table_response


def process_xml_dict_response(xml_response):
    table_response = {}

    for key in xml_response:
        if type(xml_response[key]) is list:
            table_response.update(process_xml_list_response(xml_response[key]))
        else:
            table_response.setdefault(key, [])
            table_response[key].append(xml_response[key])

    return table_response
