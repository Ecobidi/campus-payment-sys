const router = require('express').Router()

const DepartmentRouter = require('./department')
const StudentRouter = require('./student')
const FeeRouter = require('./fee')
const InvoiceRouter = require('./payment-invoice')
const ReceiptRouter = require('./payment-receipt')
const MakePaymentRouter = require('./make-payment')
const UserRouter = require('./user')
const LoginRouter = require('./login')

const getDashboard = (req, res) => {
  res.render('dashboard')
}

router.use('/login', LoginRouter)

router.use((req, res, next) => {
  if (req.session.user) next()
  else res.redirect('/login')
})

router.get('/', getDashboard)

router.get('/dashboard', getDashboard)

router.use('/departments', DepartmentRouter)

router.use('/fees', FeeRouter)

router.use('/invoices', InvoiceRouter)

router.use('/receipts', ReceiptRouter)

router.use('/students', StudentRouter)

router.use('/make-payment', MakePaymentRouter)

router.use('/users', UserRouter)

router.use('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/login')
})

module.exports = router