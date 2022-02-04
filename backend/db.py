from pymongo import MongoClient

def connect_to_db(host = 'mongodb', user_name='root', pwd='pass', db_name = 'sarscov2'):
    client = MongoClient(host=host,
                            port=27017, 
                            username=user_name, 
                            password='pass',)
    db = client[db_name]
    return db

