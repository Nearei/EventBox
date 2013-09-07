#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import os
from google.appengine.ext.webapp import template
from google.appengine.ext import db
import sys
import json

import ebModels

class LoginHandler(webapp2.RequestHandler):
    def get(self):
	    path = os.path.join(os.path.dirname(__file__), 'public/login.html')
	    self.response.out.write(template.render(path, {}))

class DashboardHandler(webapp2.RequestHandler):
    def get(self):
	    path = os.path.join(os.path.dirname(__file__), 'public/dashboard.html')
	    self.response.out.write(template.render(path, {}))

class EventHandler(webapp2.RequestHandler):
    def get(self):
	    path = os.path.join(os.path.dirname(__file__), 'public/event.html')
	    self.response.out.write(template.render(path, {}))

class EventApiHandler(webapp2.RequestHandler):
	def get(self):
		result = ebModels.getEvent(self.request.get('e'))
		output = {
			"name": result.name,
			"host_name": result.host_name,
			"host_fb_id": result.host_fb_id,
			"description": result.description,
			"datetime": result.datetime,
			"loc": {
				"lat": result.location.lat,
				"lon": result.location.lon,
				"name": result.location.name
			},
			"picture_url": result.picture_url,
			"people": []
		};

		for user in result.people:
			output["people"].append({
				"user": user.name,
				"id": user.fb_id
				})

		self.response.out.write(json.dumps(output))

	def post(self):
		data = json.loads(self.request.body)
		result = ebModels.addEvent(data)
		self.response.out.write(result)

class SpinnerHandler(webapp2.RequestHandler):
    def get(self):
	    path = os.path.join(os.path.dirname(__file__), 'public/spinner.html')
	    self.response.out.write(template.render(path, {}))

app = webapp2.WSGIApplication([
    ('/', LoginHandler),
    ('/dashboard', DashboardHandler),
    ('/event/', EventHandler),
    ('/api/event', EventApiHandler),
    ('/spinner', SpinnerHandler)
], debug=True)
