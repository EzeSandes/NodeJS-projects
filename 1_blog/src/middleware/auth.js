export function isAuthenticated(req, res, next) {
  if (req.session.user) return next();

  req.flash('error', 'You have to log in');
  res.redirect('/login');
}

export function isNotAuthenticated(req, res, next) {
  if (!req.session.user) return next();

  res.redirect('/admin');
}
