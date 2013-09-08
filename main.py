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

def parseEvent(result):
	output = {
		"name": result.name,
		"host_name": result.host_name,
		"host_fb_id": result.host_fb_id,
		"description": result.description,
		"picture_url": result.picture_url,
		"people": [],
		"polls": []
	};

	for user in result.people:
		output["people"].append({
			"name": user.name,
			"id": user.fb_id
			})

	for poll in result.polls:
		new_poll = {}
		new_poll["name"] = poll.name
		new_poll["selections"] = []
		for selection in poll.selections:
			new_selection = {}
			new_selection["name"] = selection.name
			new_selection["people"] = []
			for user in selection.people:
				new_selection["people"].append({
					"name": user.name,
					"id": user.fb_id
				})
			new_poll["selections"].append(new_selection)
		output["polls"].append(new_poll)

	return output

class LoginHandler(webapp2.RequestHandler):
    def get(self):
	    path = os.path.join(os.path.dirname(__file__), 'public/login.html')
	    self.response.out.write(template.render(path, {}))

class DashboardHandler(webapp2.RequestHandler):
    def get(self):
	    path = os.path.join(os.path.dirname(__file__), 'public/dashboard.html')
	    self.response.out.write(template.render(path, {}))

class EventApiHandler(webapp2.RequestHandler):
	def get(self):
		result = ebModels.getEvent(self.request.get('e'))
		output = parseEvent(result)
		self.response.out.write(json.dumps(output))

	def post(self):
		data = json.loads(self.request.body)
		result = ebModels.addEvent(data)
		self.response.out.write(result)

	def put(self):
		data = json.loads(self.request.body)
		result = ebModels.editEvent(data, self.request.get('e'))
		output = parseEvent(result)
		self.response.out.write(json.dumps(output))

class UserApiHandler(webapp2.RequestHandler):
	def post(self):
		user = json.loads(self.request.body)
		result = ebModels.addUser(user, self.request.get('e'))
		output = parseEvent(result)
		self.response.out.write(json.dumps(output))

class SelectionApiHandler(webapp2.RequestHandler):
	def post(self):
		data = json.loads(self.request.body)
		result = ebModels.addSelection(data["selection"], data["poll"], self.request.get('e'))
		self.response.out.write(result)

class VoteApiHandler(webapp2.RequestHandler):
	def post(self):
		data = json.loads(self.request.body)
		result = ebModels.addSelection(date["user"], data["selection"], data["poll"], self.request.get('e'))
		self.response.out.write(result)

	def delete(self):
		data = json.loads(self.request.body)
		result = ebModels.addSelection(date["user"], data["selection"], data["poll"], self.request.get('e'))
		self.response.out.write(result)

class SpinnerHandler(webapp2.RequestHandler):
    def get(self):
	    path = os.path.join(os.path.dirname(__file__), 'public/spinner.html')
	    self.response.out.write(template.render(path, {}))

app = webapp2.WSGIApplication([
    ('/', LoginHandler),
    ('/dashboard', DashboardHandler),
    ('/api/event', EventApiHandler),
    ('/api/user', UserApiHandler),
    ('/api/selection', SelectionApiHandler),
    ('/api/vote', VoteApiHandler),
    ('/spinner', SpinnerHandler)
], debug=True)
