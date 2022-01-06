module.exports = {
  errorHandler: (err, res) => {
    if (err) {
      console.log(err)
      const statusCode = err.statusCode || 500
      return res.status(statusCode).render('error', { statusCode, message: '伺服器出了點問題，請稍候在試' })
    }
  }
}