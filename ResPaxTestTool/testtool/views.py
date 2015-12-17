from django.shortcuts import render
from models import AddOperator
from django.contrib import auth
from django.http import JsonResponse
import ron_api


# Create your views here.


def testtool(request):
    username = request.POST.get('username')
    password = request.POST.get('password')

    connection = ron_api.get_connection(username, password)

    if connection.get('logic'):
        # host_name = AddOperator.objects.values_list('operator', flat=True)
        # host_info = ron_api.get_hosts()

        locations = AddOperator.objects.values_list('location', flat=True)
        basis = AddOperator.objects.values_list('basis', flat=True)
        subbasis = AddOperator.objects.values_list('subbasis', flat=True)
        time = AddOperator.objects.values_list('time', flat=True)
        pickup_id = AddOperator.objects.values_list('pickupId', flat=True)

        # print(host_info)

        def convert_to_list(value):
            list_object = []
            for data in value:
                # print(data)
                host = data
                # print(str(host))
                list_object.append(str(host))

            list_object.sort()
            # print(list_object)
            return list_object

        # host_name = convert_to_list(host_info, 'strHostName')
        # locations = convert_to_list(locations)

        host_name = ron_api.get_hosts(connection.get('connection'), 'strHostName')
        host_id = ron_api.get_hosts(connection.get('connection'), 'strHostID')

        # host_details = ron_api.host_details
        # print(host_details[0].get('strLocation'))

        locations = ron_api.get_host_details(connection.get('connection'), 'strLocation')
        basis = convert_to_list(basis)
        subbasis = convert_to_list(subbasis)
        time = convert_to_list(time)
        pickup_id = convert_to_list(pickup_id)

        print(host_name)
        print(host_id)
        context = {
            "host_name": host_name,
            "locations": locations,
            "host_id": host_id,
            "basis": basis,
            "subbasis": subbasis,
            "time": time,
            "pickup_id": pickup_id,
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
    auth.logout(request)
    context = {

    }
    return render(request, "login.html", context)


def invalid(request):
    context = {

    }
    return render(request, "invalid.html", context)


def get_tours(request):
    operator = request.POST.get('operator', '')
    username = request.user.username
    password = request.user.password
    print(username)
    print(password)
    connection = ron_api.get_connection(username, password)
    tours = ron_api.read_tours(connection)
    # tours = request.POST.get("")
    print(tours)
    # print("tours: ")

    response_data = tours
    print(response_data)

    return JsonResponse(response_data)
