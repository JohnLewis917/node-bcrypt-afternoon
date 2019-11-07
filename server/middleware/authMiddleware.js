module.exports = {
    userOnly: (req, res, next)=>{
        if(!req.session.user){
            return res.status(401).send('please log in')
        }
        next()
    },
    adminsOnly: (req, res, next) => {
        if(!req.session.user.isAdmin){
            res.status(403).send('You are not an admin')
        }
        next()
    }
}