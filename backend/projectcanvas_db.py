import mysql.connector

dataBase = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Tuhin@2025"
)

cursor = dataBase.cursor()

cursor.execute("CREATE DATABASE IF NOT EXISTS projectcanvas")

print("All Done!")