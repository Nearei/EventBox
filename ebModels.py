import datetime
from google.appengine.ext import ndb

class User(ndb.Model):
	name = ndb.StringProperty(required=True)
	fb_id = ndb.StringProperty(required=True)

class Location(ndb.Model):
	lat = ndb.FloatProperty()
	lon = ndb.FloatProperty()
	name = ndb.StringProperty()

class Poll(ndb.Model): 
	event_id = ndb.IntegerProperty();

class Event(ndb.Model):
	name = ndb.StringProperty(required=True)
	host_name = ndb.StringProperty(required=True)
	host_fb_id = ndb.StringProperty(required=True)
	datetime = ndb.StringProperty(required=True)
	description = ndb.StringProperty()
	location = ndb.StructuredProperty(Location)
	picture_url = ndb.StringProperty()
	people = ndb.StructuredProperty(User, repeated=True)

def addEvent(event):
	event = Event(
		name = event["name"],
		host_name = event["host_name"],
		host_fb_id = event["host_fb_id"],
		datetime = event["datetime"],
		description = event["description"],
		location = Location(lat = event["loc"]["lat"],
						   lon = event["loc"]["lon"],
						   name = event["loc"]["name"]),
		picture_url = event["picture_url"],
		people = [User(name = event["people"][0]["name"],
					   fb_id = event["people"][0]["id"])]
	);

	key = event.put();
	key_string = key.urlsafe();

	return key_string

def getEvent(url_key):
	event = ndb.Key(urlsafe=url_key)
	return event.get()


