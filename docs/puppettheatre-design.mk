Imagining Puppet Theater: a new Puppet Management Tool


High Level Requirements:

1 Hiera editing
2 Edit puppet manifests and modules in-place
3 On-disk over in-database
4 Role Based Access Control
5 Monitoring and logging pushed to external systems
6 Easily made Highly Available
7 No reinventing the wheel
8 "Continuous Integration" integration
9 Foreman integration?
10 Version control integration - initially git
11 Support multiple puppet masters?

1. Hiera editing

Initial phase: read only access

In order to create a decent functioning hiera editor interface, we need to have a proper REST API we can talk to. The current hiera tool doesnt allow querying of hiera metadata (which backends? Which hierarchy levels?). For Puppet Theatre such functionality is important. We could hack it by parsing the hiera config file and gripping through disk, but it’s less then ideal. 
We need to choose one of three options:

Add functionality to hiera to query metadata
Create a REST API layer on top of existing hiera
This option involves less work
Create a replacement for hiera completely that provides a REST API as well

Add functionality
Add REST API layer
Replace hiera
Option 3 is the most proper solution, but it brings a lot of challenges with it


# get all hiera backends 
hiera/backend/get/all

# create a new hierarchy level
hiera/level/create
# delete a hierarchy level and all of the values inside it (CAUTION)
hiera/level/delete
# get a list of all hierarchy levels defined
hiera/level/get/all
# get a list of all hierarchy levels defined under parent level xxx
hiera/level/get/all/parent/xxx

# create a key at a specified level of the hierarchy
hiera/key/create

# delete key yyy at level xxx of the hierarchy
hiera/key/delete/key/yyy/level/xxx
# delete key yyy at all levels of the hierarchy
hiera/key/delete/key/yyy/level/all

# get key yyy at level xxx of the hierarchy
hiera/key/get/key/yyy/level/xxx
# get key yyy at all levels of the hierarchy
hiera/key/get/key/yyy/level/all
# get all keys at level xxx of the hierarchy
hiera/key/get/key/all/level/xxx

2. Edit puppet manifests and modules in-place

* git should be leading here (other vcs's later)
* support for pushing branches around
* store a git pull locally, use that for editing
** while the Theater can run on the puppet master, this is not needed

3.


