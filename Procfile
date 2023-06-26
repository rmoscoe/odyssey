release: python manage.py migrate
web: gunicorn odyssey_app.wsgi --log-file -
build: cd client && npm install && npm run build
frontend: npm start