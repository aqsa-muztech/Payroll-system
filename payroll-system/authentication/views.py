from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from .models import User

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Returns logged-in user profile & role for frontend routing"""
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_employee(request):
    """Admin endpoint to create a new employee and generate credentials"""
    data = request.data
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    # Create new employee user
    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name,
        role=User.Roles.EMPLOYEE
    )

    return Response({
        'message': 'Employee created successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'role': user.role
        }
    }, status=status.HTTP_201_CREATED)