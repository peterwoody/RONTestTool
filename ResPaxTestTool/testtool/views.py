from django.shortcuts import render
from django.http import JsonResponse,HttpResponseRedirect
import ron_api, datetime


def test_tool(request):

    if request.POST.get('server_url') is not None:
        server_url = request.POST.get('server_url')

        print(request.POST.get('switch_server_button'))
        if request.POST.get('switch_server_button') == 'live':
            switch_server_button = 'train'
            server_url = server_url.replace('live', 'train')

        else:
            switch_server_button = 'live'
            print(server_url)
            server_url = server_url.replace("train", "live")
            print(server_url)

        ron_api.switch_server(server_url)

    else:
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

        if server_config == "live":
            switch_server_button = "train"
        else:
            switch_server_button = "live"

    host_name = ron_api.get_hosts('strHostName', server_url)
    host_id = ron_api.get_hosts('strHostID', server_url)

    context = {
        "host_name": host_name,
        "host_id": host_id,
        "switch_server_button": switch_server_button,
        "server_url": server_url
    }
    return render(request, "test_tool.html", context)


def login(request):
    context = {

    }
    return render(request, "login.html", context)


def logout(request):
    ron_api.logout()
    context = {

    }
    return render(request, "login.html", context)


def login_error(request):
    context = {

    }
    return render(request, "login_error.html", context)


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

    availability = ron_api.connection.readTourAvailability(host_id, tour_code, basis_id, sub_basis_id, tour_date, tour_time_id)

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
