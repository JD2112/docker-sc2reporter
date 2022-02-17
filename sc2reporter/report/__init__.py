from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

app.config.from_object('config')

import report.views
