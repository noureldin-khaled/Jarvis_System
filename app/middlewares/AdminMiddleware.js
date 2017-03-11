module.exports = function(req, res, next) {
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
