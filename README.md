# docker-sc2reporter
Dockerized version of the "sc2reporter" web based analys tool for Sars-CoV-2
data.

Original code: Björn Hallström


# Usage

The simplest method to make this run during development is to just make a

```
docker-compose up --build
```

It should then be possible to visit the application by just entering "localhost"
in a web browser.

# Known issues

At the moment there seems to be some kind of authentication problem towards the
database. This needs further inquiry.
