from django.shortcuts import render
from django.http import JsonResponse
import ron_api


# Create your views here.


def testtool(request):
    username = request.POST.get('username')
    password = request.POST.get('password')

    connection = ron_api.get_connection(username, password)

    if connection.get('logic'):

        host_name = ron_api.get_hosts('strHostName')
        host_id = ron_api.get_hosts('strHostID')

        #locations = ron_api.get_host_details('strLocation')

        context = {
            "host_name": host_name,
            #"locations": locations,
            "host_id": host_id,
        }
        return render(request, "testTool.html", context)
    else:
        context = {
            'fault': connection.get('fault')
        }
        return render(request, "invalid.html", context)


def login(request):
    context = {

    }
    return render(request, "login.html", context)


def logout(request):
    ron_api.logout()
    context = {

    }
    return render(request, "login.html", context)


def invalid(request):
    context = {

    }
    return render(request, "invalid.html", context)


def get_tours(request):
    host_id = request.POST['id']
    tours = ron_api.read_tours(host_id)
    tour_bases = []
    tour_times = []
    tour_pickups = []
    for data in tours:
        tour_code = data.get('strTourCode')

        tour_base = ron_api.read_tour_bases(host_id, tour_code)
        tour_time = ron_api.read_tour_times(host_id, tour_code)

        if tour_base:
            tour_pickup = ron_api.read_tour_pickups(host_id, tour_code, tour_time[0].get('intTourTimeID'),
                                                     tour_base[0].get('intBasisID'))
        else:
            tour_pickup = ''

        tour_bases.append(tour_base)
        tour_times += tour_time
        tour_pickups += tour_pickup

    response_data = {
        'tours': tours,
        'tour_bases': tour_bases,
        'tour_times': tour_times,
        'tour_pickups': tour_pickups,
    }

    return JsonResponse(response_data)
