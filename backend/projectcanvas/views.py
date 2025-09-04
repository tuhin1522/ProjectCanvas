from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
# SignUp API
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        # Handle signup logic
        return JsonResponse({'message': 'User signed up successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)

# Login API
@csrf_exempt
def login(request):
    if request.method == 'POST':
        # Handle login logic
        return JsonResponse({'message': 'User logged in successfully'})
    return JsonResponse({'error': 'Invalid request'}, status=400)
