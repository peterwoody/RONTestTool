import xmlrpclib


def get_connection(username, password):
    url = 'https://ron.respax.com.au:30443/section/xmlrpc/server-ron.php?config=train'
    ron = xmlrpclib.Server(url)

    try:
        session_id = ron.login(username, password)
        connection = xmlrpclib.Server(url + '&' + session_id)
        return {'logic': True, 'connection': connection}
    except xmlrpclib.Fault as err:
        print "A fault occurred"
        print "Fault code: %d" % err.faultCode
        print "Fault string: %s" % err.faultString
        return {'logic': False, 'fault': "A fault occurred. Fault code: %d." % err.faultCode +
                                         " Fault string: %s" % err.faultString}


def get_hosts(connection, key):
    hosts = connection.readHosts()
    list_object = []
    for data in hosts:
        # print(data)
        host = (data.get(key, None))
        # print(str(host))
        list_object.append(str(host))

    #list_object.sort()
    # print(list_object)
    return list_object


def get_host_details(connection, key):
    host_ids = get_hosts(connection, 'strHostID')
    #list_object = [connection.readHostDetails(data) for data in host_ids]
    list_object = []

    for data in host_ids:
        host_details = connection.readHostDetails(data)[0].get(key)
        # host_detail = host_details[0].get(key, None)
        print(host_details)
        list_object.append(host_details)

    print(list_object)
    return list_object


def read_tours(connection):
    tours = connection.readTours('AGRO')
    print(tours)
    return tours


#read_tours()

#readTourBases (string hostid, string tourcode)
#host_details = get_host_details()
#get_host_details('strLocation')
#host_details = get_connection().readHostDetails(host_id)
#return host_details
