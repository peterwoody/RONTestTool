import xmlrpclib
from collections import OrderedDict


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
        table_response = {"Ping Response": [xml_response]}

    elif method == 'readHosts':

        try:
            hosts = connection.readHosts()
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(hosts)
        xml_response = xmlrpclib.dumps((hosts,))

    elif method == 'readCurrentLogin':

        try:
            current_login = connection.readCurrentLogin()
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        current_login = process_xml_array_dict_response(current_login)
        table_response = current_login
        xml_response = xmlrpclib.dumps((current_login,))

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

    elif method == 'readSources':
        host_id = params[0]
        try:
            sources = connection.readSources(host_id)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(sources)
        xml_response = xmlrpclib.dumps((sources,))

    elif method == 'readCreditCardTypes':
        host_id = params[0]
        try:
            card_types = connection.readCreditCardTypes(host_id)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(card_types)
        xml_response = xmlrpclib.dumps((card_types,))

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

    elif method == 'readCreditStatus':
        host_id = params[0]
        try:
            credit_status = connection.readCreditStatus(host_id)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
        table_response = process_xml_credit_status(credit_status)
        xml_response = xmlrpclib.dumps((credit_status,))

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

    elif method == 'readTourWebDetails':
        host_id = params[0]
        tour_code = params[1]
        try:
            tour_web_details = connection.readTourWebDetails(host_id, tour_code, False)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_dict_response(tour_web_details)
        xml_response = xmlrpclib.dumps((tour_web_details,))

    elif method == 'readTourWebDetailsImages':
        host_id = params[0]
        tour_code = params[1]
        try:
            tour_web_details = connection.readTourWebDetails(host_id, tour_code, True)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        b64_small_image = tour_web_details['b64SmallImage']
        b64_large_image = tour_web_details['b64LargeImage']
        b64_include_image = tour_web_details['b64IncludeImage']
        tour_web_details.clear()
        tour_web_details['b64SmallImage'] = b64_small_image
        tour_web_details['b64LargeImage'] = b64_large_image
        tour_web_details['b64IncludeImage'] = b64_include_image

        table_response = process_xml_dict_response(tour_web_details)
        xml_response = xmlrpclib.dumps((tour_web_details,))

    elif method == 'readTourBases':
        host_id = params[0]
        tour_code = params[1]
        try:
            tour_bases = connection.readTourBases(host_id, tour_code)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_list_response(tour_bases)

        print table_response

        myorder = ['strTourCode', 'intBasisID', 'intSubBasisID', 'strSubBasisDesc', 'intFixedNoPax',
                   'ysnWebEnabledSubBasis', 'ysnWebEnabledBasis', 'strBasisDesc', 'strBasisDesc2', 'intDurationDays']

        ordered = OrderedDict()
        for k in myorder:
            ordered[k] = table_response[k]

        table_response = ordered

        xml_response = xmlrpclib.dumps((tour_bases,))

    elif method == 'readTourPickup':
        host_id = params[0]
        tour_code = params[1]
        basis_id = params[2]
        tour_time_id = params[3]
        pickup_id = params[4]
        try:
            tour_pickup = connection.readTourPickup(host_id, tour_code, tour_time_id, basis_id, pickup_id)
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_dict_response(tour_pickup)
        xml_response = xmlrpclib.dumps((tour_pickup,))

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

    elif method == 'readTourCommissions':
        host_id = params[0]
        tour_code = params[1]
        basis_id = params[2]
        subbasis_id = params[3]
        tour_date = params[4]
        tour_time_id = params[5]

        try:
            tour_commissions = connection.readTourCommissions(host_id, tour_code, basis_id, subbasis_id, tour_date,
                                                              tour_time_id)

        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
        table_response = process_xml_dict_response(tour_commissions)
        xml_response = xmlrpclib.dumps((tour_commissions,))

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

            order_tour_prices = ['curAdultTourSell', 'curAdultTourLevy', 'curChildTourSell', 'curChildTourLevy',
                                 'curInfantTourSell', 'curInfantTourLevy', 'curUDef1TourSell', 'curUDef1TourLevy',
                                 'curFOCTourSell', 'curFOCTourLevy', 'strPaymentOption', 'curTourLevy', 'curCardFee',
                                 'curDeposit', 'curPayOnBoard', 'dblFOCCommission', 'boolUDef1Assoc',
                                 'curTotalCardFee', 'boolFOCAssoc', 'strCurrencyType', 'dblUDef1Commission',
                                 'boolAdultAssoc', 'curBookingFee', 'strCurrencySymbol', 'dblAdultCommission',
                                 'curPayOnBoardCardFee', 'dblChildCommission', 'boolChildAssoc',
                                 'dblInfantCommission', 'curAdultTourLevy', 'boolInfantAssoc', 'curTotal',
                                 'curDepositCardFee']

        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

        table_response = process_xml_dict_response(tour_prices)

        ordered_tour_prices = OrderedDict()
        for i in order_tour_prices:
            ordered_tour_prices[i] = table_response[i]

        table_response = ordered_tour_prices

        xml_response = xmlrpclib.dumps((tour_prices,))

    elif method == 'readTourPricesRange':
        query = params[0]

        try:
            tour_prices_range = connection.readTourPricesRange(query)

        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
        table_response = process_xml_list_response(tour_prices_range)
        xml_response = xmlrpclib.dumps((tour_prices_range,))
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

    elif method == 'readTourAvailabilityRange':
        query = params[0]

        try:
            tour_prices_range = connection.readTourAvailabilityRange(query)

        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
        table_response = process_xml_list_response(tour_prices_range)
        xml_response = xmlrpclib.dumps((tour_prices_range,))

    elif method == 'readReservationDetails':
        host_id = params[0]
        confirmation_no = params[1]
        try:
            reservation_details = connection.readReservationDetails(host_id, confirmation_no)

            table_response = process_xml_dict_response(reservation_details)
            xml_response = xmlrpclib.dumps((reservation_details,))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

    elif method == 'checkReservation':
        host_id = params[0]
        reservation = params[1]
        payment = params[2]
        try:
            check_reservation = connection.checkReservation(host_id, reservation, payment)

            if not check_reservation:
                check_reservation = "no errors were found in the pre-commit check"

            table_response = {"Check Reservation": [check_reservation]}
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
            check_reservation = check_reservation_and_prices["arrCheckReservation"]
            tour_prices = check_reservation_and_prices["arrReadTourPrices"]

            if not check_reservation:
                check_reservation = "no errors were found in the pre-commit check"

            check_reservation = {"Check Reservation": check_reservation}
            check_reservation.update(tour_prices)
            check_reservation_and_prices = check_reservation

            # check_reservation_and_prices = process_xml_dict_response(check_reservation_and_prices["arrReadTourPrices"])
            check_reservation_and_prices = process_xml_dict_response(check_reservation_and_prices)
            # check_reservation_and_prices = process_xml_array_dict_response(check_reservation_and_prices)
            table_response = check_reservation_and_prices
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

            table_response = {"Write Reservation No.": [write_reservation]}
            xml_response = xmlrpclib.dumps((write_reservation,))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}
    elif method == 'writeCancellation':
        host_id = params[0]
        confirmation = params[1]
        reason = params[2]

        try:
            write_cancellation = connection.writeCancellation(host_id, confirmation, reason)
            table_response = {"Write Reservation No.": [write_cancellation]}
            xml_response = xmlrpclib.dumps((write_cancellation,))
        except xmlrpclib.Fault as error:
            fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
            return fault, {"Fault": [fault]}

    else:
        return "Method does not exist.", "Method does not exist."

    return xml_response, table_response


