import jwt
from rest_framework.exceptions import AuthenticationFailed
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

def render_user_page(request):
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

        # Return JSON response for React frontend
        return JsonResponse({
            'message': 'You are authenticated!',
            'user': user,
        })

    except jwt.ExpiredSignatureError:
        return JsonResponse({'error': 'Token expired'}, status=401)
    except jwt.InvalidTokenError:
        return JsonResponse({'error': 'Invalid token'}, status=401)
    except AuthenticationFailed as e:
        return JsonResponse({'error': str(e)}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
