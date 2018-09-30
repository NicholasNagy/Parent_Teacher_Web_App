use heroku_1f20bf2d1e8055d;
CREATE TABLE Parents(
ParentID INT AUTO_INCREMENT PRIMARY KEY,
Fname varchar(250),
Lname varchar(250),
Email varchar(250),
ChildID varchar(250),
Pass varchar(250)
);

CREATE TABLE Teachers(
TeacherID INT AUTO_INCREMENT PRIMARY KEY,
Fname varchar(250),
Lname varchar(250),
Email varchar(250),
ClassID varchar(250),
Pass varchar(250)
);

CREATE TABLE Students(
Fname varchar(250),
Lname varchar(250),
ChildID varchar(250)
);

CREATE TABLE Classes(
ClassID varchar(250),
ChildID varchar(250)
);

CREATE TABLE Comments(
CommentID INT auto_increment PRIMARY KEY,
PostID varchar(250),
Content text,
Commentertable varchar(250),
CommenterID varchar(250),
TheDate datetime
);

CREATE TABLE Posts(
PostID INT AUTO_INCREMENT PRIMARY KEY,
ClassID varchar(250),
TeacherID varchar(250),
Content text,
Image longblob,
TheDate datetime
)




