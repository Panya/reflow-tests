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

from subprocess import Popen

browsers = ['*googlechrome', '*safari', '*firefox']
processes = []
run_command = 'run_reflow_timer_all.py --in_file=all.csv --browser='
selenium_port = 4440

for browser in browsers:
    processes.append(Popen('python %s%s --selenium_port=%s' % (run_command, browser, str(selenium_port)), shell=True))
    selenium_port += 1

for process in processes:
    process.wait()