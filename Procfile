release: python manage.py migrate
web: gunicorn odyssey_app.wsgi --log-file -
frontend: sh -c 'cd client && npm start'