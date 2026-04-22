# Emmanuel Aro's project submission for evaluation.
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ticket_matrix.settings")
application = get_wsgi_application()