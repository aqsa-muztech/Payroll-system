const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  try {
    const response = await api.post('/auth/login/', { username, password });
    Cookies.set('access_token', response.data.access);
    Cookies.set('refresh_token', response.data.refresh);

    const userRes = await api.get('/auth/me/');
    if (userRes.data.role === 'EMPLOYEE') {
      router.push('/dashboard'); 
    } else {
      router.push('/dashboard'); 
    }
  } catch (err: any) {
    setError('Invalid credentials. Please try again.');
  }
};