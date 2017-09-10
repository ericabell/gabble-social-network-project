# Gabble - A Social Network

The Gabble App uses Google OAuth2 as a way to authenticate users. Once
logged in, users can create 'gabs' and they can like certain 'gabs' from other
users.

All of the normal CRUD operations are supported for each user. They can create, read,
update, and delete any of their previous gabs.

The app is backed by a Postgres database and uses Sequelize (ODM) to interface
with the db.
