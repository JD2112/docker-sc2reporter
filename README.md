# docker-sc2reporter
Dockerized version of the sc2reporter program. Originally written by Björn Hallström, but through a long line of coders (2) it has ended up in my hands.

# Note!
This pipeline is as of now not ready to be deployed. It is currently in development. Without further adooooo.


# Installation

First clone the repo and then you have two options:
  * Development
  * Production

## Production

```bash
docker-compose up
```
and it should spin up. However, configuration of deployment variables is probably needed

## Development

Run an arbitrary mongodb docker.

Then create a virtual environment install the requirements. Note that scikit-bio package must be built manually when installing on an arm architecture computer.
Also, gunicorn is required to run the sc2reporter app.

To start the application run 

```
gunicorn sc2reporter:application
```
in the sc2reporter folder.

# Future development
Work in progress from highest to lowest priority:
  * Visualisation of genetic distances.
  * Generalized environment variables for easier deployment on different systems.
  * Better documentation. When the project gets closer to production, the priority of the documentation will increase.





