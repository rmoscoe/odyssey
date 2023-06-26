from django.shortcuts import render

# Create your views here.
def home(request):
    context = {}
    print('logging home function in server.views')
    return render(request, "index.html", context)