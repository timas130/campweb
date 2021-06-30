"""
This script extracts number and string
values from API.java and writes them to
api.json so they can be used in JS.
"""

from json import dump
from re import findall, MULTILINE

f = open("API.java", "r")
c = f.read()
f.close()

result = {}
for m in findall(r"(int|long) ([A-Z_0-9]+) = ([0-9]+);$", c, MULTILINE):
    result[m[1]] = int(m[2])
for m in findall(r"String ([A-Z_0-9]+) = \"([^\"]+)\";$", c, MULTILINE):
    result[m[0]] = m[1]

print(len(result), "records")

dump(result, open("api.json", "w"))
