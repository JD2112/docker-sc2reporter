# Usage guide for development

In order to run the application first clone the project:
```bash
git clone https://github.com/Fattigman/docker-sc2reporter/
cd docker-sc2reporter
```
Then we need to install all the required packages for the application to run. 
I recommend you to use virtual environments when running this project. 
Thus create a virtual environment and install the required packages:
```bash
conda create --name sc2rep
conda activate sc2rep
conda install --file sc2reporter/requirements.txt
```
Then we need to start the database. Go into the docker-compose.yml file and comment out everything that isn't the mongo service.
Run following command with docker running in the background:
```bash
apt install docker-compose
docker-compose up
```
This spins up a mongodb. Then we need to insert users into db for the login component to work.
We open a new terminal and navigate to the docker-sc2reporter directory:
```bash
cd utils
conda activate sc2rep
python3 add_user.py
```

Then enter "Test" for every required input demanded by the python script. 
We will now start the application using gunicorn like so:
```
cd ../sc2reporter/
# --reload command insures that server updates every time a change is saved
gunicorn --reload sc2reporter:application
```
We should now have a working application at port localhost:8000

# Notes
You will have to insert the virus data yourself into the database.

Right now the log in function automatically enters a user with Test in all field.
If the Test user isn't in the database, the application won't work.

## Probable Error handling
```
[INFO] Starting gunicorn 20.1.0
[ERROR] Connection in use: ('127.0.0.1', 8000)
[ERROR] Retrying in 1 second.
[ERROR] Connection in use: ('127.0.0.1', 8000)
[ERROR] Retrying in 1 second.
[ERROR] Connection in use: ('127.0.0.1', 8000)
[ERROR] Retrying in 1 second.
[ERROR] Connection in use: ('127.0.0.1', 8000)
[ERROR] Retrying in 1 second.
[ERROR] Connection in use: ('127.0.0.1', 8000)
[3799223] [ERROR] Retrying in 1 second.
[3799223] [ERROR] Can't connect to ('127.0.0.1', 8000)

## Solution:
(sc2rep) jyotirmoy@z6g4:sc2reporter$ sudo fuser -k 8000/tcp


