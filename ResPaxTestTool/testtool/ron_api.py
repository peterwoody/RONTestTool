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


