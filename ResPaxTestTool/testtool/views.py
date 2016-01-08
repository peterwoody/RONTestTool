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

        # locations = ron_api.get_host_details(host_id)
        # locations = ron_api.get_host_details('strLocation')

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

    response_data = {
        'tours': tours,
    }

    return JsonResponse(response_data)


def get_tour_bases(request):
    host_id = request.POST['host_id']
    tour_code = request.POST['tour_code']
    
    tour_bases = ron_api.read_tour_bases(host_id, tour_code)

    response_data = {
        'tour_bases': tour_bases,
    }

    return JsonResponse(response_data)


def get_tour_times(request):
    host_id = request.POST['host_id']
    tour_code = request.POST['tour_code']

    tour_times = ron_api.read_tour_times(host_id, tour_code)

    response_data = {
        'tour_times': tour_times,
    }

    return JsonResponse(response_data)


def get_tour_pickups(request):
    host_id = request.POST['host_id']
    tour_code = request.POST['tour_code']
    tour_time_id = request.POST['tour_time_id']
    tour_basis_id = request.POST['tour_basis_id']

    tour_pickups = ron_api.read_tour_pickups(host_id, tour_code, tour_time_id, tour_basis_id)

    response_data = {
        'tour_pickups': tour_pickups,
    }

    return JsonResponse(response_data)
