import xmlrpclib


def get_connection():
    url = 'https://ron.respax.com.au:30443/section/xmlrpc/server-ron.php?config=train'
    ron = xmlrpclib.Server(url)

    session_id = ron.login('shaq1738', 'ye733dkd')

    connection = xmlrpclib.Server(url + '&' + session_id)

    return connection

connection = get_connection()


def get_hosts(key):
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

#host_name = get_hosts('strHostName')
#host_id = get_hosts('strHostID')


def get_host_details(key):
    host_ids = get_hosts('strHostID')
    #list_object = [connection.readHostDetails(data) for data in host_ids]
    list_object = []

    for data in host_ids:
        host_details = connection.readHostDetails(data)[0].get(key)
        # host_detail = host_details[0].get(key, None)
        print(host_details)
        list_object.append(host_details)

        # list_object.append(str(host_details))

    print(list_object)
    return list_object


def read_tours():
    tours = connection.readTours('AGRO')
    print(tours)
    return tours


#read_tours()

#readTourBases (string hostid, string tourcode)
#host_details = get_host_details()
#get_host_details('strLocation')
#host_details = get_connection().readHostDetails(host_id)
#return host_details
