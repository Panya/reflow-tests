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

"""This is a generic test to test CSS reflow speed of a given URL."""

import logging
import sys
import time
import codecs
import unittest

from selenium2 import selenium

import user_agent_parser

logging.getLogger().setLevel(logging.DEBUG)
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(message)s')

# Default flags.
FLAGS = {'selenium_host': 'localhost',
         'selenium_port': str(4444),
         'browser_start_command': '*firefox',
         'browser_urls': ['http://www.google.com/'],
         'do_beacon': True,
         'in_file': 'all.js'}

RESULTS_F = None

class TestReflowTime(unittest.TestCase):
  """Creates a selenium farm client for testing CSS / browser rendering."""

  def setUp(self):
    """Class-level setUp function to start the Selenium connection."""
    logging.debug('setUp...')
    self.selenium_host = FLAGS['selenium_host']
    self.selenium_port = FLAGS['selenium_port']
    logging.debug('Selenium host is %s:%s' % (self.selenium_host,
                                             self.selenium_port))
    self.browser_start_command = FLAGS['browser_start_command']
    logging.debug('browser_start_command: %s' % self.browser_start_command)
    self.browser_urls = FLAGS['browser_urls']

    # Start Selenium
    self.selenium = selenium(self.selenium_host, self.selenium_port,
                             self.browser_start_command, self.browser_urls[0])
    self.selenium.start('commandLineFlags=--disable-web-security')
    logging.debug('Selenium (%s) is ready.' % self.browser_start_command)


  def tearDown(self):
    """Class-level setUp function to start the Selenium connection."""
    logging.debug('tearDown...')

    # Stop the Selenium client
    if self.selenium:
      self.selenium.stop()
      time.sleep(3)

      self.selenium = None
      logging.debug('Selenium instance stopped.')


  def testReflow(self):
    """Test Reflow Time of an url by injecting our bookmarklet."""

    # We'll write UA string in output file
    filename = FLAGS['in_file']
    filename_wo_ext = filename.replace(filename[filename.find('.'):len(filename)], '')
    fullname = '%s_results.csv' % filename_wo_ext
    RESULTS_F = codecs.open(fullname, encoding='utf-8', mode='a')
    user_agent = self.selenium.get_eval('selenium.browserbot.getCurrentWindow().navigator.userAgent')
    user_agent_versions = user_agent_parser.Parse(user_agent)
    ua_str = '"%s %s.%s.%s", "", "", "", ""\n' % user_agent_versions
    RESULTS_F.write(ua_str)

    total_urls = len(self.browser_urls)
    i = 1
    for browserUrl in self.browser_urls:
      # Perform the tests on all browser/os combinations.
      logging.debug('Opening %s of %s, url(%s)...' %
                    (i, total_urls, browserUrl))
      i += 1

      self.selenium.set_timeout(100000)
      self.selenium.open(browserUrl)

      # Resize the window to something consistent.
      self.selenium.get_eval('this.browserbot.getCurrentWindow()' +
                                         '.resizeTo(1280, 1000)')

      if FLAGS['do_beacon'] == True:
        js_file = '_rt.js'
      else:
        js_file = '_rt_callback.js'
      script_src = '//yandex.st/jslibs/%s' % js_file

      # Injects the script.
      bookmarklet = ("(function(){"
          "_rnd=Math.floor(Math.random()*1000);"
          "_src='%s?rnd='+_rnd;"
          "_document=selenium.browserbot.getCurrentWindow().document;"
          "_my_script=_document.createElement('SCRIPT');"
          "_my_script.type='text/javascript';_my_script.src=_src;"
          "_document.getElementsByTagName('head')[0].appendChild(_my_script);"
          "})();" % script_src)

      self.selenium.get_eval(bookmarklet)
      logging.debug('Injected the bookmarklet, running the reflow tests.')

      # Block on the creation of the hidden input with id="rt-results"
      condition_string = ("eval(selenium.browserbot.getCurrentWindow().document"
                          ".getElementById('rt-results') != null)")
      # 20 minute timeout
      timeout = 120000000
      self.selenium.wait_for_condition(condition_string, timeout);

      # The value of this hidden input element has all of the times in it.
      results = self.selenium.get_value('rt-results')
      logging.info('rez:  ' + results)

      # Format in CSV for the outfile
      result_bits = results.split(',')
      url_title = self.selenium.get_eval('selenium.browserbot.getCurrentWindow().document.title')
      vals = [browserUrl, url_title]
      for bits in result_bits:
        token, val = bits.split('=')
        vals.append(val)

      RESULTS_F.write('"%s"\n' % '", "'.join(vals))
      logging.debug('Reflow complete w/ results: %s, for url:%s!' %
                    (results, browserUrl))

    self.selenium.close()
    time.sleep(5)

def PrintUsage():
  """Prints out usage information."""

  print 'Example Usage:'
  print ('  ./reflow_timer.py '
         '--browser_urls="http://www.google.com/" '
         '--browser_start_command="*firefox"')


def ParseFlags(argv):
  """Parse command line flags."""
  i = 1  # Skips the program name.
  while i < len(argv):
    logging.debug('Testing flag: %s' % argv[i])
    for flag in FLAGS:
      prefix = '--' + flag + '='
      if argv[i].startswith(prefix):
        value = argv[i][len(prefix):]
        if isinstance(FLAGS[flag], list):
          FLAGS[flag] = value.split(',')
        else:
          FLAGS[flag] = value
        del argv[i]
        break

  # If argv is > 1 then we didn't strip off some flag we should've
  # and that means the user passed in an unknown flag.
  if len(argv) > 1:
    PrintUsage()
    sys.exit(2)


if __name__ == '__main__':
  ParseFlags(sys.argv)
  unittest.main()
