# Sync App

Sync App is a sample app implementing bi-directional database syncronization with using logging approach and id mapper as row key resolver.

# Benefits

  - Does not need to change your original tables
  - Allow to sync multiples server as complexity of a tree 
  - No need to create a guid primary key for each table
  - Change behavior of specific conflict
  - Minimal ammount of data for syncronization
  - Incremental syncing with limited rows to fetch, easy to implement

You can also:
  - Sync a empty server with all data from other server automaticately
  - Resolve conflicts automaticately using most recent rules
  - Design complex scheme with multiples foreign key

# Limitation
  - Does not work with circular references/foreign key
  - Does not work with circular server syncing
  - Mapping need to register all row id from other server

### Running with Docker
Sync App is very easy to install and deploy in a Docker container.

By default, the Docker will expose port ```8002```, so change this within the ```docker-composer.yml``` if necessary. When ready, simply do:

```sh
make start
```
This will create all required container and pull in the necessary dependencies. After database started, do:
```sh
make populate
```

Once done, install the test app and choose the app mode (Client or Server).

### Todos

 - Implement socket notification when data changes 

License
----

MIT

