import os
import psycopg2
import psycopg2.extras

# Constants
DB_URL = 'DATABASE_URL'
DB_NAME = 'MY_PSQL_DBNAME'
DB_USER = 'MY_PSQL_USER'
DB_HOST = 'MY_PSQL_HOST'
DB_PASSWORD = 'MY_PSQL_PASSWORD'


def establish_connection(connection_data=None):
    """
    Create a database connection based on the :connection_data: parameter
    :connection_data: Connection string attributes
    :returns: psycopg2.connection
    """
    if os.environ.get(DB_URL) is not None:
        connection_string = os.environ.get(DB_URL)
        connection = psycopg2.connect(connection_string)
        connection.autocommit = True
        return connection
    if connection_data is None:
        connection_data = get_connection_data()
    try:
        connect_str = "dbname={} user={} host={} password={}".format(connection_data['dbname'],
                                                                     connection_data['user'],
                                                                     connection_data['host'],
                                                                     connection_data['password'])
        conn = psycopg2.connect(connect_str)
        conn.autocommit = True
    except psycopg2.DatabaseError as e:
        print(f"Cannot connect to database. Error: {e}")
    else:
        return conn


def get_connection_data(db_name=None):
    """
    Give back a properly formatted dictionary based on the environment variables values which are started
    with :MY__PSQL_: prefix
    :db_name: optional parameter. By default, it uses the environment variable value.
    """
    if db_name is None:
        db_name = os.environ.get(DB_NAME)

    return {
        'dbname': db_name,
        'user': os.environ.get(DB_USER),
        'host': os.environ.get(DB_HOST),
        'password': os.environ.get(DB_PASSWORD)
    }


def execute_select(statement, variables=None, fetchall=True):
    """
    Execute SELECT statement optionally parameterized.
    Use fetchall=False to get back one value (fetchone)

    Example:
    > execute_select('SELECT %(title)s; FROM shows', variables={'title': 'Codecool'})
    statement: SELECT statement
    variables:  optional parameter dict, optional parameter fetchall"""
    result_set = []
    with establish_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute(statement, variables)
            result_set = cursor.fetchall() if fetchall else cursor.fetchone()
    return result_set


def execute_query(statement, variables=None):
    """
    Execute a SQL query with optional variables.
    :statement: SQL statement
    :variables: Dictionary of SQL parameters
    """
    with establish_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
            cursor.execute(statement, variables)
