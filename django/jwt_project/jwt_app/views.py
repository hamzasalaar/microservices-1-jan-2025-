import jwt
from django.http import HttpResponse
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.decorators import login_required

# Static data simulating courses
COURSES = [
    {"name": "Introduction to Programming", "description": "Learn the basics of programming with Python."},
    {"name": "Web Development with Django", "description": "Master web development using Django framework."},
    {"name": "Data Science with Python", "description": "Learn data analysis and visualization with Python."},
    {"name": "Machine Learning Fundamentals", "description": "Understand the basics of machine learning."},
]

@login_required
def fetch_courses(request):
    try:
        # Render the HTML template with the course data
        context = {'courses': COURSES}
        return render(request, 'courses.html', context)
    
    except Exception as e:
        return HttpResponse(f"Error: {str(e)}", status=500)

def render_page(request):
    token = request.headers.get('Authorization')
    
    if not token:
        return JsonResponse({'error': 'Token missing'}, status=400)

    try:
        # Extract the token from the 'Bearer <token>' format
        token = token.split(' ')[1]
        
        # Decode JWT token
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('id')
        
        # Ensure the user_id exists in the token payload
        if not user_id:
            raise AuthenticationFailed('User ID not found in token.')

        # Simulated user object for response (replace with actual user lookup if needed)
        user = {
            'id': user_id,
            'email': payload.get('email'),
        }

        # Render HTML template with user data and courses
        return render(request, 'dashboard.html', {'user': user, 'courses': COURSES})

    except jwt.ExpiredSignatureError:
        return HttpResponse("Token expired", status=401)
    except jwt.InvalidTokenError:
        return HttpResponse("Invalid token", status=401)
    except Exception as e:
        return HttpResponse(str(e), status=400)
    