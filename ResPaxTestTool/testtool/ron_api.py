import xmlrpclib




def logout():

    connection = xmlrpclib.Server('https://ron.respax.com.au:30443/section/xmlrpc/server-ron.php?config=train')


def switch_server(url):

    connection = xmlrpclib.ServerProxy(url)


def get_connection(username, password, server_config):

    url = 'https://ron.respax.com.au:30443/section/xmlrpc/server-ron.php?config='+server_config
    ron = xmlrpclib.ServerProxy(url, allow_none=True)

    try:
        session_id = ron.login(username, password)

        connection = xmlrpclib.ServerProxy(url + '&' + session_id)
        print(connection)
        return {'logic': True, 'session_id': session_id}
    except xmlrpclib.Fault as err:
        return {'logic': False, 'fault': "A fault occurred. Fault code: %d." % err.faultCode +
                                         " Fault string: %s" % err.faultString}


def raw_xml_request(server_url, xml):

    connection = xmlrpclib.ServerProxy(server_url)
    xml_request = xmlrpclib.loads(xml)
    method = xml_request[xml_request.__len__()-1]
    params = xml_request[0]

    if method == 'readHostDetails':
        host_id = params[0]
        print(connection.readHostDetails(host_id))

    elif method == 'readTours':
        host_id = params[0]
        connection.readTours(host_id)

    elif method == 'readTourDetails':
        host_id = params[0]
        tour_code = params[1]

        connection.readTourDetails(host_id, tour_code)

    elif method == 'readTourTimes':

        connection.readTourTimes()

    elif method == 'readTourBases':

        connection.readTourBases()

    elif method == 'readTourPickups':

        connection.readTourPickups()

    elif method == 'readTourPickup':

        connection.readTourPickup()

    elif method == 'readTourPrices':

        connection.readTourPrices()

    elif method == 'readTourPricesRange':

        connection.readTourPricesRange()

    elif method == 'readTourCommissions':

        connection.readTourCommissions()

    elif method == 'readTourAvailability':

        host_id = params[0]
        tour_code = params[1]
        basis_id = params[2]
        subbasis_id = params[3]
        tour_date = params[4]
        tour_time_id = params[5]

        print(connection.readTourAvailability(host_id, tour_code, basis_id, subbasis_id, tour_date, tour_time_id))

    elif method == 'readTourAvailabilityRange':

        connection.readTourAvailabilityRange()

    elif method == 'readTourWebDetails':

        connection.readTourWebDetails()


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
    print(host_id)
    print(server_url)
    connection = xmlrpclib.ServerProxy(server_url)

    tours = connection.readTours(host_id)

    return tours


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


