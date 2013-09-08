import datetime
from google.appengine.ext import ndb

class User(ndb.Model):
	name = ndb.StringProperty(required=True)
	fb_id = ndb.StringProperty(required=True)

class Selection(ndb.Model):
	name = ndb.StringProperty()
	people = ndb.StructuredProperty(User, repeated=True)

class Poll(ndb.Model): 
	name = ndb.StringProperty()
	selections = ndb.LocalStructuredProperty(Selection, repeated=True)

class Event(ndb.Model):
	name = ndb.StringProperty(required=True)
	host_name = ndb.StringProperty(required=True)
	host_fb_id = ndb.StringProperty(required=True)
	description = ndb.StringProperty()
	picture_url = ndb.StringProperty()
	people = ndb.StructuredProperty(User, repeated=True)
	polls = ndb.LocalStructuredProperty(Poll, repeated=True)

def addEvent(event):
	event = Event(
		name = event["name"],
		host_name = event["host_name"],
		host_fb_id = event["host_fb_id"],
		description = event["description"],
		picture_url = event["picture_url"],
		people = [User(name = event["people"][0]["name"],
					   fb_id = event["people"][0]["id"])],
		polls = [Poll(name = "datetime", selections = []),
				 Poll(name = 'location', selections = [])]
	);

	key = event.put()
	key_string = key.urlsafe()

	return key_string

def editEvent(event, url_key):
	old_event = ndb.Key(urlsafe=url_key)
	old_event = old_event.get()


	old_event.name = event["name"]
	old_event.host_name = event["host_name"]
	old_event.host_fb_id = event["host_fb_id"]
	old_event.description = event["description"]
	old_event.picture_url = event["picture_url"]
	old_event.people = []

	for person in event["people"]:
		old_event.people.append(User(name = person["name"],
					   		     fb_id = person["id"]))

	key = old_event.put();
	return old_event
	

def getEvent(url_key):
	event = ndb.Key(urlsafe=url_key)
	return event.get()

def addUser(user, url_key):
	event = ndb.Key(urlsafe=url_key)
	event = event.get()
	event.people.append(User(name = user["name"],
							 fb_id = user["id"]))
	key = event.put();
	return event


def addSelection(user_selection, user_poll, url_key):
	event = ndb.Key(urlsafe=url_key)
	event = event.get()
	for poll in event.polls:
		if poll.name == user_poll:
			poll.selections.append(Selection(name = user_selection,
											 people = []))

	key = event.put();
	return event

def addVote(user, user_selection, user_poll, url_key):
	event = ndb.Key(urlsafe=url_key)
	event = event.get()
	for poll in event.polls:
		if poll.name == user_poll:
			for selection in poll.selections:
				if selection.name == user_selection:
					selection.people.append(User(name = user["name"],
							 					  fb_id = user["id"]))

	key = event.put();
	return event

def removeVote(user, user_selection, user_poll, url_key):
	event = ndb.Key(urlsafe=url_key)
	event = event.get()
	for poll in event.polls:
		if poll.name == user_poll:
			for selection in poll.selections:
				if selection.name == user_selection:
					user_obj = User(name = user["name"],
							 		fb_id = user["id"])
					selection.people.remove(user_obj)

	key = event.put();
	return event

