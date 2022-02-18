from os import lseek
import pymongo
from pprint import pprint

#Is the database existing
def connect_client():
    try:
        return pymongo.MongoClient()
    except Exception as e:
        print(e)

#Are there databases in the mongodb
def list_databases(client):
    try:
        for counter, db in enumerate(client.list_databases()):
            print(f'Database {counter+1}:',db)
    except Exception as e:
        print(e)

#What are the collections in the sarscov2 db
def list_collections(db, db_name = 'sarscov2_standalone'):
    try:
        print (f'Collections in {db_name} database:', db.list_collection_names())
    except Exception as e:
        print(e)

#Is there anything in the collections
def get_all_collection_data(db):
    for strColl in db.list_collection_names():
        print('Collection: ',strColl)
        pprint([x for x in db[strColl].find()])
    
def print_users(db):
    [print(x) for x in db.users.find()]
    print(db.users.find_one({"_id": 'Test'}))

#Runs the program
if __name__ == '__main__':
    try:
        db_name = 'sarscov2_standalone'

        client = connect_client()
        print(client)
        list_databases(client)

        db = client[db_name]
        list_collections(db, db_name)

        print_users(db)


    except Exception:
        raise Exception
