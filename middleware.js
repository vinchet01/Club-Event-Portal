module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }

    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in first');
        return res.redirect('/login');
    }

    if (req.user.role !== 'admin') {
        req.flash('error', 'Only an admin can perform this action');
        return res.redirect('/events');
    }

    next();
};