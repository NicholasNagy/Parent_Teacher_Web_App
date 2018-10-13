import time
from selenium import webdriver
#stops the program for 3 seconds
# time.sleep(3)
#opens web browser
browser = webdriver.Firefox()
#gets the webpage
browser.get('http://localhost:3001')

#finds all the html elements
signup = browser.find_element_by_id('button_SignUp')
fName = browser.find_element_by_id('firstName')
lName = browser.find_element_by_id('lastName')
childID = browser.find_element_by_id('childID')
email = browser.find_element_by_id('email')
password = browser.find_element_by_id('password')

#sends them the stuff to be filled out
fName.send_keys('test')
lName.send_keys('testtest')
childID.send_keys('12345')
email.send_keys('123@hotmail.com')
password.send_keys('test')
#feedback
print('Parent sent successfully')

#click on signup
signup.click()
#get new webpage for testing teacher signup
browser.get('http://localhost:3001/testteacher')

#get new elements by id from html page
signup = browser.find_element_by_id('button_SignUp')
fName = browser.find_element_by_id('firstName')
lName = browser.find_element_by_id('lastName')
classID = browser.find_element_by_id('classID')
email = browser.find_element_by_id('email')
password = browser.find_element_by_id('password')

#send new info to fill out form
fName.send_keys('test')
lName.send_keys('testtest')
classID.send_keys('12345')
email.send_keys('12345@hotmail.com')
password.send_keys('test')
#click on signup
signup.click()
#feedback
print('teacher signup successful')
