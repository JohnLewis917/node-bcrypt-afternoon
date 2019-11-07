const bcrypt = require('bcryptjs')


module.exports = {
    register: async (req, res) => {
        const {username, password, isAdmin} = req.body
        const db = req.app.get('db')
        const result = await db.get_user(username)
        if(result[0]) {res.status(409).send({message: 'Username taken'})}
        
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const registeredUser = await db.register_user(isAdmin, username, hash)
        const user = registeredUser[0]
        req.session.user = {isAdmin: user.is_Admin, id: user.id, username: user.username}
        res.status(201).send({userdata: req.session.user})
    },
    login: async (req, res) => {
        const {username, password} = req.body
        const db = req.app.get('db')
        const result = await db.get_user(username)
        const user = result[0]
        if(!user) {res.status(401).send({message: 'User not found. Please register as a new user before logging in'})}
        const isAuthenticated = bcrypt.compareSync(password, user.hash)
        if(!isAuthenticated){
            res.status(403).send({message: 'incorrect password'})
        } else {
            req.session.user = {isAdmin: user.is_Admin, id: user.id, username: user.username}
            return res.send(req.session.user)
        }
    },
    logout: async(req, res) => {
        req.session.destroy()
        res.status(200).send({message: 'logged out'})
    }
        
    
}