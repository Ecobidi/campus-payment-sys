const StudentService = require('../services/student')

class StudentController {
  static async getHomePage(req, res) {
    let student = req.session.student
    res.render('student/home', {student} )
  }

  static async getLoginPage(req, res) {
    res.render('student/login')
  }

  static async handleLogin(req, res) {
    let dao = req.body
    try {
      let student = await StudentService.findByRegNo(dao.reg_no)
      if (student && student.password == dao.password) {
        req.session.student = student
        res.redirect('/student')
      } else {
        req.flash('error_msg', 'Incorrect Login Details')
        res.redirect('/student/login')
      }
    } catch (err) {
      console.log(err)
      req.flash('error_msg', 'Something went wrong, try again!')
      res.redirect('/student/login')
    }
  }

  static async handleLogout(req, res) {
    res.session.student = null
    res.redirect('/student/login')
  }

}


module.exports = StudentController