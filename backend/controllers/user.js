const {models:{User}} = require('../models/');
module.exports = {
    create: async (req, res) => {
        const email = String(req.body.email);
        const username = String(req.body.username);
        const password = String(req.body.password);
            await User.create({
                email, 
                username, 
                password
            });
        
    },

    validate: async (req, res) => {
        const email = String(req.body.email);
        const password = String(req.body.password);
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
          }

          const user = await User.findOne({ where: { email } });

        // Check if user exists
        if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = password === user.password; // Simple string comparison (if not hashed)
        // const isPasswordValid = await bcrypt.compare(password, user.password); // If passwords are hashed

        // Check if password is valid
         if (!isPasswordValid) {
             return res.status(401).json({ error: 'Invalid email or password' });
         }   
         
         res.status(200).json({ message: 'Login successful', user });
    }
}