def read_current_login(server_url):
    connection = xmlrpclib.ServerProxy(server_url)
    try:
        current_login = connection.readCurrentLogin()
    except xmlrpclib.Fault as error:
        fault = "A fault occurred. Fault code: %d." % error.faultCode + " Fault string: %s" % error.faultString
        return fault, {"Fault": [fault]}

    return current_login


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


def get_location(host_id, server_url):
    connection = xmlrpclib.ServerProxy(server_url)
    list_object = connection.readHostDetails(host_id)
    return list_object[0].get("strLocation")


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
                xml_dict_response = process_xml_dict_response(i[key])
                for ikey in xml_dict_response:
                    table_response.setdefault(ikey, [])
                    table_response[ikey].append(xml_dict_response[ikey][0])
            else:
                table_response.setdefault(key, [])
                table_response[key].append(i[key])

    return table_response


def process_xml_dict_response(xml_response):
    table_response = {}

    for key in xml_response:
        if type(xml_response[key]) is list:
            for i in xml_response[key]:
                if type(i) == str:
                    table_response.update({key: [i]})
                elif type(i) == dict:
                    table_response.update(process_xml_dict_response(i))
                elif type(i) == list:
                    table_response.update(process_xml_list_response(i))

        elif type(xml_response[key]) is dict:
            processed_dict = process_xml_dict_response(xml_response[key])
            table_response.update(processed_dict)
        else:
            table_response.setdefault(key, [])
            table_response[key].append(xml_response[key])

    return table_response


def process_xml_array_dict_response(xml_response):
    table_response = {}
    for i in xml_response:
        for key in xml_response[i]:
            if type(key) is dict:
                table_response.update(process_xml_dict_response(i[key]))
            else:
                table_response.setdefault(key, [])
                table_response[key].append(xml_response[i][key])

    return table_response


def process_xml_credit_status(xml_response):
    table_response = {}

    table_response.setdefault("Credit Status", [])
    table_response["Credit Status"].append(xml_response)

    return table_response
