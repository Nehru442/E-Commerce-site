import jwt from 'jsonwebtoken';

// Login Seller : /api/seller/login

export const sellerLogin = async (req, res) =>{
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { role: "seller", email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Logged In",
            token
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Seller isAuth : /api/seller/is-auth

export const isSellerAuth = async (req, res)=>{
    try {
        return res.json({success: true})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Logout Seller : /api/seller/logout

export const sellerLogout = async (req, res)=>{
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}