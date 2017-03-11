module.exports = function(req, res, next) {
    console.log(req.user);
   if (req.user.isAdmin()) {
      next();
   }
   else {
      res.status(401).json({
         status:'failed',
         message: 'Access Denied'
      });
   }
};
