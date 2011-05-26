#!/usr/bin/python

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Big honkin reflow timer runner"""

import getopt
import sys
import time
import os
import codecs


SELENIUM_HOST = '127.0.0.1'
SELENIUM_PORT = str(4444)

# Switches for this script.
CLI_OPTS = ['selenium_host=',
            'selenium_port=',
            'browser=',
            'in_file=']

def runReflowTimer(selenium_host, selenium_port, browser, url, input_file):
  """Calls reflow_timer.py appropriately."""
  platform_sep = './' if sys.platform != 'win32' else ''
  cmd_start_time = time.time()
  cmd = ('%sreflow_timer.py '
         '--selenium_host="%s" '
         '--selenium_port="%s" '
         '--browser_start_command="%s" '
         '--in_file="%s" '
         '--do_beacon=0 '
         '--browser_urls="%s" ' %
         (platform_sep, selenium_host, selenium_port, browser, input_file, url))
  print 'Running cmd: %s' % cmd
  os.system(cmd)
  cmd_end_time = time.time()
  cmd_run_time = cmd_end_time - cmd_start_time
  print 'Command run time was %s seconds.' % cmd_run_time


def GetURLs(file_name):
  """Reads out of file"""
  f = codecs.open(file_name, encoding='utf-8', mode='r')
  urls = []
  for line in f:
    i, url = line.split(',')
    # strip the newline
    url = url[:-1]
    urls.append('http://%s' % url)

  f.close()
  return urls


def main(argv):
  try:
    opts, args = getopt.getopt(argv, 'hg:d', CLI_OPTS)
  except getopt.GetoptError:
    print 'Cannot parse your flags.'
    sys.exit(2)

  print sys.platform
  # Set the defaults
  selenium_host = SELENIUM_HOST
  selenium_port = SELENIUM_PORT
  browser = '*firefox,*safari,*googlechrome'
  in_file = 'all.csv'

  # Parse the arguments to override the defaults.
  for opt, arg in opts:
    if opt == '--selenium_host':
      selenium_host = arg
    elif opt == '--selenium_port':
      selenium_port = arg
    elif opt == '--browser':
      browser = arg
    elif opt == '--in_file':
      in_file = arg

  browsers = browser.split(',')

  print '%s' % __file__
  for opt in CLI_OPTS:
    print ' - w/ %s%s' % (opt, eval(opt.replace('=', '')))

  urls = GetURLs(in_file)

  start_time = time.time()

  total_runs = len(browsers)

  print 'Total Runs: %s, URLs: %s, starting at %s' % (total_runs, len(urls),
                                                      start_time)
  print '--------------------------------------'
  time.sleep(3)

  i = 1
  for browser in browsers:
    print '>---------------->'
    print '%s of %s' % (i, total_runs)
    runReflowTimer(selenium_host, selenium_port, browser, ','.join(urls), in_file)
    print 'DONE'
    print '<----------------<'
    # Just a little bit of sleepy room.
    time.sleep(2)
    i += 1


  end_time = time.time()
  total_time = end_time - start_time
  print '--------------------------------------'
  print 'Total time was %s seconds.' % total_time
  print 'Now go to Oasis.'
  print '--------------------------------------'


if __name__ == '__main__':
  main(sys.argv[1:])