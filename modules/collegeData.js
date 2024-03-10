const Sequelize = require('sequelize');



var sequelize = new Sequelize('jchyvzmm', 'jchyvzmm', 'tQrmynVy-nD32dniD5gWCNr6qxpwOa7a', {
    host: 'rajje.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    },
    query:{ raw: true }
});



var Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});



var Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING,
});



Course.hasMany(Student, {foreignKey: 'course'});


module.exports.initialize = function () {
    return new Promise(function (resolve, reject) { 
        sequelize.sync().then(
            resolve()
        ).catch(()=>{
            reject("Unable to sync database!!!!");
            return;
        });       
    });
}


module.exports.getAllStudents = function(){
    return new Promise(function (resolve, reject) { 
        sequelize.sync().then(
            function () {
                Student.findAll({ 
                    attributes: ['studentNum','firstName','lastName','email','addressCity','status','course','addressStreet','addressProvince']
                    }).then(function(data){       
                        resolve(data);
                     }).catch((err) =>{
                        reject("no sudents returned");
                    });
            })
        }
    )
}



module.exports.getCourses = function(){
   return new Promise((resolve,reject)=> {
    Course.findAll().then(function(data){
        resolve(data);  
    })
    .catch((err) =>{
        reject("no courses returned");
    }); 
   });
};



module.exports.getStudentByNum = function (num) {
    return new Promise(function (resolve, reject) { 
        sequelize.sync().then(
            function () {
                Student.findAll({ 
                    attributes: ['studentNum','firstName','lastName','email','addressCity','status','course','addressStreet','addressProvince'],
                    where: {
                        studentNum: num
                    }
                    }).then(function(data){   
                        resolve(data[0]);
                     }).catch(()=>reject("no results returned"))
            }
        ).catch(()=>reject("no results returned"));
    });
};



module.exports.getStudentsByCourse = function (courseId) {
    return new Promise(function (resolve, reject) { 
        sequelize.sync().then(
            function () {
                Student.findAll({ 
                    attributes: ['studentNum','firstName','lastName','email','addressCity','status','course','addressStreet','addressProvince'],
                    where: {
                        course: courseId
                    }
                    }).then(function(data){        
                        console.log("All first names");
                        resolve(data);
                     }).catch(()=>reject("no results returned"))
            }
        ).catch(()=>reject("no results returned"));
    });
};



module.exports.getCourseById = function (id) {
    return new Promise(function (resolve, reject) { 
        sequelize.sync().then(
            function () {
                Course.findAll({ 
                    attributes: ['courseId','courseCode','courseDescription'],
                    where: {
                        courseId: id
                    }
                    }).then(function(data){        
                        console.log("All first names");
                        resolve(data[0]);
                     }).catch(()=>reject("no results returned"))
            }
        ).catch(()=>reject("no results returned"));
    });
};



module.exports.addStudent = function (StudentData) {
    return new Promise(function(resolve, reject)  {
        StudentData.TA = (StudentData.TA) ? true : false;
        for (var i in StudentData) {
            if (StudentData[i] == "") {
                StudentData[i] = null;
            }
        }
        Student.create({
            studentNum :StudentData.studentNum,
            firstName: StudentData.firstName,
            lastName: StudentData.lastName,
            email: StudentData.email,
            addressStreet: StudentData.addressStreet,
            addressCity: StudentData.addressCity,
            addressProvince: StudentData.addressProvince,
            TA: StudentData.TA,
            status: StudentData.status,
            course: StudentData.course,
        },
        )
        .then((students) => {
            resolve(students);
          })
          .catch(() => {
              reject("unable to create student");
          });
    });
};



module.exports.updateStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for(const key in studentData)
    {
        if(studentData[key]=="")
          studentData[key] = null;
    }
    return new Promise(function (resolve, reject) { 
        Student.update(studentData,{
            where: { studentNum:studentData.studentNum }
        }
        ).then(
            function () {
                resolve();
            }
        ).catch(()=>reject("unable to update student"));
    });
};



module.exports.deleteStudentByNum = function (stdNum) {
    return new Promise(function (resolve, reject) { 
        sequelize.sync().then(
            function () {
                Student.destroy({ 
                    where: {
                        studentNum: stdNum
                    }
                    }).then(function(){        
                        console.log("destroyed");
                        resolve("destroyed");
                     }).catch(()=>reject("destroy was rejected"))
            }
        ).catch(()=>reject("destroy was rejected"));
    });
};



module.exports.addCourse = function (courseData) {
    for(const key in courseData)
    {
        if(courseData[key]=="")
        courseData[key] = null;
    }
    return new Promise(function (resolve, reject) { 
        Course.create({
            courseCode: courseData.courseCode,
            courseDescription: courseData.courseDescription,
        }).then(
            function (crs) {
                console.log("course created");
                resolve("course created successfuly");
            }
        ).catch(()=>reject("unable to create course"));
    });

};



module.exports.updateCourse = function (courseData) {
    for(const key in courseData)
    {
        if(courseData[key]=="")
             courseData[key] = null;
    }
    return new Promise(function (resolve, reject) { 
        Course.update({
            courseCode: courseData.courseCode,
            courseDescription: courseData.courseDescription,
        },{
            where: { courseId:courseData.courseId }
        }
        ).then(
            function (crs) {
                console.log(`course ${crs.courseId} updated successfuly`);
                resolve(`course ${crs.courseId} updated successfuly`);
            }
        ).catch(()=>reject("unable to update course"));
    });
};



module.exports.deleteCourseById = function (id) {
    return new Promise(function (resolve, reject) { 
        sequelize.sync().then(
            function () {
                Course.destroy({ 
                    where: {
                        courseId: id
                    }
                    }).then(function(){        
                        console.log("destroyed");
                        resolve("destroyed");
                     }).catch(()=>reject("destroy was rejected"))
            }
        ).catch(()=>reject("destroy was rejected"));
    });
};