#!/usr/bin/python

import re
import cgi
import sys
import string
import codecs

file = codecs.open(sys.argv[1], encoding='utf-8', mode='r')

print """
<!DOCTYPE html>
<html>
 <head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Results</title>
  <style>
    body {
      font: .8em Arial, sans-serif;
      background: #fff;
      color: #000;
    }

    .b-table {
      width: 100%;
      border-collapse: collapse;
    }

    .b-table__cell {
      border: 1px solid;
    }

    .b-table__cell_min {
      background: #DFFCD8;
    }

    .b-table__cell_max {
      background: #F7D6D6;
    }
  </style>
 </head>
 <body>
 <table class="b-table">
"""

for line in file:
    line = string.strip(line)
    line_chunks = re.split("[,;]", line)
    print "	  <tr class='b-table__row'>"
    for chunk in line_chunks:
        chunk = chunk.strip()
        chunk = cgi.escape(chunk)
        chunk = re.sub(r'\\n', '<br />', chunk)
        if not chunk or chunk == '""':
            chunk = "&nbsp;"
        print "	  <td class='b-table__cell'>" + chunk + "</td>"
    print "	 </tr>"

print """
  </table>
 </body>
</html>
"""